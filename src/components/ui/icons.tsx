import type { SVGProps } from "react";

/** The handful of icons the UI needs, inline so they cost no requests. All decorative. */

const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 20 20",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
} as const;

export const CheckIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...props}>
    <path d="M4.5 10.5l3.5 3.5 7.5-8" />
  </svg>
);

export const PlusIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...props}>
    <path d="M10 4.5v11M4.5 10h11" />
  </svg>
);

export const MinusIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...props}>
    <path d="M4.5 10h11" />
  </svg>
);

export const ArrowRightIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...props}>
    <path d="M4 10h12M11 5l5 5-5 5" />
  </svg>
);

export const ArrowLeftIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...props}>
    <path d="M16 10H4M9 5l-5 5 5 5" />
  </svg>
);

export const LinkIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...props}>
    <path d="M8.5 11.5a3 3 0 0 0 4.2 0l2.6-2.6a3 3 0 0 0-4.2-4.2l-.9.9M11.5 8.5a3 3 0 0 0-4.2 0l-2.6 2.6a3 3 0 0 0 4.2 4.2l.9-.9" />
  </svg>
);

export const SunIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...props}>
    <circle cx="10" cy="10" r="3.2" />
    <path d="M10 2.5v1.8M10 15.7v1.8M2.5 10h1.8M15.7 10h1.8M4.7 4.7l1.3 1.3M14 14l1.3 1.3M4.7 15.3L6 14M14 6l1.3-1.3" />
  </svg>
);

export const MoonIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...props}>
    <path d="M16 12.2A6.5 6.5 0 0 1 7.8 4a6.5 6.5 0 1 0 8.2 8.2z" />
  </svg>
);

export const SystemIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...props}>
    <rect x="3" y="4" width="14" height="9.5" rx="1.5" />
    <path d="M7.5 16.5h5M10 13.5v3" />
  </svg>
);

export const SunriseIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...props}>
    <path d="M5.5 14a4.5 4.5 0 0 1 9 0M2.5 14h15M10 3.5v4M7.8 5.6L10 3.5l2.2 2.1M4.2 9.2l1.2 1.2M15.8 9.2l-1.2 1.2M5 17h10" />
  </svg>
);

export const SunsetIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...props}>
    <path d="M5.5 14a4.5 4.5 0 0 1 9 0M2.5 14h15M10 3.5v4M7.8 5.4L10 7.5l2.2-2.1M4.2 9.2l1.2 1.2M15.8 9.2l-1.2 1.2M5 17h10" />
  </svg>
);
