import { ACCESSORIES, getChair, getDesk } from "@/catalog/products";
import type { Setup } from "./types";

/** All money is integer US cents until it is formatted for display. */

export interface LineItem {
  id: string;
  name: string;
  quantity: number;
  /** Weekly price for this line, quantity included. */
  weekly: number;
}

export interface RentalTerm {
  id: "1w" | "1m" | "3m";
  label: string;
  weeks: number;
  /** Fraction off the weekly rate, e.g. 0.1 for 10%. */
  discount: number;
}

export const RENTAL_TERMS: readonly RentalTerm[] = [
  { id: "1w", label: "1 week", weeks: 1, discount: 0 },
  { id: "1m", label: "1 month", weeks: 4, discount: 0.1 },
  { id: "3m", label: "3 months", weeks: 13, discount: 0.2 },
];

export function lineItems(setup: Setup): LineItem[] {
  const desk = getDesk(setup.desk);
  const chair = getChair(setup.chair);
  const items: LineItem[] = [
    { id: desk.id, name: desk.name, quantity: 1, weekly: desk.pricePerWeek },
    { id: chair.id, name: chair.name, quantity: 1, weekly: chair.pricePerWeek },
  ];
  for (const accessory of ACCESSORIES) {
    const quantity = setup.accessories[accessory.id] ?? 0;
    if (quantity > 0) {
      items.push({
        id: accessory.id,
        name: accessory.name,
        quantity,
        weekly: accessory.pricePerWeek * quantity,
      });
    }
  }
  return items;
}

export function weeklyTotal(setup: Setup): number {
  return lineItems(setup).reduce((sum, item) => sum + item.weekly, 0);
}

export interface Quote {
  weekly: number;
  /** Price for the whole term before the discount. */
  gross: number;
  savings: number;
  total: number;
}

export function quote(setup: Setup, term: RentalTerm): Quote {
  const weekly = weeklyTotal(setup);
  const gross = weekly * term.weeks;
  const savings = Math.round(gross * term.discount);
  return { weekly, gross, savings, total: gross - savings };
}

const wholeDollars = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const withCents = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

/** "$12", "$4.50". Whole dollars drop the cents to keep the slip calm. */
export function formatPrice(cents: number): string {
  return (cents % 100 === 0 ? wholeDollars : withCents).format(cents / 100);
}
