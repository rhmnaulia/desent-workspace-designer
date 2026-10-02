"use client";

import { useState } from "react";
import { getDesk } from "@/catalog/products";
import { useSetup } from "@/setup/context";
import { Stage } from "../stage/stage";

/**
 * The live preview plus the one control that only makes sense on it:
 * trying a standing desk at standing height.
 */
export function StagePanel() {
  const { setup } = useSetup();
  const desk = getDesk(setup.desk);
  const [standing, setStanding] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-line bg-[var(--wall)] shadow-[0_24px_48px_-32px_rgb(var(--shadow)/0.45)]">
      <Stage
        setup={setup}
        standing={standing}
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
                className={`relative cursor-pointer rounded-full px-3 py-1.5 transition-colors duration-150 has-focus-visible:outline-2 has-focus-visible:outline-offset-1 has-focus-visible:outline-focus ${standing === value ? "bg-leaf text-on-leaf" : "hover:bg-paper"}`}
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
    </div>
  );
}
