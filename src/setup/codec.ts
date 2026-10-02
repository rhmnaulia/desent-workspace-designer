import { ACCESSORIES, CHAIRS, DESKS, type AccessoryId } from "@/catalog/products";
import { normalize } from "./rules";
import type { Setup } from "./types";

/**
 * Setups travel in the URL so people can share them ("here's my desk") and so
 * the checkout page can be rendered on the server.
 *
 * Format: `<desk>.<chair>[.<accessory>[x<qty>]]...`, e.g. `xl.pro.m27x2.lamp`.
 * Human-readable on purpose: it looks fine in a chat message.
 */

/** Query parameter that carries a setup in links. Lives here, not in a client module, so server pages can read it. */
export const SETUP_PARAM = "s";

const SEPARATOR = ".";

export function encodeSetup(setup: Setup): string {
  const desk = DESKS.find((d) => d.id === setup.desk)!.code;
  const chair = CHAIRS.find((c) => c.id === setup.chair)!.code;
  const parts = [desk, chair];
  for (const { id, code } of ACCESSORIES) {
    const quantity = setup.accessories[id] ?? 0;
    if (quantity === 1) parts.push(code);
    else if (quantity > 1) parts.push(`${code}x${quantity}`);
  }
  return parts.join(SEPARATOR);
}

/** Returns null for anything that isn't a valid setup, so callers can fall back to a default. */
export function decodeSetup(value: string | null | undefined): Setup | null {
  if (!value) return null;
  const [deskCode, chairCode, ...rest] = value.split(SEPARATOR);
  const desk = DESKS.find((d) => d.code === deskCode);
  const chair = CHAIRS.find((c) => c.code === chairCode);
  if (!desk || !chair) return null;

  const accessories: Partial<Record<AccessoryId, number>> = {};
  for (const token of rest) {
    const match = /^([a-z0-9]+?)(?:x(\d{1,2}))?$/.exec(token);
    const accessory = match && ACCESSORIES.find((a) => a.code === match[1]);
    if (!accessory) continue; // Unknown tokens are skipped, not fatal: old links keep working.
    accessories[accessory.id] = match[2] ? Number(match[2]) : 1;
  }

  return normalize({ desk: desk.id, chair: chair.id, accessories });
}
