"use client";

import { useId, type ReactNode } from "react";
import { ACCESSORIES, CHAIRS, DESKS, type Accessory } from "@/catalog/products";
import { capacityHint } from "@/setup/announce";
import { useSetup } from "@/setup/context";
import { formatPrice } from "@/setup/pricing";
import { maxQuantity, monitorCapacity, monitorCount } from "@/setup/rules";
import { Thumbnail } from "../stage/thumbnail";
import { MinusIcon, PlusIcon } from "../ui/icons";
import { CardBody, ChoiceCard, cardSelectedStyles, cardStyles } from "./option-card";
import { WithDetails } from "./product-details";

export function DeskPanel() {
  const { setup, dispatch } = useSetup();
  return (
    <fieldset className="grid gap-3">
      <legend className="sr-only">Choose a desk</legend>
      {DESKS.map((desk) => (
        <WithDetails key={desk.id} id={desk.id} name={desk.name}>
          <ChoiceCard
            type="radio"
            name="desk"
            value={desk.id}
            checked={setup.desk === desk.id}
            onChange={() => dispatch({ type: "selectDesk", desk: desk.id })}
          >
            <CardBody
              thumbnail={<Thumbnail id={desk.id} className="w-full" />}
              name={desk.name}
              blurb={desk.blurb}
              meta={`${desk.widthCm} × ${desk.depthCm} cm · fits ${desk.monitorCapacity} screens`}
              price={formatPrice(desk.pricePerWeek)}
            />
          </ChoiceCard>
        </WithDetails>
      ))}
    </fieldset>
  );
}

export function ChairPanel() {
  const { setup, dispatch } = useSetup();
  return (
    <fieldset className="grid gap-3">
      <legend className="sr-only">Choose a chair</legend>
      {CHAIRS.map((chair) => (
        <WithDetails key={chair.id} id={chair.id} name={chair.name}>
          <ChoiceCard
            type="radio"
            name="chair"
            value={chair.id}
            checked={setup.chair === chair.id}
            onChange={() => dispatch({ type: "selectChair", chair: chair.id })}
          >
            <CardBody
              thumbnail={<Thumbnail id={chair.id} className="h-full" />}
              name={chair.name}
              blurb={chair.blurb}
              meta={chair.highlights}
              price={formatPrice(chair.pricePerWeek)}
            />
          </ChoiceCard>
        </WithDetails>
      ))}
    </fieldset>
  );
}

/** The Gear step is split the way the room is: things on the desk, things around it. */
const ZONES = [
  { zone: "desk", title: "On the desk" },
  { zone: "room", title: "Around the room" },
] as const;

export function GearPanel() {
  const { setup, dispatch } = useSetup();
  const used = monitorCount(setup);
  const capacity = monitorCapacity(setup);

  return (
    <div className="grid gap-3">
      <ScreenMeter used={used} capacity={capacity} />
      {ZONES.map(({ zone, title }) => (
        <fieldset key={zone} className="mt-2 grid gap-3">
          <legend className="mb-3 text-xs font-semibold tracking-widest text-muted uppercase">
            {title}
          </legend>
          {ACCESSORIES.filter((accessory) => accessory.zone === zone).map((accessory) =>
            accessory.kind === "monitor" ? (
              <WithDetails key={accessory.id} id={accessory.id} name={accessory.name}>
                <MonitorCard accessory={accessory} />
              </WithDetails>
            ) : (
              <WithDetails key={accessory.id} id={accessory.id} name={accessory.name}>
                <ChoiceCard
                  type="checkbox"
                  name="gear"
                  value={accessory.id}
                  checked={(setup.accessories[accessory.id] ?? 0) > 0}
                  onChange={() =>
                    dispatch({
                      type: "setQuantity",
                      accessory: accessory.id,
                      quantity: (setup.accessories[accessory.id] ?? 0) > 0 ? 0 : 1,
                    })
                  }
                >
                  <CardBody
                    thumbnail={<Thumbnail id={accessory.id} className="h-full w-full" />}
                    name={accessory.name}
                    blurb={accessory.blurb}
                    price={formatPrice(accessory.pricePerWeek)}
                  />
                </ChoiceCard>
              </WithDetails>
            ),
          )}
        </fieldset>
      ))}
    </div>
  );
}

/** Shows how many screens the current desk can still take, before anyone hits the limit. */
function ScreenMeter({ used, capacity }: { used: number; capacity: number }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-paper px-4 py-3 text-sm">
      <span>
        <span className="font-semibold">Screens on this desk</span>
        <span className="sr-only">
          , {used} of {capacity} spaces used
        </span>
      </span>
      <span aria-hidden="true" className="flex items-center gap-1.5">
        {Array.from({ length: 3 }, (_, i) => (
          <span
            key={i}
            className={`h-3 w-5 rounded-[3px] border transition-colors duration-200 ${
              i >= capacity
                ? "border-dashed border-line"
                : i < used
                  ? "border-lagoon bg-lagoon"
                  : "border-ink/40"
            }`}
          />
        ))}
        <span className="ml-1 tabular text-muted">
          {used}/{capacity}
        </span>
      </span>
    </div>
  );
}

function MonitorCard({ accessory }: { accessory: Accessory }) {
  const { setup, dispatch, announce } = useSetup();
  const hintId = useId();
  const quantity = setup.accessories[accessory.id] ?? 0;
  const canAdd = quantity < maxQuantity(setup, accessory.id);
  const setQuantity = (next: number) =>
    dispatch({ type: "setQuantity", accessory: accessory.id, quantity: next });

  return (
    <div
      role="group"
      aria-label={accessory.name}
      className={`${cardStyles} ${quantity > 0 ? cardSelectedStyles : ""}`}
    >
      <CardBody
        thumbnail={<Thumbnail id={accessory.id} className="w-full" />}
        name={accessory.name}
        blurb={accessory.blurb}
        price={formatPrice(accessory.pricePerWeek)}
      >
        <span className="mt-2 flex items-center gap-1">
          <StepButton
            label={`Remove one ${accessory.shortName}`}
            disabled={quantity === 0}
            onClick={() => quantity > 0 && setQuantity(quantity - 1)}
          >
            <MinusIcon width={16} height={16} />
          </StepButton>
          {/* Not an <output>: that's an implicit live region and would double-announce changes. */}
          <span className="w-8 text-center tabular font-semibold">
            <span className="sr-only">Quantity: </span>
            {quantity}
          </span>
          <StepButton
            label={`Add one ${accessory.shortName}`}
            disabled={!canAdd}
            describedBy={canAdd ? undefined : hintId}
            onClick={() => (canAdd ? setQuantity(quantity + 1) : announce(capacityHint(setup)))}
          >
            <PlusIcon width={16} height={16} />
          </StepButton>
          {!canAdd && (
            <span id={hintId} className="ml-1 text-xs leading-tight text-muted">
              Desk is full
            </span>
          )}
        </span>
      </CardBody>
    </div>
  );
}

/**
 * Uses `aria-disabled` instead of `disabled` so the button stays focusable
 * and can explain why it's unavailable instead of silently doing nothing.
 */
function StepButton({
  label,
  disabled,
  describedBy,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  describedBy?: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-disabled={disabled || undefined}
      aria-describedby={describedBy}
      onClick={onClick}
      className="grid size-9 place-items-center rounded-full border border-line bg-surface transition-[transform,border-color] duration-150 hover:border-ink/40 active:scale-90 aria-disabled:opacity-40 aria-disabled:active:scale-100"
    >
      {children}
    </button>
  );
}
