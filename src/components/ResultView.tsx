import { FileIcon, RefreshIcon } from './icons';
import { TokenHero } from './TokenHero';
import { OutputPanel } from './OutputPanel';
import { formatBytes } from '../lib/format';
import type { Result } from '../hooks/useConversion';

interface ResultViewProps {
  result: Result;
  onReset: () => void;
}

export function ResultView({ result, onReset }: ResultViewProps) {
  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-6 px-6 pb-10 pt-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-divider bg-surface text-accent-300">
          <FileIcon width={19} height={19} />
        </span>
        <div className="mr-auto min-w-0">
          <div className="truncate font-heading text-base">{result.name}</div>
          <div className="text-xs text-muted">
            {result.pages} page{result.pages === 1 ? '' : 's'} · {formatBytes(result.size)} · converted just now
          </div>
        </div>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 rounded-md border border-divider px-3 py-2 font-heading text-sm transition-colors hover:bg-white/[0.07]"
        >
          <RefreshIcon width={15} height={15} />
          Convert another
        </button>
      </div>

      <TokenHero inputTokens={result.inputTokens} outputTokens={result.outputTokens} />
      <OutputPanel markdown={result.markdown} filename={result.name} />
    </main>
  );
}
