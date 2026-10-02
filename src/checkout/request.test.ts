import { describe, expect, it } from "vitest";
import { baliDate, formatDay, validateRequest, type RentalRequest } from "./request";

const valid: RentalRequest = {
  term: "1m",
  area: "Canggu",
  date: "2026-10-05",
  name: "Sam",
  contact: "+62 812 3456 7890",
  notes: "",
};

describe("baliDate", () => {
  it("uses Bali's calendar day, not UTC's", () => {
    // 20:00 UTC on 2 Oct is already 04:00 on 3 Oct in Bali.
    expect(baliDate(new Date("2026-10-02T20:00:00Z"))).toBe("2026-10-03");
  });

  it("adds days across month ends", () => {
    expect(baliDate(new Date("2026-10-30T02:00:00Z"), 3)).toBe("2026-11-02");
  });
});

describe("formatDay", () => {
  it("reads naturally", () => {
    expect(formatDay("2026-10-05")).toBe("Mon 5 Oct");
  });
});

describe("validateRequest", () => {
  it("accepts a complete request", () => {
    expect(validateRequest(valid, "2026-10-03")).toEqual({});
  });

  it("accepts an email as contact", () => {
    expect(validateRequest({ ...valid, contact: "sam@example.com" }, "2026-10-03")).toEqual({});
  });

  it("flags every missing field with an actionable message", () => {
    const errors = validateRequest(
      { ...valid, area: "", date: "", name: " ", contact: "" },
      "2026-10-03",
    );
    expect(Object.keys(errors).sort()).toEqual(["area", "contact", "date", "name"]);
  });

  it("rejects dates before the earliest delivery day", () => {
    expect(validateRequest({ ...valid, date: "2026-10-02" }, "2026-10-03").date).toBe(
      "The earliest we can deliver is Sat 3 Oct.",
    );
  });

  it("rejects contacts that are neither phone nor email", () => {
    expect(validateRequest({ ...valid, contact: "call me" }, "2026-10-03").contact).toMatch(
      /doesn't look like/,
    );
  });
});
