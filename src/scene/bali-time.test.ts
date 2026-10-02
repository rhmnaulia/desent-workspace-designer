import { describe, expect, it } from "vitest";
import { baliClock, baliHour, sceneTimeScript, timeOfDayAt } from "./bali-time";

describe("timeOfDayAt", () => {
  it.each([
    [4, "night"],
    [5, "morning"],
    [8, "morning"],
    [9, "day"],
    [15, "day"],
    [16, "sunset"],
    [18, "sunset"],
    [19, "night"],
    [0, "night"],
  ] as const)("%i:00 is %s", (hour, expected) => {
    expect(timeOfDayAt(hour)).toBe(expected);
  });
});

describe("Bali clock", () => {
  it("is UTC+8 regardless of the visitor's time zone", () => {
    const at = new Date("2026-10-02T10:30:00Z");
    expect(baliHour(at)).toBe(18);
    expect(baliClock(at)).toBe("18:30");
  });

  it("wraps past midnight", () => {
    expect(baliHour(new Date("2026-10-02T17:00:00Z"))).toBe(1);
  });
});

describe("sceneTimeScript", () => {
  it("sets the current phase on <html>", () => {
    delete document.documentElement.dataset.baliTime;
    new Function(sceneTimeScript)();
    expect(["morning", "day", "sunset", "night"]).toContain(
      document.documentElement.dataset.baliTime,
    );
  });
});
