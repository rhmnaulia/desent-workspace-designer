import {
  ACCESSORIES,
  MONITOR_IDS,
  getAccessory,
  getDesk,
  type AccessoryId,
} from "@/catalog/products";
import type { Setup } from "./types";

/**
 * Physical constraints of a setup. Keeping them here (not in components)
 * means the UI, the URL codec and the tests all agree on what is possible.
 */

export function monitorCount(setup: Setup): number {
  return MONITOR_IDS.reduce((sum, id) => sum + (setup.accessories[id] ?? 0), 0);
}

export function monitorCapacity(setup: Setup): number {
  return getDesk(setup.desk).monitorCapacity;
}

/** Highest quantity the stepper may offer for an accessory right now. */
export function maxQuantity(setup: Setup, id: AccessoryId): number {
  const accessory = getAccessory(id);
  if (accessory.kind !== "monitor") return accessory.maxQuantity;
  const current = setup.accessories[id] ?? 0;
  const roomLeft = monitorCapacity(setup) - monitorCount(setup);
  return Math.min(accessory.maxQuantity, current + roomLeft);
}

/**
 * Returns a setup that respects every limit: quantities are whole numbers in
 * range, zero entries are dropped, and monitors fit the chosen desk.
 * When a smaller desk forces monitors out, 24" screens go first because the
 * 27" is usually the one people build around.
 */
export function normalize(setup: Setup): Setup {
  const accessories: Setup["accessories"] = {};
  for (const { id, maxQuantity: max } of ACCESSORIES) {
    const raw = Math.floor(setup.accessories[id] ?? 0);
    const quantity = Math.min(Math.max(raw, 0), max);
    if (quantity > 0) accessories[id] = quantity;
  }

  let overflow = monitorCount({ ...setup, accessories }) - monitorCapacity(setup);
  for (const id of ["monitor-24", "monitor-27"] as const) {
    if (overflow <= 0) break;
    const quantity = accessories[id] ?? 0;
    const removed = Math.min(quantity, overflow);
    overflow -= removed;
    if (quantity - removed > 0) accessories[id] = quantity - removed;
    else delete accessories[id];
  }

  return { desk: setup.desk, chair: setup.chair, accessories };
}
