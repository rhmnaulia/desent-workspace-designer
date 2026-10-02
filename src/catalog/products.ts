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
  | "headphones"
  | "desk-lamp"
  | "floor-lamp"
  | "monstera"
  | "coffee-machine"
  | "bean-bag";

interface BaseProduct<Id extends string> {
  id: Id;
  /** Short, stable token used in shareable URLs. Never change once shipped. */
  code: string;
  name: string;
  /** One line that helps someone decide, not marketing filler. */
  blurb: string;
  pricePerWeek: number;
  /** File name of the product photo on monis.rent's image host, when monis.rent stocks this exact item. */
  photo?: string;
  /** Short facts for the details sheet. */
  specs: string[];
  /** Why renting beats buying this one, in a sentence. */
  why: string;
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
  /** Where it lives, which is how the Gear step groups things. */
  zone: "desk" | "room";
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
    specs: ["120 × 60 cm top", "Solid oak, oiled", "Fixed height, 75 cm"],
    why: "Fits the corner of most villa bedrooms, and goes back when you move on.",
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
    photo: "Electrical_Adjustable_Desk_new_1_5e5987de34.jpg",
    specs: ["140 × 70 cm top", "Electric, 70–118 cm", "Memory presets"],
    why: "Standing for part of the day is the cheapest back fix there is. Try it for a month before you buy one at home.",
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
    photo: "Dual_Motor_Standing_Desk_8_9f364ae87f.jpg",
    specs: ["160 × 70 cm top", "Dual motor, up to 120 kg", "Fits three screens"],
    why: "Big enough for a full studio setup, and you never have to ship it home.",
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
    specs: ["Handwoven rattan, teak legs", "Seat height 45 cm", "No adjustments"],
    why: "Good for short sessions and looks right in a joglo. Swap it for an ergonomic chair anytime.",
    pricePerWeek: 200,
  },
  {
    id: "mesh-chair",
    code: "mesh",
    name: "Ergonomic mesh chair",
    blurb: "Breathable back that copes with the humidity.",
    highlights: "Lumbar support, adjustable arms",
    photo: "fantech_oca259s_chair_1_97e50244e7.jpg",
    specs: ["Breathable mesh back", "Adjustable lumbar and arms", "Tilt lock"],
    why: "Mesh stays cool in Bali humidity, where foam chairs get sticky.",
    pricePerWeek: 500,
  },
  {
    id: "pro-chair",
    code: "pro",
    name: "Pro ergonomic chair",
    blurb: "Headrest and full adjustment for 10-hour days.",
    highlights: "Headrest, 4D arms, seat depth",
    specs: ["Headrest and 4D arms", "Seat depth and tilt adjust", "Up to 150 kg"],
    why: "The chair for 10-hour days, without the price of buying one for a three-month stay.",
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
    photo: "24_full_HD_office_monitor_a24i_2026_be9e6bf958.jpg",
    specs: ["24-inch, 1920 × 1080", "IPS, 75 Hz", "HDMI and DisplayPort"],
    why: "A second screen doubles what fits in view. Cables included.",
    pricePerWeek: 600,
    zone: "desk",
    kind: "monitor",
    maxQuantity: 3,
  },
  {
    id: "monitor-27",
    code: "m27",
    name: '27" 4K USB-C monitor',
    shortName: "27-inch monitor",
    blurb: "One cable charges your laptop too.",
    photo: "27_4_K_A27_U_Multitasking_Monitor_1_ce29d15357.jpg",
    specs: ["27-inch, 3840 × 2160", "USB-C with laptop charging", "Height-adjustable stand"],
    why: "One cable for picture and power: plug in your laptop and you're working.",
    pricePerWeek: 1100,
    zone: "desk",
    kind: "monitor",
    maxQuantity: 3,
  },
  {
    id: "laptop-stand",
    code: "stand",
    name: "Aluminium laptop stand",
    shortName: "laptop stand",
    blurb: "Lifts your screen to eye level.",
    photo: "Laptop_stand_back_new2_91df29c3c8.jpg",
    specs: ["Aluminium, foldable", "Fits 11 to 17-inch laptops", "Six height steps"],
    why: "Puts your laptop screen at eye level, so your neck survives the trip.",
    pricePerWeek: 150,
    zone: "desk",
    kind: "single",
    maxQuantity: 1,
  },
  {
    id: "keyboard-mouse",
    code: "keys",
    name: "Logitech MX keyboard & mouse",
    shortName: "keyboard and mouse",
    blurb: "Full-size keys, quiet clicks.",
    photo: "Logitech_MX_keys_1_9977480ae1.jpg",
    specs: ["Logitech MX Keys", "MX Master mouse", "Bluetooth, USB-C charging"],
    why: "Full-size keys and a proper mouse make a laptop feel like a workstation.",
    pricePerWeek: 400,
    zone: "desk",
    kind: "single",
    maxQuantity: 1,
  },
  {
    id: "headphones",
    code: "phones",
    name: "Noise-cancelling headphones",
    shortName: "pair of headphones",
    blurb: "For calls next to a rooster.",
    specs: ["Active noise cancelling", "30-hour battery", "Bluetooth multipoint"],
    why: "Roosters, scooters and construction: Bali is loud. Your calls don't have to be.",
    pricePerWeek: 500,
    zone: "desk",
    kind: "single",
    maxQuantity: 1,
  },
  {
    id: "desk-lamp",
    code: "lamp",
    name: "Smart LED desk lamp",
    shortName: "desk lamp",
    blurb: "Warm light for late calls with Europe.",
    photo: "Xiaomi_Mi_Led_Desk_Lamp_1_S_1_63cee423d6.jpg",
    specs: ["Adjustable colour temperature", "Dimmable, flicker-free", "App and voice control"],
    why: "Villa lighting is usually one ceiling bulb. This makes late calls with Europe easier on the eyes.",
    pricePerWeek: 300,
    zone: "desk",
    kind: "single",
    maxQuantity: 1,
  },
  {
    id: "floor-lamp",
    code: "flamp",
    name: "Gradient floor lamp",
    shortName: "floor lamp",
    blurb: "Washes the wall in sunset colours after dark.",
    specs: ["Slim gradient light bar", "Millions of colours", "App controlled"],
    why: "Turns a rented room into your room after dark.",
    pricePerWeek: 500,
    zone: "room",
    kind: "single",
    maxQuantity: 1,
  },
  {
    id: "monstera",
    code: "plant",
    name: "Potted monstera",
    shortName: "monstera",
    blurb: "We water it when we swap it.",
    specs: ["Monstera deliciosa, about 1 m", "Ceramic pot", "Watered when we visit"],
    why: "Plants make a room feel lived in. We take it back when you leave, alive.",
    pricePerWeek: 200,
    zone: "room",
    kind: "single",
    maxQuantity: 1,
  },
  {
    id: "coffee-machine",
    code: "coffee",
    name: "Nespresso machine & side table",
    shortName: "coffee machine",
    blurb: "Includes a first box of capsules.",
    photo: "NESPRESSO_Essenza_Mini_1_b87883f961.jpg",
    specs: ["Nespresso Essenza Mini", "With a small side table", "First box of capsules included"],
    why: "Good coffee without a scooter ride to the café.",
    pricePerWeek: 600,
    zone: "room",
    kind: "single",
    maxQuantity: 1,
  },
  {
    id: "bean-bag",
    code: "beanbag",
    name: "Woven bean bag",
    shortName: "bean bag",
    blurb: "For reading, naps and pretending to think.",
    specs: ["Woven outdoor fabric", "Washable cover", "About 90 cm wide"],
    why: "A second spot to sit, for reading and thinking away from the desk.",
    pricePerWeek: 300,
    zone: "room",
    kind: "single",
    maxQuantity: 1,
  },
];

