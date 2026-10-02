import { getDesk, type AccessoryId } from "@/catalog/products";
import type { Setup } from "@/setup/types";

/**
 * Where things go on the stage. Pure geometry, separated from the drawing so
 * it can be tested and so parts stay dumb.
 *
 * The scene is an 800-wide front view. The core 0..480 band always shows;
 * 80 extra units of wall above it are revealed when the stage has room
 * (the SVG crops from the top on wide, short containers). Desk-top items are positioned
 * relative to the desk's top-left corner (y grows downward, 0 = desk surface),
 * which lets the whole desk top rise as one group when it switches to standing.
 */

export const VIEW = { width: 800, height: 480, top: -80 } as const;
/** y where feet touch the floor. */
export const FLOOR_Y = 432;
export const DESK_TOP_SITTING = 300;
/** 75 cm to roughly 110 cm, at this scene's scale. */
export const STANDING_LIFT = 62;
const PX_PER_CM = 3.2;
const EDGE = 16;
const GAP = 8;

export const MONITOR_SIZE: Record<"monitor-24" | "monitor-27", { width: number; height: number }> =
  {
    "monitor-24": { width: 112, height: 68 },
    "monitor-27": { width: 132, height: 80 },
  };

const LAPTOP_SPAN = 100;
const LAMP_SPAN = 64;

export interface PlacedMonitor {
  /** Stable key so React keeps the same element when screens shuffle. */
  key: string;
  id: "monitor-24" | "monitor-27";
  /** Centre x relative to the desk's left edge. */
  x: number;
}

export interface DeskLayout {
  width: number;
  left: number;
  right: number;
  monitors: PlacedMonitor[];
  laptopX: number;
  lampX: number;
  keyboardX: number;
  chairX: number;
}

export function layoutDesk(setup: Setup): DeskLayout {
  const desk = getDesk(setup.desk);
  const width = desk.widthCm * PX_PER_CM;
  const left = VIEW.width / 2 - width / 2;
  const has = (id: AccessoryId) => (setup.accessories[id] ?? 0) > 0;

  // Bigger screens sit in the middle, where your eyes rest.
  const ids: PlacedMonitor["id"][] = [
    ...Array<"monitor-24">(setup.accessories["monitor-24"] ?? 0).fill("monitor-24"),
    ...Array<"monitor-27">(setup.accessories["monitor-27"] ?? 0).fill("monitor-27"),
  ];
  if (ids.length === 3) ids.splice(1, 0, ids.pop()!);

  const totalWidth =
    ids.reduce((sum, id) => sum + MONITOR_SIZE[id].width, 0) + GAP * Math.max(ids.length - 1, 0);

  // Prefer the free span between laptop and lamp; if the screens don't fit
  // there, centre them and let the laptop sit in front, as it would in real life.
  const spanStart = has("laptop-stand") ? EDGE + LAPTOP_SPAN : EDGE;
  const spanEnd = has("desk-lamp") ? width - LAMP_SPAN : width - EDGE;
  const centre = totalWidth <= spanEnd - spanStart ? (spanStart + spanEnd) / 2 : width / 2;

  const counts = new Map<string, number>();
  let cursor = centre - totalWidth / 2;
  const monitors = ids.map((id) => {
    const n = counts.get(id) ?? 0;
    counts.set(id, n + 1);
    const { width: w } = MONITOR_SIZE[id];
    const placed = { key: `${id}-${n}`, id, x: cursor + w / 2 };
    cursor += w + GAP;
    return placed;
  });

  return {
    width,
    left,
    right: left + width,
    monitors,
    laptopX: EDGE + LAPTOP_SPAN / 2,
    lampX: width - LAMP_SPAN / 2 - 4,
    keyboardX: width / 2 - 40,
    // Pulled out a little to the right, so the desk top stays visible.
    chairX: VIEW.width / 2 + 70,
  };
}
