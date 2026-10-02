import { describe, expect, it } from "vitest";
import { DEFAULT_SETUP, PRESETS } from "@/catalog/presets";
import { announceChange } from "./announce";
import { decodeSetup, encodeSetup } from "./codec";
import { describeSetup } from "./describe";
import { RENTAL_TERMS, formatPrice, lineItems, quote, weeklyTotal } from "./pricing";
import { setupReducer } from "./reducer";
import { maxQuantity, monitorCount, normalize } from "./rules";
import type { Setup } from "./types";

const xlStudio: Setup = {
  desk: "standing-desk-xl",
  chair: "pro-chair",
  accessories: { "monitor-27": 2, "monitor-24": 1, "desk-lamp": 1 },
};

describe("rules", () => {
  it("caps monitors at the desk's capacity", () => {
    expect(maxQuantity(xlStudio, "monitor-27")).toBe(2);
    expect(maxQuantity({ ...xlStudio, accessories: {} }, "monitor-27")).toBe(3);
  });

  it("drops 24-inch monitors first when a smaller desk can't fit them all", () => {
    const result = normalize({ ...xlStudio, desk: "oak-desk" });
    expect(result.accessories).toEqual({ "monitor-27": 2, "desk-lamp": 1 });
  });

  it("removes zero, negative and fractional quantities", () => {
    const result = normalize({
      ...DEFAULT_SETUP,
      accessories: { monstera: 0, "desk-lamp": -2, "keyboard-mouse": 1.7, "laptop-stand": 5 },
    });
    expect(result.accessories).toEqual({ "keyboard-mouse": 1, "laptop-stand": 1 });
  });

  it("keeps every preset within its own limits", () => {
    for (const preset of PRESETS) {
      expect(normalize(preset.setup)).toEqual(preset.setup);
    }
  });
});

describe("setupReducer", () => {
  it("swaps the chair without touching accessories", () => {
    const next = setupReducer(xlStudio, { type: "selectChair", chair: "rattan-chair" });
    expect(next.chair).toBe("rattan-chair");
    expect(next.accessories).toEqual(xlStudio.accessories);
  });

  it("clamps monitors when switching to a smaller desk", () => {
    const next = setupReducer(xlStudio, { type: "selectDesk", desk: "standing-desk" });
    expect(monitorCount(next)).toBe(2);
  });

  it("refuses to add a monitor beyond capacity", () => {
    const next = setupReducer(xlStudio, {
      type: "setQuantity",
      accessory: "monitor-24",
      quantity: 2,
    });
    expect(monitorCount(next)).toBe(3);
  });

  it("removes an accessory when its quantity drops to zero", () => {
    const next = setupReducer(xlStudio, {
      type: "setQuantity",
      accessory: "desk-lamp",
      quantity: 0,
    });
    expect(next.accessories).not.toHaveProperty("desk-lamp");
  });
});

describe("pricing", () => {
  it("lists desk and chair first, then accessories in catalog order", () => {
    expect(lineItems(xlStudio).map((i) => i.id)).toEqual([
      "standing-desk-xl",
      "pro-chair",
      "monitor-24",
      "monitor-27",
      "desk-lamp",
    ]);
  });

  it("multiplies by quantity", () => {
    // desk 1200 + chair 900 + 24" 600 + 2 x 27" 2200 + lamp 300
    expect(weeklyTotal(xlStudio)).toBe(5200);
  });

  it("applies the term discount to the full term", () => {
    const threeMonths = RENTAL_TERMS.find((t) => t.id === "3m")!;
    expect(quote(xlStudio, threeMonths)).toEqual({
      weekly: 5200,
      gross: 67600,
      savings: 13520,
      total: 54080,
    });
  });

  it("formats whole dollars without cents", () => {
    expect(formatPrice(1200)).toBe("$12");
    expect(formatPrice(150)).toBe("$1.50");
  });
});

describe("codec", () => {
  it("round-trips every preset", () => {
    for (const { setup } of PRESETS) {
      expect(decodeSetup(encodeSetup(setup))).toEqual(setup);
    }
  });

  it("produces short, readable codes", () => {
    expect(encodeSetup(xlStudio)).toBe("xl.pro.m24.m27x2.lamp");
  });

  it.each([null, "", "nope", "oak", "oak.throne", "🙂.mesh"])("rejects %j", (value) => {
    expect(decodeSetup(value)).toBeNull();
  });

  it("ignores unknown accessories and clamps impossible quantities", () => {
    expect(decodeSetup("oak.mesh.jetpack.m27x9.lamp")).toEqual({
      desk: "oak-desk",
      chair: "mesh-chair",
      accessories: { "monitor-27": 2, "desk-lamp": 1 },
    });
  });
});

describe("announceChange", () => {
  it("describes additions with the new total", () => {
    const next = setupReducer(xlStudio, {
      type: "setQuantity",
      accessory: "monstera",
      quantity: 1,
    });
    expect(announceChange(xlStudio, next)).toBe("Added monstera. Weekly total $54.");
  });

  it("explains monitors removed by a smaller desk", () => {
    const next = setupReducer(xlStudio, { type: "selectDesk", desk: "oak-desk" });
    expect(announceChange(xlStudio, next)).toBe(
      "Desk changed to Oak writing desk. Removed 24-inch monitor to fit the 120 cm desk. Weekly total $38.",
    );
  });

  it("says nothing when nothing changed", () => {
    expect(announceChange(xlStudio, xlStudio)).toBe("");
  });
});

describe("describeSetup", () => {
  it("uses the right article", () => {
    expect(describeSetup({ desk: "oak-desk", chair: "mesh-chair", accessories: {} })).toBe(
      "120 cm oak writing desk, with an ergonomic mesh chair.",
    );
  });

  it("reads like a sentence", () => {
    expect(describeSetup(xlStudio, true)).toBe(
      "160 cm dual-motor standing desk XL, raised to standing height, with a pro ergonomic chair, a 24-inch monitor, two 27-inch monitors and a desk lamp.",
    );
  });
});
