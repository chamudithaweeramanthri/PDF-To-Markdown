import type { SVGProps } from 'react';

const base = (props: SVGProps<SVGSVGElement>): SVGProps<SVGSVGElement> => ({
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  ...props,
});

export const FileIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M5 3h8l6 6v12H5z" /><path d="M13 3v6h6" /></svg>
);

export const BrandIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M4 4h9l7 7v9H4z" /><path d="M13 4v7h7" /></svg>
);

export const UploadIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M12 16V4" /><path d="m7 9 5-5 5 5" />
    <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
  </svg>
);

export const RefreshIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>
);

export const CopyIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15H4V5a2 2 0 0 1 2-2h9v1" /></svg>
);

export const DownloadIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M12 4v11" /><path d="m7 10 5 5 5-5" /><path d="M4 20h16" /></svg>
);

export const CheckIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="m5 12 5 5 9-11" /></svg>
);

export const WarnIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M12 3 2 20h20z" /><path d="M12 10v5" /><path d="M12 18h.01" /></svg>
);
