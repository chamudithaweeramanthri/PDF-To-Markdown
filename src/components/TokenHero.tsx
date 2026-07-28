interface TokenHeroProps {
  inputTokens: number;
  outputTokens: number;
}

const CONTEXT_WINDOW = 128_000;

export function TokenHero({ inputTokens, outputTokens }: TokenHeroProps) {
  const saved = inputTokens - outputTokens;
  const reductionPct = inputTokens > 0 ? Math.round((saved / inputTokens) * 100) : 0;
  const windowUsePct = Math.min(100, Math.round((outputTokens / CONTEXT_WINDOW) * 100));
  const positive = saved > 0;

  return (
    <div className="overflow-hidden rounded-lg border border-divider bg-surface">
      <div className="grid grid-cols-1 divide-y divide-divider sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <Stat label="PDF text input" value={inputTokens.toLocaleString()} sub="tokens · raw extract" />
        <Stat label="Markdown output" value={outputTokens.toLocaleString()} sub="tokens · cleaned" />
        <div className="bg-accent-900/50 p-6">
          <h6 className="mb-2 text-[13px] uppercase tracking-[0.08em] text-accent-300">
            {positive ? 'Reduction' : 'Change'}
          </h6>
          <div className="font-heading text-[clamp(30px,4.5vw,48px)] leading-[0.95] text-accent-200">
            {positive ? '−' : '+'}{Math.abs(reductionPct)}%
          </div>
          <div className="mt-1.5 text-[13px] text-accent-300">
            {Math.abs(saved).toLocaleString()} tokens {positive ? 'saved' : 'added'}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 border-t border-divider px-6 py-3 text-[13px]">
        <span className="relative h-2 flex-1 overflow-hidden rounded-full bg-neutral-800">
          <span className="absolute inset-y-0 left-0 rounded-full bg-accent" style={{ width: `${windowUsePct}%` }} />
        </span>
        <span className="whitespace-nowrap text-muted">
          Output uses {windowUsePct}% of a {CONTEXT_WINDOW / 1000}k context window
        </span>
      </div>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="p-6">
      <h6 className="mb-2 text-[13px] uppercase tracking-[0.08em] text-muted">{label}</h6>
      <div className="font-heading text-[clamp(30px,4.5vw,48px)] leading-[0.95]">{value}</div>
      <div className="mt-1.5 text-[13px] text-muted">{sub}</div>
    </div>
  );
}
