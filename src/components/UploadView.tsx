import { useRef, useState, type DragEvent } from 'react';
import { UploadIcon, WarnIcon } from './icons';

interface UploadViewProps {
  onFile: (file: File) => void;
  error: string | null;
}

const steps = [
  { n: '01 · Extract', body: 'Text, headings and lists are pulled out of the PDF in reading order, page by page.' },
  { n: '02 · Compress', body: 'Running headers, footers and page numbers are dropped and whitespace collapsed — where the token savings come from.' },
  { n: '03 · Ship to chat', body: 'Copy the Markdown or download the .md and paste it straight into any model.' },
];

const chips = ['.pdf', 'Runs in your browser', 'Nothing uploaded', 'Real token count'];

export function UploadView({ onFile, error }: UploadViewProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const take = (f: File | undefined) => {
    if (f && f.type === 'application/pdf') onFile(f);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    take(e.dataTransfer.files?.[0]);
  };

  return (
    <main className="mx-auto flex w-full max-w-[1000px] flex-1 flex-col gap-8 px-6 py-10">
      <div className="mx-auto max-w-[700px] text-center">
        <span className="mb-4 inline-block rounded-md border border-divider px-2.5 py-1 text-xs uppercase tracking-[0.08em] text-accent">
          🌬️ LET YOUR LLM BREATHE
        </span>
        <h1 className="mb-5 text-[40px] leading-[1.05]">Turn heavy PDFs into lean Markdown.</h1>
        <p className="mx-auto max-w-[74ch] text-[17px] text-muted mt-4">
          Strip the layout, repeated headers and page furniture that blow past your LLM&apos;s context
          window. Drop in a document and get clean, token-efficient Markdown your team can paste
          straight into chat — converted right here in your browser.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 rounded-md border border-accent-700 bg-accent-900/40 px-4 py-3 text-sm">
          <WarnIcon width={17} height={17} className="mt-0.5 shrink-0 text-accent-300" />
          <span><strong className="font-heading">Couldn&apos;t convert that file.</strong> {error}</span>
        </div>
      )}

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-start gap-4 rounded-lg border-2 border-dashed px-6 py-[clamp(32px,6vw,60px)] transition-colors ${
          dragging ? 'border-accent bg-accent-900/40' : 'border-neutral-700 bg-surface hover:border-neutral-600'
        }`}
      >
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-lg border border-accent-700 bg-accent-900/60 text-accent-300">
          <UploadIcon width={26} height={26} />
        </span>
        <div>
          <h3 className="mb-1 text-lg">Drop a PDF here</h3>
          <p className="text-sm text-muted">
            or <span className="font-heading text-accent-300">browse files</span> — processed locally, up to ~50 MB
          </p>
        </div>
        <div className="mt-1 flex flex-wrap gap-2">
          {chips.map((c) => (
            <span key={c} className="rounded-sm border border-divider px-2 py-0.5 text-xs text-muted">{c}</span>
          ))}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => take(e.target.files?.[0])}
        />
      </div>

      <div className="grid gap-6 pt-2 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
        {steps.map((s) => (
          <div key={s.n}>
            <h6 className="mb-1.5 text-[13px] uppercase tracking-[0.08em] text-accent">{s.n}</h6>
            <p className="text-sm text-muted">{s.body}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
