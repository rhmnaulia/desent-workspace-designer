/**
 * Things that stand on the floor next to the desk. Origin is the item's
 * centre at floor level.
 */

const LEAF = "M0 0C-26-8-38-46-4-74C30-50 28-12 0 0Z";
const LEAVES: Array<{ x: number; y: number; angle: number; scale: number; shade: string }> = [
  { x: -6, y: -60, angle: -48, scale: 1.05, shade: "#3b7653" },
  { x: 6, y: -60, angle: 44, scale: 1.0, shade: "#3b7653" },
  { x: -2, y: -70, angle: -14, scale: 1.25, shade: "#468a62" },
  { x: 2, y: -66, angle: 18, scale: 1.12, shade: "#4f9469" },
  { x: 0, y: -58, angle: -78, scale: 0.85, shade: "#346b4b" },
  { x: 0, y: -58, angle: 80, scale: 0.8, shade: "#346b4b" },
];

export function Monstera() {
  return (
    <g>
      <ellipse cy={2} rx={40} ry={5} fill="var(--shade)" />
      <g className="sway">
        {LEAVES.map(({ x, y, angle, scale, shade }, i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${angle}) scale(${scale})`}>
            <path d="M0 6V0" stroke="#2f5f42" strokeWidth={3} />
            <path d={LEAF} fill={shade} />
            <path
              d="M0 0V-68M0-24l-14-12M0-24l12-14M0-46l-10-10M0-46l10-12"
              stroke="#2c5e40"
              strokeWidth={1.6}
              fill="none"
            />
          </g>
        ))}
      </g>
      <path d="M-32-56h64l-8 56h-48z" fill="#c46a3e" />
      <rect x={-35} y={-60} width={70} height={10} rx={3} fill="#a9572f" />
    </g>
  );
}

export function CoffeeCorner() {
  const wood = "#c99a62";
  const woodDark = "#a87842";
  return (
    <g>
      <ellipse cy={2} rx={48} ry={5} fill="var(--shade)" />
      <rect x={-4} y={-74} width={8} height={70} fill={woodDark} />
      <ellipse cy={-3} rx={26} ry={4} fill={woodDark} />
      <rect x={-46} y={-80} width={92} height={8} rx={3} fill={wood} />

      {/* Espresso machine */}
      <rect x={-30} y={-134} width={36} height={54} rx={7} fill="#b9452f" />
      <rect x={-30} y={-134} width={36} height={12} rx={6} fill="#cf5a42" />
      <rect x={-22} y={-110} width={20} height={6} rx={2} fill="#3a2a26" />
      <rect x={-26} y={-84} width={28} height={4} rx={1} fill="#3a2a26" />

      {/* Cup and steam */}
      <path d="M-18-96h12l-2 12h-8z" fill="#f4efe6" />
      <g
        className="steam"
        fill="none"
        stroke="var(--muted)"
        strokeWidth={1.6}
        strokeLinecap="round"
        opacity={0.5}
      >
        <path d="M-14-102c-3-4 3-6 0-10" />
        <path d="M-9-102c-3-4 3-6 0-10" />
      </g>

      {/* A small stack of capsules */}
      <rect x={14} y={-88} width={22} height={8} rx={2} fill="#6c4a35" />
      <rect x={16} y={-95} width={18} height={7} rx={2} fill="#8a6247" />
    </g>
  );
}

/**
 * A slim gradient light bar (the kind that washes a wall in colour). Its
 * glow lives in the lights layer, so it really shines only after dark.
 */
export function FloorLamp() {
  return (
    <g>
      <ellipse cy={2} rx={24} ry={4} fill="var(--shade)" />
      <rect x={-18} y={-6} width={36} height={6} rx={3} fill="#2f3436" />
      <rect x={-5} y={-236} width={10} height={232} rx={5} fill="url(#floor-lamp-bar)" />
    </g>
  );
}

/** A slouchy woven bean bag in the foreground: the relax corner. */
export function BeanBag() {
  return (
    <g>
      <ellipse cy={3} rx={62} ry={7} fill="var(--shade)" />
      <path d="M-58 0c-8-30 6-58 30-66 16-6 34-6 48 2 26 12 36 40 32 64z" fill="#3f7f83" />
      <path
        d="M-30-40c12-10 34-12 50-4"
        fill="none"
        stroke="#2f6467"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <path d="M-52-6c26 6 70 6 98 0" fill="none" stroke="#2f6467" strokeWidth={2} opacity={0.6} />
      <path
        d="M-40-52c8-6 18-9 28-9"
        fill="none"
        stroke="#6aa3a5"
        strokeWidth={4}
        strokeLinecap="round"
        opacity={0.7}
      />
    </g>
  );
}
