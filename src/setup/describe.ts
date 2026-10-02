import { ACCESSORIES, getChair, getDesk } from "@/catalog/products";
import type { Setup } from "./types";

const NUMBER_WORDS = ["zero", "one", "two", "three"];

/** "Oak writing desk" -> "oak writing desk", keeping acronyms like "XL" intact. */
const lowerFirst = (text: string) => text.charAt(0).toLowerCase() + text.slice(1);

/** "a desk lamp", "an ergonomic chair". Good enough for this catalogue's nouns. */
export const withArticle = (noun: string) => `${/^[aeiou]/i.test(noun) ? "an" : "a"} ${noun}`;

/** "a, b and c" */
export function listToSentence(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;
}

/**
 * Plain-language description of the setup. It is the accessible name of the
 * preview, so screen reader users get the same "picture" sighted users do.
 */
export function describeSetup(setup: Setup, standing = false): string {
  const desk = getDesk(setup.desk);
  const chair = getChair(setup.chair);
  const extras = ACCESSORIES.flatMap(({ id, shortName }) => {
    const quantity = setup.accessories[id] ?? 0;
    if (quantity === 0) return [];
    if (quantity === 1) return [withArticle(shortName)];
    return [`${NUMBER_WORDS[quantity] ?? quantity} ${shortName}s`];
  });

  const height = desk.adjustable
    ? standing
      ? ", raised to standing height"
      : ", at sitting height"
    : "";
  const base = `${desk.widthCm} cm ${lowerFirst(desk.name)}${height}, with ${withArticle(lowerFirst(chair.name))}`;
  return extras.length ? `${base}, ${listToSentence(extras)}.` : `${base}.`;
}
