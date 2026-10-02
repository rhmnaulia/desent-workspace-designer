"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { PHOTO_HOST, findProduct, type ProductId, type ProductRef } from "@/catalog/products";
import { capacityHint } from "@/setup/announce";
import { useSetup } from "@/setup/context";
import { formatPrice } from "@/setup/pricing";
import { maxQuantity } from "@/setup/rules";
import type { SetupAction } from "@/setup/types";
import { Thumbnail } from "../stage/thumbnail";
import { buttonStyles } from "../ui/button";
import { CheckIcon, CloseIcon } from "../ui/icons";

/**
 * The inside of the product details sheet. Loaded on demand (see
 * product-details.tsx): nobody needs this code until they open a sheet.
 */

const TYPE_LABEL = { desk: "Desk", chair: "Chair", accessory: "Gear" } as const;

export default function SheetContent({ id, onDone }: { id: ProductId; onDone: () => void }) {
  const item = findProduct(id);
  const { product } = item;
  const closeButton = useRef<HTMLButtonElement>(null);

  // This content loads after the dialog opens, so the browser's own "focus the
  // first control" has already run on an empty sheet. Do it here instead.
  useEffect(() => closeButton.current?.focus(), [id]);

  return (
    <div className="grid md:grid-cols-[1.05fr_1fr]">
      {/* First in the sheet, so it's where focus lands when the sheet opens. */}
      <button
        ref={closeButton}
        type="button"
        onClick={onDone}
        aria-label="Close"
        className="absolute top-3 right-3 z-10 grid size-10 place-items-center rounded-full bg-surface/90 ring-1 ring-line transition-transform active:scale-95"
      >
        <CloseIcon width={18} height={18} />
      </button>

      <figure className="relative grid aspect-[4/3] place-items-center bg-white md:aspect-auto md:min-h-[420px]">
        {product.photo ? (
          <Image
            src={`${PHOTO_HOST}${product.photo}`}
            alt={`Photo of the ${product.name}`}
            fill
            sizes="(min-width: 768px) 420px, 100vw"
            className="object-contain p-6"
          />
        ) : (
          <div className="grid size-full place-items-center bg-paper p-10">
            <Thumbnail id={id} className="max-h-64 w-full" />
          </div>
        )}
        <figcaption className="absolute bottom-3 left-4 font-mono text-[11px] tracking-wider text-[#52605a] uppercase">
          {product.photo ? "Photo: monis.rent" : "Illustration"}
        </figcaption>
      </figure>

      <div className="grid content-start gap-5 p-6 sm:p-7">
        <div>
          <p className="font-mono text-xs tracking-widest text-muted uppercase">
            {TYPE_LABEL[item.type]}
          </p>
          <h2 id="product-sheet-title" className="mt-1 font-display text-3xl leading-tight">
            {product.name}
          </h2>
          <p className="mt-1">
            <span className="tabular text-lg font-semibold">
              {formatPrice(product.pricePerWeek)}
            </span>
            <span className="text-muted"> / week</span>
          </p>
        </div>

        <ul className="grid gap-2">
          {product.specs.map((spec) => (
            <li key={spec} className="flex gap-2">
              <CheckIcon width={18} height={18} className="mt-0.5 shrink-0 text-lagoon" />
              {spec}
            </li>
          ))}
        </ul>

        <div>
          <h3 className="text-sm font-bold">Why rent it</h3>
          <p className="mt-1 text-pretty text-muted">{product.why}</p>
        </div>

        <SheetAction item={item} onDone={onDone} />
      </div>
    </div>
  );
}

/** The one thing you'd want to do after looking closer: pick it, add it, or remove it. */
function SheetAction({ item, onDone }: { item: ProductRef; onDone: () => void }) {
  const { setup, dispatch } = useSetup();
  const act = (action: SetupAction) => {
    dispatch(action);
    onDone();
  };

  if (item.type === "desk" || item.type === "chair") {
    const chosen =
      item.type === "desk" ? setup.desk === item.product.id : setup.chair === item.product.id;
    if (chosen) return <p className="font-semibold text-lagoon">This is your {item.type} ✓</p>;
    return (
      <button
        type="button"
        className={`${buttonStyles.primary} w-full`}
        onClick={() =>
          act(
            item.type === "desk"
              ? { type: "selectDesk", desk: item.product.id }
              : { type: "selectChair", chair: item.product.id },
          )
        }
      >
        Choose this {item.type}
      </button>
    );
  }

  const { product } = item;
  const quantity = setup.accessories[product.id] ?? 0;

  if (product.kind === "monitor") {
    const canAdd = quantity < maxQuantity(setup, product.id);
    return canAdd ? (
      <button
        type="button"
        className={`${buttonStyles.primary} w-full`}
        onClick={() => act({ type: "setQuantity", accessory: product.id, quantity: quantity + 1 })}
      >
        {quantity ? "Add another" : "Add to my setup"}
      </button>
    ) : (
      <p className="text-muted">{capacityHint(setup)}</p>
    );
  }

  return (
    <button
      type="button"
      className={`${quantity ? buttonStyles.secondary : buttonStyles.primary} w-full`}
      onClick={() =>
        act({ type: "setQuantity", accessory: product.id, quantity: quantity ? 0 : 1 })
      }
    >
      {quantity ? "Remove from my setup" : "Add to my setup"}
    </button>
  );
}
