import type { RentalTerm } from "@/setup/pricing";

/**
 * The rental request form, minus the UI: the fields, how dates are picked,
 * and what counts as valid. Kept pure so it's trivial to test and to move to a
 * server action once there's a real backend.
 */

export const DELIVERY_AREAS = [
  "Canggu",
  "Pererenan",
  "Seminyak",
  "Ubud",
  "Uluwatu",
  "Sanur",
  "Somewhere else in Bali",
] as const;

export interface RentalRequest {
  term: RentalTerm["id"];
  area: string;
  date: string;
  name: string;
  contact: string;
  notes: string;
}

export type RequestErrors = Partial<Record<keyof RentalRequest, string>>;

/** Bali runs on WITA (UTC+8). Dates are plain `YYYY-MM-DD` strings in that zone. */
const BALI_TIME_ZONE = "Asia/Makassar";

export function baliDate(now: Date = new Date(), addDays = 0): string {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: BALI_TIME_ZONE }).format(now);
  const date = new Date(`${today}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + addDays);
  return date.toISOString().slice(0, 10);
}

/** "Fri 4 Oct" */
export function formatDay(isoDate: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(`${isoDate}T00:00:00Z`));
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^\+?[\d\s()-]{8,}$/;

/** Messages say what to do, not just what's wrong. */
export function validateRequest(request: RentalRequest, earliestDate: string): RequestErrors {
  const errors: RequestErrors = {};
  if (!request.area) errors.area = "Choose where we should deliver.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(request.date)) {
    errors.date = "Pick a delivery date.";
  } else if (request.date < earliestDate) {
    errors.date = `The earliest we can deliver is ${formatDay(earliestDate)}.`;
  }
  if (!request.name.trim()) errors.name = "Tell us who to ask for at the door.";
  const contact = request.contact.trim();
  if (!contact) {
    errors.contact = "Add a WhatsApp number or email so we can confirm.";
  } else if (!EMAIL.test(contact) && !PHONE.test(contact)) {
    errors.contact =
      "That doesn't look like a phone number or email. Try +62 812 3456 7890 or you@example.com.";
  }
  return errors;
}
