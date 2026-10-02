import { useId, type ReactNode } from "react";
import { getDesk } from "@/catalog/products";
import type { TimeOfDay } from "@/scene/bali-time";
import { describeSetup } from "@/setup/describe";
import type { Setup } from "@/setup/types";
import { DESK_TOP_SITTING, FLOOR_Y, STANDING_LIFT, VIEW, layoutDesk } from "./layout";
import { Chair } from "./parts/chairs";
import { StageDefs } from "./parts/defs";
import { DeskBase, DeskTop } from "./parts/desks";
import { CoffeeCorner, FloorLamp, Monstera } from "./parts/floor-items";
import { Headphones, KeyboardAndMouse, LaptopOnStand, Lamp, LampGlow, Monitor } from "./parts/gear";
import {
  DeskLampLight,
  FloorLampLight,
  LaptopLight,
  PendantLight,
  ScreenLight,
} from "./parts/lights";
import { Room } from "./parts/room";

/**
 * The live preview. A pure function of the setup: every change re-renders it
 * and CSS does the motion (see "Motion" in globals.css):
 *  - new items mount with `drop-in`
 *  - items whose position changes glide there (`glide`)
 *  - standing desks rise at motor speed (`motor`)
 * Swapping a desk or chair remounts it (keyed by id), so it lands fresh.
 *
 * Lighting follows the time of day in Bali (see app/scene.css): the room is
 * drawn once, a tint is multiplied over it, and the lights layer on top makes
 * lamps and screens glow as it gets dark.
 */

interface StageProps {
  setup: Setup;
  standing?: boolean;
  /** Preview a time of day. Omit to follow the current time in Bali. */
  time?: TimeOfDay;
  className?: string;
}

export function Stage({ setup, standing = false, time, className }: StageProps) {
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
      data-time={time}
      className={`stage ${className ?? ""}`}
    >
      <title id={titleId}>{`Preview: ${describeSetup(setup, standing)}`}</title>
      <StageDefs />
      <Room />

      {has("floor-lamp") && (
        <Placed x={layout.floorLampX} y={FLOOR_Y}>
          <FloorLamp />
        </Placed>
      )}
      {has("monstera") && (
        <Placed x={layout.plantX} y={FLOOR_Y}>
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
          {has("headphones") && (
            <Placed x={layout.headphonesX}>
              <Headphones />
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
        <Placed x={layout.coffeeX} y={FLOOR_Y}>
          <CoffeeCorner />
        </Placed>
      )}

      {/* Time-of-day tint over the whole room, then the lights that cut through it */}
      <rect className="dim" y={VIEW.top} width={VIEW.width} height={VIEW.height - VIEW.top} />
      <g className="lights" aria-hidden="true">
        <PendantLight />
        {has("floor-lamp") && (
          <g className="glide" style={translate(layout.floorLampX, FLOOR_Y)}>
            <FloorLampLight />
          </g>
        )}
        <OnDesk left={layout.left} lift={lift}>
          {has("desk-lamp") && (
            <g className="glide" style={translate(layout.lampX, 0)}>
              <DeskLampLight />
            </g>
          )}
          {layout.monitors.map((monitor) => (
            <g key={monitor.key} className="glide" style={translate(monitor.x, 0)}>
              <ScreenLight size={monitor.id} />
            </g>
          ))}
          {has("laptop-stand") && (
            <g className="glide" style={translate(layout.laptopX, 0)}>
              <LaptopLight />
            </g>
          )}
        </OnDesk>
      </g>
    </svg>
  );
}

const translate = (x: number, y: number) => ({ transform: `translate(${x}px, ${y}px)` });

/** Positions children on the desk surface, rising with it when standing. */
function OnDesk({ left, lift, children }: { left: number; lift: number; children: ReactNode }) {
  return (
    <g className="glide" style={translate(left, DESK_TOP_SITTING)}>
      <g className="motor" style={translate(0, lift)}>
        {children}
      </g>
    </g>
  );
}

/** Positions an item (gliding if it moves) and drops it in when it first appears. */
function Placed({ x, y = 0, children }: { x: number; y?: number; children: ReactNode }) {
  return (
    <g className="glide" style={translate(x, y)}>
      <g className="drop-in">{children}</g>
    </g>
  );
}
