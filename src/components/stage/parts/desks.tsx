import type { DeskId } from "@/catalog/products";
import { DESK_TOP_SITTING, FLOOR_Y } from "../layout";

/**
 * Desks are drawn in two layers so standing desks can rise:
 *  - `DeskBase`: anything bolted to the floor (stays put)
 *  - `DeskTop`:  the surface and whatever moves with it
 * Both use desk-local coordinates: x = 0 is the desk's left edge,
 * y = 0 is the surface at sitting height.
 */

const LEG_LENGTH = FLOOR_Y - DESK_TOP_SITTING;

const FINISH: Record<DeskId, { top: string; edge: string }> = {
  "oak-desk": { top: "#c99a62", edge: "#a87842" },
  "standing-desk": { top: "#e4cfa8", edge: "#c4a77a" },
  "standing-desk-xl": { top: "#7d5238", edge: "#5f3c27" },
};

const METAL = "#3b3a36";
const METAL_LIGHT = "#8c877c";

interface DeskPartProps {
  desk: DeskId;
  width: number;
}

export function DeskBase({ desk, width }: DeskPartProps) {
  if (desk === "oak-desk") return null;
  return (
    <g>
      {[46, width - 46].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy={LEG_LENGTH + 2} rx={52} ry={5} fill="var(--shade)" />
          <rect x={x - 13} y={52} width={26} height={LEG_LENGTH - 56} rx={3} fill={METAL} />
          <rect x={x - 46} y={LEG_LENGTH - 7} width={92} height={7} rx={3} fill={METAL} />
        </g>
      ))}
    </g>
  );
}

export function DeskTop({ desk, width }: DeskPartProps) {
  const { top, edge } = FINISH[desk];

  if (desk === "oak-desk") {
    return (
      <g>
        <ellipse cx={width / 2} cy={LEG_LENGTH + 2} rx={width / 2} ry={6} fill="var(--shade)" />
        {[18, width - 34].map((x) => (
          <path key={x} d={`M${x} 16h16l-3 ${LEG_LENGTH - 16}h-10z`} fill={edge} />
        ))}
        <rect x={14} y={14} width={width - 28} height={22} fill={edge} />
        <rect x={width * 0.62} y={19} width={96} height={13} rx={2} fill={top} />
        <rect x={width * 0.62 + 40} y={24} width={16} height={3} rx={1.5} fill={edge} />
        <rect width={width} height={16} rx={3} fill={top} />
        <rect y={12} width={width} height={4} rx={2} fill={edge} />
      </g>
    );
  }

  const isXl = desk === "standing-desk-xl";
  return (
    <g>
      {[46, width - 46].map((x) => (
        <rect key={x} x={x - 9} y={20} width={18} height={100} fill={METAL_LIGHT} />
      ))}
      <rect x={30} y={13} width={width - 60} height={9} rx={2} fill={METAL} />
      {isXl && <rect x={width * 0.3} y={20} width={width * 0.4} height={9} rx={2} fill={METAL} />}
      <rect width={width} height={15} rx={3} fill={top} />
      <rect y={11} width={width} height={4} rx={2} fill={edge} />
      {/* Height controller with a status light */}
      <rect x={width - 74} y={15} width={34} height={9} rx={2} fill={METAL} />
      <circle cx={width - 48} cy={19.5} r={1.8} fill="#7fd6a4" />
    </g>
  );
}
