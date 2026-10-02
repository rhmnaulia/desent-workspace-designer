"use client";

import { PRESETS } from "@/catalog/presets";
import { encodeSetup } from "@/setup/codec";
import { useSetup } from "@/setup/context";
import { formatPrice, weeklyTotal } from "@/setup/pricing";

/** One-tap starting points for people who'd rather tweak than build from scratch. */
export function StarterSetups() {
  const { setup, dispatch } = useSetup();
  const current = encodeSetup(setup);

  return (
    <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3">
      <h2 className="text-sm text-muted">Short on time? Start from</h2>
      {/* One scrollable row on phones instead of a tall stack of chips. */}
      <ul className="-mx-4 flex min-w-0 [scrollbar-width:none] gap-2 overflow-x-auto px-4 sm:mx-0 sm:w-auto sm:flex-wrap sm:overflow-visible sm:px-0">
        {PRESETS.map((preset) => {
          const active = encodeSetup(preset.setup) === current;
          return (
            <li key={preset.id} className="shrink-0">
              <button
                type="button"
                aria-pressed={active}
                title={preset.forWho}
                onClick={() => dispatch({ type: "replace", setup: preset.setup })}
                className={`min-h-11 rounded-full border px-4 text-sm font-semibold transition-[transform,border-color,background-color] duration-150 active:scale-[0.97] ${active ? "border-leaf bg-[color-mix(in_oklab,var(--leaf)_10%,var(--surface))]" : "border-line bg-surface hover:border-ink/40"}`}
              >
                {preset.name}
                <span className="ml-2 tabular font-normal text-muted">
                  {formatPrice(weeklyTotal(preset.setup))}/wk
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
