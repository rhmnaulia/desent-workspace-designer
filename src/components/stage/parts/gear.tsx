import { MONITOR_SIZE } from "../layout";

/**
 * Things that sit on the desk. Each is drawn around its own origin:
 * x = 0 is the item's centre and y = 0 is the desk surface.
 */

const BEZEL = "#1c1e21";
const STAND = "#6d6a64";

/** A few lines of syntax-coloured "code", so the screens look like they belong to a developer. */
const CODE_COLORS = ["#7fb59a", "#e0a86b", "#9ab7d8", "#7c8b91"];
const CODE_LINES: Array<[indent: number, length: number]> = [
  [0, 0.5],
  [1, 0.62],
  [2, 0.4],
  [2, 0.55],
  [1, 0.3],
  [0, 0.2],
  [0, 0.45],
  [1, 0.7],
  [2, 0.35],
];

export function Monitor({ size, seed }: { size: keyof typeof MONITOR_SIZE; seed: number }) {
  const { width, height } = MONITOR_SIZE[size];
  const neck = 38;
  const top = -(neck + height);
  const inner = { x: -width / 2 + 4, y: top + 4, w: width - 8, h: height - 10 };
  const rows = Math.floor((inner.h - 8) / 7);

  return (
    <g>
      <rect x={-26} y={-4} width={52} height={4} rx={2} fill={BEZEL} />
      <rect x={-5} y={-neck} width={10} height={neck - 3} fill={STAND} />
      <rect x={-width / 2} y={top} width={width} height={height} rx={4} fill={BEZEL} />
      <rect
        x={inner.x}
        y={inner.y}
        width={inner.w}
        height={inner.h}
        rx={1.5}
        fill="var(--screen)"
      />
      <g>
        {Array.from({ length: rows }, (_, i) => {
          const [indent, length] = CODE_LINES[(i + seed * 3) % CODE_LINES.length];
          return (
            <rect
              key={i}
              x={inner.x + 6 + indent * 7}
              y={inner.y + 6 + i * 7}
              width={(inner.w - 20) * length}
              height={3}
              rx={1.5}
              fill={CODE_COLORS[(i + seed) % CODE_COLORS.length]}
              opacity={0.85}
            />
          );
        })}
      </g>
      <rect x={inner.x} y={inner.y} width={inner.w} height={inner.h} fill="var(--screen-glow)" />
    </g>
  );
}

/** The laptop is the customer's own; the stand is what they rent. */
export function LaptopOnStand() {
  const lift = 30;
  return (
    <g>
      <path
        d={`M-30 0l10-${lift}h40l10 ${lift}h-6l-8-${lift - 6}h-32l-8 ${lift - 6}z`}
        fill="#b9b6af"
      />
      <rect x={-46} y={-lift - 5} width={92} height={5} rx={2} fill="#9fa1a5" />
      <rect x={-42} y={-lift - 64} width={84} height={59} rx={4} fill={BEZEL} />
      <rect x={-38} y={-lift - 60} width={76} height={50} rx={1.5} fill="#e9edf0" />
      <rect x={-38} y={-lift - 60} width={76} height={8} fill="#cdd6dc" />
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={-32}
          y={-lift - 46 + i * 8}
          width={i % 2 ? 40 : 56}
          height={3}
          rx={1.5}
          fill="#a6b2ba"
        />
      ))}
    </g>
  );
}

export function KeyboardAndMouse() {
  return (
    <g>
      <rect x={-56} y={-7} width={112} height={7} rx={2} fill="#2f3134" />
      <path d="M-50-4.5h100" stroke="#565a60" strokeWidth={1.5} strokeDasharray="5 2" />
      <rect x={68} y={-7} width={18} height={7} rx={3.5} fill="#2f3134" />
    </g>
  );
}

/** Arm lamp. The glow is a separate layer so it can fade in like it's switching on. */
export function Lamp() {
  const body = "#2e3a34";
  return (
    <g>
      <rect x={-18} y={-6} width={36} height={6} rx={3} fill={body} />
      <path
        d="M0-6L10-96L-40-120"
        fill="none"
        stroke={body}
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={10} cy={-96} r={5} fill={body} />
      <path d="M-52-128l26 8-8 22-34-6z" fill={body} />
      <ellipse cx={-38} cy={-102} rx={10} ry={3} fill="#ffe3b0" transform="rotate(14 -38 -102)" />
    </g>
  );
}

export function LampGlow() {
  return (
    <g>
      <path d="M-48-104L-28-98L40 0H-160z" fill="url(#lamp-cone)" />
      <ellipse cx={-60} cy={-2} rx={110} ry={10} fill="url(#lamp-pool)" />
    </g>
  );
}

/** Over-ear headphones resting on a small stand. */
export function Headphones() {
  return (
    <g>
      <rect x={-12} y={-4} width={24} height={4} rx={2} fill="#3a3f42" />
      <rect x={-2} y={-44} width={4} height={40} fill="#6d6a64" />
      <path
        d="M-15-30a15 18 0 0 1 30 0"
        fill="none"
        stroke="#2b3033"
        strokeWidth={5}
        strokeLinecap="round"
      />
      <rect x={-20} y={-34} width={10} height={16} rx={4} fill="#2b3033" />
      <rect x={10} y={-34} width={10} height={16} rx={4} fill="#2b3033" />
    </g>
  );
}
