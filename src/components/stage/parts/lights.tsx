import { MONITOR_SIZE } from "../layout";

/**
 * Light sources, drawn on a separate layer above the room's time-of-day tint
 * and screen-blended, so lamps and screens glow brighter as the room gets
 * darker. Each piece mirrors the position of the thing it lights.
 */

export function DeskLampLight() {
  return (
    <g>
      <path d="M-48-104L-28-98L60 6H-180z" fill="url(#lamp-cone)" />
      <ellipse cx={-60} cy={-2} rx={130} ry={14} fill="url(#lamp-pool)" />
    </g>
  );
}

export function FloorLampLight() {
  return <ellipse cy={-120} rx={80} ry={170} fill="url(#floor-lamp-halo)" />;
}

export function PendantLight() {
  return <ellipse cx={560} cy={70} rx={90} ry={60} fill="url(#lamp-pool)" />;
}

/** The glow of a monitor's screen, matching `Monitor`'s geometry. */
export function ScreenLight({ size }: { size: keyof typeof MONITOR_SIZE }) {
  const { width, height } = MONITOR_SIZE[size];
  return (
    <rect
      x={-width / 2 + 4}
      y={-(38 + height) + 4}
      width={width - 8}
      height={height - 10}
      rx={2}
      fill="rgb(150 210 230 / 0.35)"
    />
  );
}

export function LaptopLight() {
  return <rect x={-38} y={-90} width={76} height={50} rx={2} fill="rgb(220 235 245 / 0.45)" />;
}
