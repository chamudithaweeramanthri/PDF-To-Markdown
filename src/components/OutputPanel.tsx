import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CopyIcon, DownloadIcon, CheckIcon } from './icons';

interface OutputPanelProps {
  markdown: string;
  filename: string;
}

type Mode = 'rendered' | 'raw';

export function OutputPanel({ markdown, filename }: OutputPanelProps) {
  const [mode, setMode] = useState<Mode>('rendered');
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
    } catch {
      /* clipboard blocked — ignore */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const download = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.replace(/\.pdf$/i, '') + '.md';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="flex min-h-[440px] flex-col overflow-hidden rounded-lg border border-divider">
      <div className="flex flex-wrap items-center gap-3 border-b border-divider bg-surface px-3 py-2">
        <h5 className="pl-1 font-heading text-sm">Output.md</h5>

        <div className="ml-1 inline-flex overflow-hidden rounded-md border border-divider">
          <SegBtn active={mode === 'rendered'} onClick={() => setMode('rendered')}>Preview</SegBtn>
          <SegBtn active={mode === 'raw'} onClick={() => setMode('raw')} bordered>Raw</SegBtn>
        </div>

        <div className="ml-auto flex gap-2">
          <button
            onClick={copy}
            className="inline-flex min-w-[136px] items-center justify-center gap-1.5 rounded-md border border-divider px-3 py-2 font-heading text-sm transition-colors hover:bg-white/[0.07] active:bg-white/[0.12]"
          >
            {copied ? <CheckIcon width={15} height={15} className="text-accent-300" /> : <CopyIcon width={15} height={15} />}
            {copied ? 'Copied' : 'Copy Markdown'}
          </button>
          <button
            onClick={download}
            className="inline-flex items-center justify-center gap-1.5 rounded-md border border-accent px-3 py-2 font-heading text-sm text-accent transition-colors hover:bg-accent/10 active:bg-accent/[0.22]"
          >
            <DownloadIcon width={15} height={15} />
            Download .md
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-bg">
        {mode === 'rendered' ? (
          <div className="md mx-auto max-w-[760px] px-[clamp(20px,4vw,52px)] py-7">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
          </div>
        ) : (
          <pre className="m-0 whitespace-pre-wrap px-[clamp(20px,4vw,52px)] py-7 font-mono text-[13px] leading-[1.7] text-neutral-200">
            {markdown}
          </pre>
        )}
      </div>
    </div>
  );
}

function SegBtn({
  active,
  bordered,
  onClick,
  children,
}: {
  active: boolean;
  bordered?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 font-heading text-[13px] transition-colors ${bordered ? 'border-l border-divider' : ''} ${
        active ? 'text-accent shadow-[inset_0_0_0_1px_var(--tw-shadow-color)] shadow-accent' : 'text-text hover:bg-white/[0.06]'
      }`}
    >
      {children}
    </button>
  );
}
