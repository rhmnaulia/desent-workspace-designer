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
