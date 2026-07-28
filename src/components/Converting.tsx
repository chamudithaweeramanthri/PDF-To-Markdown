import { FileIcon } from './icons';

interface ConvertingProps {
  name: string;
  progress: number;
}

export function Converting({ name, progress }: ConvertingProps) {
  const pct = Math.round(progress * 100);
  return (
    <main className="mx-auto flex w-full max-w-[560px] flex-1 flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-lg border border-accent-700 bg-accent-900/60 text-accent-300">
        <FileIcon width={26} height={26} />
      </span>
      <div>
        <h2 className="mb-1 text-2xl">Converting…</h2>
        <p className="text-sm text-muted">{name}</p>
      </div>
      <div className="w-full">
        <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-800">
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-200 ease-out"
            style={{ width: `${Math.max(6, pct)}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted">
          <span>Extracting &amp; cleaning text</span>
          <span>{pct}%</span>
        </div>
      </div>
    </main>
  );
}
