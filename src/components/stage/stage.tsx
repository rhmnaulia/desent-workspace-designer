import { useId, type ReactNode } from "react";
import { getDesk } from "@/catalog/products";
import { describeSetup } from "@/setup/describe";
import type { Setup } from "@/setup/types";
import { DESK_TOP_SITTING, FLOOR_Y, STANDING_LIFT, VIEW, layoutDesk } from "./layout";
import { Chair } from "./parts/chairs";
import { StageDefs } from "./parts/defs";
import { DeskBase, DeskTop } from "./parts/desks";
import { CoffeeCorner, Monstera } from "./parts/floor-items";
import { KeyboardAndMouse, LaptopOnStand, Lamp, LampGlow, Monitor } from "./parts/gear";
import { Room } from "./parts/room";

/**
 * The live preview. A pure function of the setup: every change re-renders it
 * and CSS does the motion (see "Motion" in globals.css):
 *  - new items mount with `drop-in`
 *  - items whose position changes glide there (`glide`)
 *  - standing desks rise at motor speed (`motor`)
 * Swapping a desk or chair remounts it (keyed by id), so it lands fresh.
 */

interface StageProps {
  setup: Setup;
  standing?: boolean;
  className?: string;
}

export function Stage({ setup, standing = false, className }: StageProps) {
  const titleId = useId();
  const layout = layoutDesk(setup);
  const desk = getDesk(setup.desk);
  const has = (id: keyof Setup["accessories"]) => (setup.accessories[id] ?? 0) > 0;
  const lift = desk.adjustable && standing ? -STANDING_LIFT : 0;

  return (
    <svg
      viewBox={`0 ${VIEW.top} ${VIEW.width} ${VIEW.height - VIEW.top}`}
      preserveAspectRatio="xMidYMax slice"
      role="img"
      aria-labelledby={titleId}
      className={className}
    >
      <title id={titleId}>{`Preview: ${describeSetup(setup, standing)}`}</title>
      <StageDefs />
      <Room />

      {has("monstera") && (
        <Placed x={Math.max(layout.left - 64, 56)} y={FLOOR_Y}>
          <Monstera />
        </Placed>
      )}

      <g className="glide" style={translate(layout.left, DESK_TOP_SITTING)}>
        <g className="motor" style={translate(0, lift)}>
          <g key={setup.desk} className="fade-in">
            <DeskTop desk={setup.desk} width={layout.width} />
          </g>
          {has("desk-lamp") && (
            <Placed x={layout.lampX}>
              <g className="switch-on">
                <LampGlow />
              </g>
              <Lamp />
            </Placed>
          )}
          {layout.monitors.map((monitor, i) => (
            <Placed key={monitor.key} x={monitor.x}>
              <Monitor size={monitor.id} seed={i} />
            </Placed>
          ))}
          {has("laptop-stand") && (
            <Placed x={layout.laptopX}>
              <LaptopOnStand />
            </Placed>
          )}
          {has("keyboard-mouse") && (
            <Placed x={layout.keyboardX}>
              <KeyboardAndMouse />
            </Placed>
          )}
        </g>
        {/* Drawn after the top so the outer leg columns hide the telescoping inner ones */}
        <g key={setup.desk} className="fade-in">
          <DeskBase desk={setup.desk} width={layout.width} />
        </g>
      </g>

      <Placed key={setup.chair} x={layout.chairX} y={FLOOR_Y}>
        <Chair chair={setup.chair} />
      </Placed>

      {has("coffee-machine") && (
        <Placed x={Math.min(layout.right + 70, VIEW.width - 52)} y={FLOOR_Y}>
          <CoffeeCorner />
        </Placed>
      )}
    </svg>
  );
}

const translate = (x: number, y: number) => ({ transform: `translate(${x}px, ${y}px)` });

/** Positions an item (gliding if it moves) and drops it in when it first appears. */
function Placed({ x, y = 0, children }: { x: number; y?: number; children: ReactNode }) {
  return (
    <g className="glide" style={translate(x, y)}>
      <g className="drop-in">{children}</g>
    </g>
  );
}
