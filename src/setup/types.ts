import type { AccessoryId, ChairId, DeskId } from "@/catalog/products";

/** Everything the customer has chosen. Kept flat and serialisable on purpose. */
export interface Setup {
  desk: DeskId;
  chair: ChairId;
  /** Quantity per accessory. Absent or 0 means "not in the setup". */
  accessories: Partial<Record<AccessoryId, number>>;
}

export type SetupAction =
  | { type: "selectDesk"; desk: DeskId }
  | { type: "selectChair"; chair: ChairId }
  | { type: "setQuantity"; accessory: AccessoryId; quantity: number }
  | { type: "replace"; setup: Setup };
