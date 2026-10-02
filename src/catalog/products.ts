/**
 * The rentable catalog. This is the single source of truth for what can be
 * picked: the designer, the stage illustration, pricing and the URL codec all
 * read from here.
 *
 * Prices are sample weekly rates in US cents (integers avoid float rounding
 * in totals), loosely based on monis.rent's public pricing.
 *
 * To add a product: add an entry here, then draw it in `components/stage/parts`.
 */

export type DeskId = "oak-desk" | "standing-desk" | "standing-desk-xl";
export type ChairId = "rattan-chair" | "mesh-chair" | "pro-chair";
export type AccessoryId =
  | "monitor-24"
  | "monitor-27"
  | "laptop-stand"
  | "keyboard-mouse"
  | "desk-lamp"
  | "monstera"
  | "coffee-machine";

interface BaseProduct<Id extends string> {
  id: Id;
  /** Short, stable token used in shareable URLs. Never change once shipped. */
  code: string;
  name: string;
  /** One line that helps someone decide, not marketing filler. */
  blurb: string;
  pricePerWeek: number;
}

export interface Desk extends BaseProduct<DeskId> {
  widthCm: number;
  depthCm: number;
  /** Electric height adjustment, which unlocks the sit/stand preview. */
  adjustable: boolean;
  /** How many monitors physically fit side by side. */
  monitorCapacity: number;
}

export interface Chair extends BaseProduct<ChairId> {
  highlights: string;
}

export interface Accessory extends BaseProduct<AccessoryId> {
  /** Monitors share the desk's capacity; everything else is a simple toggle. */
  kind: "monitor" | "single";
  /** Upper bound for the quantity stepper (monitors are further capped by the desk). */
  maxQuantity: number;
  /** Short noun used in announcements, e.g. "Added 27-inch monitor". */
  shortName: string;
}

export const DESKS: readonly Desk[] = [
  {
    id: "oak-desk",
    code: "oak",
    name: "Oak writing desk",
    blurb: "Solid, simple, fits a villa corner.",
    pricePerWeek: 400,
    widthCm: 120,
    depthCm: 60,
    adjustable: false,
    monitorCapacity: 2,
  },
  {
    id: "standing-desk",
    code: "std",
    name: "Electric standing desk",
    blurb: "Sit or stand at the press of a button.",
    pricePerWeek: 900,
    widthCm: 140,
    depthCm: 70,
    adjustable: true,
    monitorCapacity: 2,
  },
  {
    id: "standing-desk-xl",
    code: "xl",
    name: "Dual-motor standing desk XL",
    blurb: "Room for three screens and a coffee.",
    pricePerWeek: 1200,
    widthCm: 160,
    depthCm: 70,
    adjustable: true,
    monitorCapacity: 3,
  },
];

export const CHAIRS: readonly Chair[] = [
  {
    id: "rattan-chair",
    code: "rattan",
    name: "Rattan side chair",
    blurb: "Handwoven in Java. Best for short days.",
    highlights: "No adjustments",
    pricePerWeek: 200,
  },
  {
    id: "mesh-chair",
    code: "mesh",
    name: "Ergonomic mesh chair",
    blurb: "Breathable back that copes with the humidity.",
    highlights: "Lumbar support, adjustable arms",
    pricePerWeek: 500,
  },
  {
    id: "pro-chair",
    code: "pro",
    name: "Pro ergonomic chair",
    blurb: "Headrest and full adjustment for 10-hour days.",
    highlights: "Headrest, 4D arms, seat depth",
    pricePerWeek: 900,
  },
];

export const ACCESSORIES: readonly Accessory[] = [
  {
    id: "monitor-24",
    code: "m24",
    name: '24" Full HD monitor',
    shortName: "24-inch monitor",
    blurb: "Crisp second screen for docs and chat.",
    pricePerWeek: 600,
    kind: "monitor",
    maxQuantity: 3,
  },
  {
    id: "monitor-27",
    code: "m27",
    name: '27" 4K USB-C monitor',
    shortName: "27-inch monitor",
    blurb: "One cable charges your laptop too.",
    pricePerWeek: 1100,
    kind: "monitor",
    maxQuantity: 3,
  },
  {
    id: "laptop-stand",
    code: "stand",
    name: "Aluminium laptop stand",
    shortName: "laptop stand",
    blurb: "Lifts your screen to eye level.",
    pricePerWeek: 150,
    kind: "single",
    maxQuantity: 1,
  },
  {
    id: "keyboard-mouse",
    code: "keys",
    name: "Logitech MX keyboard & mouse",
    shortName: "keyboard and mouse",
    blurb: "Full-size keys, quiet clicks.",
    pricePerWeek: 400,
    kind: "single",
    maxQuantity: 1,
  },
  {
    id: "desk-lamp",
    code: "lamp",
    name: "Smart LED desk lamp",
    shortName: "desk lamp",
    blurb: "Warm light for late calls with Europe.",
    pricePerWeek: 300,
    kind: "single",
    maxQuantity: 1,
  },
  {
    id: "monstera",
    code: "plant",
    name: "Potted monstera",
    shortName: "monstera",
    blurb: "We water it when we swap it.",
    pricePerWeek: 200,
    kind: "single",
    maxQuantity: 1,
  },
  {
    id: "coffee-machine",
    code: "coffee",
    name: "Nespresso machine & side table",
    shortName: "coffee machine",
    blurb: "Includes a first box of capsules.",
    pricePerWeek: 600,
    kind: "single",
    maxQuantity: 1,
  },
];

export const MONITOR_IDS = ACCESSORIES.filter((a) => a.kind === "monitor").map((a) => a.id);

const byId = <T extends { id: string }>(list: readonly T[]) =>
  new Map(list.map((item) => [item.id, item]));

const deskMap = byId(DESKS);
const chairMap = byId(CHAIRS);
const accessoryMap = byId(ACCESSORIES);

export const getDesk = (id: DeskId): Desk => deskMap.get(id)!;
export const getChair = (id: ChairId): Chair => chairMap.get(id)!;
export const getAccessory = (id: AccessoryId): Accessory => accessoryMap.get(id)!;
