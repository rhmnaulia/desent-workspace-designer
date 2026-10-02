import { ACCESSORIES, MONITOR_IDS, getChair, getDesk } from "@/catalog/products";
import { listToSentence } from "./describe";
import { formatPrice, weeklyTotal } from "./pricing";
import type { Setup } from "./types";

/**
 * Builds the sentence a screen reader hears after a change, e.g.
 * "Added 27-inch monitor. Weekly total $41." Derived from the before/after
 * diff, so it stays correct no matter which control caused the change.
 */
export function announceChange(prev: Setup, next: Setup): string {
  const parts: string[] = [];

  if (prev.desk !== next.desk) parts.push(`Desk changed to ${getDesk(next.desk).name}.`);
  if (prev.chair !== next.chair) parts.push(`Chair changed to ${getChair(next.chair).name}.`);

  const added: string[] = [];
  const removed: string[] = [];
  for (const { id, shortName } of ACCESSORIES) {
    const delta = (next.accessories[id] ?? 0) - (prev.accessories[id] ?? 0);
    const label = Math.abs(delta) > 1 ? `${Math.abs(delta)} × ${shortName}` : shortName;
    if (delta > 0) added.push(label);
    if (delta < 0) removed.push(label);
  }
  if (added.length) parts.push(`Added ${listToSentence(added)}.`);
  if (removed.length) {
    const forcedByDesk = prev.desk !== next.desk && removedOnlyMonitors(prev, next);
    parts.push(
      forcedByDesk
        ? `Removed ${listToSentence(removed)} to fit the ${getDesk(next.desk).widthCm} cm desk.`
        : `Removed ${listToSentence(removed)}.`,
    );
  }

  if (parts.length === 0) return "";
  parts.push(`Weekly total ${formatPrice(weeklyTotal(next))}.`);
  return parts.join(" ");
}

function removedOnlyMonitors(prev: Setup, next: Setup): boolean {
  return ACCESSORIES.every(
    ({ id }) =>
      MONITOR_IDS.includes(id) || (prev.accessories[id] ?? 0) === (next.accessories[id] ?? 0),
  );
}

/** Used for the capacity hint next to monitor steppers. */
export function capacityHint(setup: Setup): string {
  const desk = getDesk(setup.desk);
  return `The ${desk.widthCm} cm desk fits ${desk.monitorCapacity} screens.`;
}
