import type { ChairId } from "@/catalog/products";

/**
 * Chairs, front view. Origin is the centre of the chair where it touches
 * the floor; everything is drawn upward (negative y).
 */

export function Chair({ chair }: { chair: ChairId }) {
  switch (chair) {
    case "rattan-chair":
      return <RattanChair />;
    case "mesh-chair":
      return <OfficeChair body="#34353a" mesh="mesh-charcoal" frame="#26272b" />;
    case "pro-chair":
      return <OfficeChair body="#2f3d38" mesh="mesh-forest" frame="#1f2a26" headrest />;
  }
}

function RattanChair() {
  const cane = "#c08a4e";
  const caneDark = "#9a6a35";
  return (
    <g>
      <ellipse cy={2} rx={60} ry={6} fill="var(--shade)" />
      {/* Back legs sit slightly inside the front ones */}
      <rect x={-34} y={-92} width={6} height={92} rx={2} fill={caneDark} />
      <rect x={28} y={-92} width={6} height={92} rx={2} fill={caneDark} />
      <path d="M-44-176q44-26 88 0v84h-88z" fill="url(#weave)" stroke={cane} strokeWidth={5} />
      <rect x={-52} y={-96} width={104} height={12} rx={4} fill={cane} />
      <rect x={-48} y={-84} width={7} height={84} rx={2} fill={cane} />
      <rect x={41} y={-84} width={7} height={84} rx={2} fill={cane} />
      <rect x={-46} y={-40} width={92} height={4} rx={2} fill={caneDark} />
    </g>
  );
}

interface OfficeChairProps {
  body: string;
  /** ID of a mesh pattern from `StageDefs`. */
  mesh: string;
  frame: string;
  headrest?: boolean;
}

function OfficeChair({ body, mesh, frame, headrest = false }: OfficeChairProps) {
  return (
    <g>
      <ellipse cy={2} rx={66} ry={6} fill="var(--shade)" />

      {/* Five-star base and gas lift */}
      <path d="M-56-12h112l-6 6h-100z" fill={frame} />
      {[-52, 0, 52].map((x) => (
        <circle key={x} cx={x} cy={-5} r={5} fill={frame} />
      ))}
      <rect x={-5} y={-74} width={10} height={62} rx={2} fill="#7d7a73" />

      {/* Backrest, drawn behind the seat */}
      {headrest && (
        <>
          <rect x={-5} y={-214} width={10} height={20} fill={frame} />
          <rect x={-32} y={-232} width={64} height={22} rx={10} fill={body} />
        </>
      )}
      <rect x={-6} y={-104} width={12} height={30} fill={frame} />
      <path
        d="M-46-196q46-14 92 0l-4 98q-42 10-84 0z"
        fill={`url(#${mesh})`}
        stroke={frame}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <path d="M-34-126q34 10 68 0" stroke={frame} strokeWidth={3} fill="none" opacity={0.6} />

      {/* Seat and armrests */}
      <rect x={-54} y={-92} width={108} height={18} rx={8} fill={body} />
      {[-1, 1].map((side) => (
        <g key={side}>
          <rect x={side * 50 - 3} y={-118} width={6} height={30} fill={frame} />
          <rect
            x={side * 50 - (side < 0 ? 16 : 6)}
            y={-124}
            width={22}
            height={8}
            rx={4}
            fill={body}
          />
        </g>
      ))}
    </g>
  );
}
