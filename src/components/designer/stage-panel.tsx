"use client";

import { useState } from "react";
import { getDesk } from "@/catalog/products";
import type { TimeOfDay } from "@/scene/bali-time";
import { useSetup } from "@/setup/context";
import { Stage } from "../stage/stage";
import { TimeOfDayControl } from "./time-of-day";

/**
 * The live preview plus the controls that only make sense on it: trying a
 * standing desk at standing height, and seeing the room at another hour.
 */
export function StagePanel() {
  const { setup } = useSetup();
  const desk = getDesk(setup.desk);
  const [standing, setStanding] = useState(false);
  const [time, setTime] = useState<TimeOfDay | null>(null);

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-line bg-surface shadow-[0_24px_48px_-32px_rgb(var(--shadow)/0.45)]">
      <Stage
        setup={setup}
        standing={standing}
        time={time ?? undefined}
        className="block aspect-[5/3] w-full md:aspect-[4/3] xl:aspect-[10/7]"
      />

      <p className="pointer-events-none absolute top-3 left-3 rounded-full bg-surface/85 px-3 py-1 text-xs font-semibold backdrop-blur-sm sm:top-4 sm:left-4">
        <span className="sr-only">Desk size: </span>
        <span className="tabular">
          {desk.widthCm} × {desk.depthCm} cm
        </span>
      </p>

      {desk.adjustable && (
        <fieldset className="absolute top-3 right-3 flex rounded-full bg-surface/85 p-1 text-xs font-semibold backdrop-blur-sm sm:top-4 sm:right-4">
          <legend className="sr-only">Preview desk height</legend>
          {(["Sit", "Stand"] as const).map((label) => {
            const value = label === "Stand";
            return (
              <label
                key={label}
                className={`relative cursor-pointer rounded-full px-2.5 py-1 transition-colors duration-150 has-focus-visible:outline-2 has-focus-visible:outline-offset-1 has-focus-visible:outline-focus sm:px-3 sm:py-1.5 ${standing === value ? "bg-lagoon text-on-lagoon" : "hover:bg-paper"}`}
              >
                <input
                  type="radio"
                  name="desk-height"
                  className="sr-only"
                  checked={standing === value}
                  onChange={() => setStanding(value)}
                />
                {label}
              </label>
            );
          })}
        </fieldset>
      )}

      <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
        <TimeOfDayControl value={time} onChange={setTime} />
      </div>
    </div>
  );
}
