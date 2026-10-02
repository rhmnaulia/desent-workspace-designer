import type { Setup } from "@/setup/types";

/**
 * Starter setups mirror monis.rent's real bundles, so someone in a hurry can
 * get a sensible office in one tap and tweak from there.
 */
export interface Preset {
  id: string;
  name: string;
  forWho: string;
  setup: Setup;
}

export const PRESETS: readonly Preset[] = [
  {
    id: "essentials",
    name: "The Essentials",
    forWho: "Laptop, desk, decent chair",
    setup: {
      desk: "oak-desk",
      chair: "mesh-chair",
      accessories: { "laptop-stand": 1, "keyboard-mouse": 1 },
    },
  },
  {
    id: "founder",
    name: "The Founder",
    forWho: "Calls all day, one big screen",
    setup: {
      desk: "standing-desk",
      chair: "mesh-chair",
      accessories: {
        "monitor-27": 1,
        "laptop-stand": 1,
        "keyboard-mouse": 1,
        "desk-lamp": 1,
      },
    },
  },
  {
    id: "studio",
    name: "The Studio",
    forWho: "Three screens, zero compromises",
    setup: {
      desk: "standing-desk-xl",
      chair: "pro-chair",
      accessories: {
        "monitor-27": 2,
        "monitor-24": 1,
        "keyboard-mouse": 1,
        headphones: 1,
        "desk-lamp": 1,
        "floor-lamp": 1,
        monstera: 1,
        "coffee-machine": 1,
      },
    },
  },
];

/** What a first-time visitor sees: a real desk and chair, so the stage is never empty. */
export const DEFAULT_SETUP: Setup = PRESETS[0].setup;
