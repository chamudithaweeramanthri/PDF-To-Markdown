import { BrandIcon } from './icons';

interface HeaderProps {
  showReset: boolean;
  onReset: () => void;
}

export function Header({ showReset, onReset }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-divider bg-bg/90 px-6 py-3 backdrop-blur">
      <div className="flex items-center gap-2.5 font-heading text-[15px] font-heading tracking-tight">
        <span className="inline-flex h-[26px] w-[26px] items-center justify-center rounded-md border border-accent text-accent">
          <BrandIcon width={15} height={15} />
        </span>
      Slim​Down
      </div>

      {/* <span className="text-muted text-xs uppercase tracking-[0.08em]">Internal · PDF → Markdown</span>

      <nav className="ml-6 hidden gap-6 text-sm sm:flex">
        <a href="#" aria-current="page" className="text-accent">Convert</a>
        <a href="#" className="text-muted transition-colors hover:text-text">Library</a>
        <a href="#" className="text-muted transition-colors hover:text-text">Settings</a>
      </nav> */}

      {showReset && (
        <button
          onClick={onReset}
          className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-divider px-3 py-1.5 font-heading text-sm text-text transition-colors hover:bg-white/[0.07]"
        >
          New conversion
        </button>
      )}
    </header>
  );
}