/** monis.rent serves its product photos from here (allowed in next.config.ts). */
export const PHOTO_HOST = "https://strapi.monis.rent/uploads/";

export const MONITOR_IDS = ACCESSORIES.filter((a) => a.kind === "monitor").map((a) => a.id);

const byId = <T extends { id: string }>(list: readonly T[]) =>
  new Map(list.map((item) => [item.id, item]));

const deskMap = byId(DESKS);
const chairMap = byId(CHAIRS);
const accessoryMap = byId(ACCESSORIES);

export const getDesk = (id: DeskId): Desk => deskMap.get(id)!;
export const getChair = (id: ChairId): Chair => chairMap.get(id)!;
export const getAccessory = (id: AccessoryId): Accessory => accessoryMap.get(id)!;

export type ProductRef =
  | { type: "desk"; product: Desk }
  | { type: "chair"; product: Chair }
  | { type: "accessory"; product: Accessory };

export type ProductId = DeskId | ChairId | AccessoryId;

/** Looks up any product by id, with its type, for UI that handles all three kinds. */
export function findProduct(id: ProductId): ProductRef {
  if (deskMap.has(id as DeskId)) return { type: "desk", product: getDesk(id as DeskId) };
  if (chairMap.has(id as ChairId)) return { type: "chair", product: getChair(id as ChairId) };
  return { type: "accessory", product: getAccessory(id as AccessoryId) };
}
