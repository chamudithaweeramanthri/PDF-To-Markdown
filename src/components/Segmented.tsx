interface Option<T extends string> {
  value: T;
  label: string;
}

interface SegmentedProps<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function Segmented<T extends string>({ options, value, onChange, className = '' }: SegmentedProps<T>) {
  return (
    <div className={`inline-flex border border-divider ${className}`} role="tablist">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={`px-3 py-1.5 text-[13px] font-heading font-semibold transition-colors ${
              active ? 'bg-text text-bg' : 'text-text hover:bg-black/[0.06]'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
