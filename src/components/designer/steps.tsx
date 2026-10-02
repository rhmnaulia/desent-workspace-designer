"use client";

import Link from "next/link";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { getChair, getDesk } from "@/catalog/products";
import { SETUP_PARAM, encodeSetup } from "@/setup/codec";
import { useSetup } from "@/setup/context";
import { buttonStyles } from "../ui/button";
import { ArrowRightIcon } from "../ui/icons";
import { ChairPanel, DeskPanel, GearPanel } from "./panels";

const STEPS = [
  { id: "desk", label: "Desk", next: "Next: pick a chair", Panel: DeskPanel },
  { id: "chair", label: "Chair", next: "Next: add your gear", Panel: ChairPanel },
  { id: "gear", label: "Gear", next: null, Panel: GearPanel },
] as const;

/**
 * Desk → Chair → Gear, as tabs (WAI-ARIA tabs pattern: arrow keys move
 * between steps, Tab moves into the panel). Each tab shows what's currently
 * chosen, so the steps double as a summary.
 */
export function Steps() {
  const { setup } = useSetup();
  const [active, setActive] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const baseId = useId();

  const gearCount = Object.values(setup.accessories).reduce((sum, n) => sum + (n ?? 0), 0);
  const summaries = [
    getDesk(setup.desk).name,
    getChair(setup.chair).name,
    gearCount === 0 ? "Nothing yet" : `${gearCount} item${gearCount === 1 ? "" : "s"}`,
  ];

  const select = (index: number) => {
    setActive(index);
    tabs.current[index]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const last = STEPS.length - 1;
    const moves: Record<string, number> = {
      ArrowRight: active === last ? 0 : active + 1,
      ArrowLeft: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    };
    if (event.key in moves) {
      event.preventDefault();
      select(moves[event.key]);
    }
  };

  const { Panel, next } = STEPS[active];

  return (
    <section aria-label="Build your setup" className="min-w-0">
      <div
        role="tablist"
        aria-label="Steps"
        className="relative grid grid-cols-3 gap-1 rounded-2xl bg-paper p-1 ring-1 ring-line"
      >
        {/* One indicator that slides between tabs: cheaper and smoother than one per tab. */}
        <span
          aria-hidden="true"
          className="absolute inset-y-1 left-1 w-[calc((100%-16px)/3)] rounded-xl bg-surface shadow-[0_1px_2px_rgb(var(--shadow)/0.12),0_0_0_1px_var(--line)] transition-transform duration-300 ease-out-soft"
          style={{ transform: `translateX(calc(${active} * (100% + 4px)))` }}
        />
        {STEPS.map((step, i) => {
          const selected = i === active;
          return (
            <button
              key={step.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              id={`${baseId}-tab-${step.id}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={onKeyDown}
              className={`relative min-h-14 min-w-0 rounded-xl px-2.5 py-2 text-left transition-colors ${selected ? "" : "text-ink/80 hover:text-ink"}`}
            >
              <span className="block text-xs font-semibold text-muted">
                <span className="tabular">0{i + 1}</span> {step.label}
              </span>
              <span className="block truncate text-sm font-semibold">{summaries[i]}</span>
            </button>
          );
        })}
      </div>

      {/* Keyed so each step replays the short entrance */}
      <div
        key={active}
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${STEPS[active].id}`}
        className="rise-in mt-4"
      >
        <Panel />
        <div className="mt-4 flex justify-end">
          {next ? (
            <button
              type="button"
              onClick={() => select(active + 1)}
              className={buttonStyles.secondary}
            >
              {next}
              <ArrowRightIcon width={18} height={18} />
            </button>
          ) : (
            <Link
              href={`/checkout?${SETUP_PARAM}=${encodeSetup(setup)}`}
              className={`${buttonStyles.primary} lg:hidden`}
            >
              Review and rent
              <ArrowRightIcon width={18} height={18} />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
