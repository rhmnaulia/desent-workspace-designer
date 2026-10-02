"use client";

import { useSyncExternalStore } from "react";
import {
  THEME_EVENT,
  readPreference,
  setPreference,
  type ThemePreference,
} from "@/theme/theme";
import { MoonIcon, SunIcon, SystemIcon } from "./ui/icons";

const OPTIONS: Array<{ value: ThemePreference; label: string; Icon: typeof SunIcon }> = [
  { value: "system", label: "Match system", Icon: SystemIcon },
  { value: "light", label: "Light", Icon: SunIcon },
  { value: "dark", label: "Dark", Icon: MoonIcon },
];

const subscribe = (onChange: () => void) => {
  window.addEventListener(THEME_EVENT, onChange);
  window.addEventListener("storage", onChange); // other tabs
  return () => {
    window.removeEventListener(THEME_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
};

/**
 * Three-way theme switch. A radio group, so arrow keys move between options
 * and screen readers announce "Theme, Dark, 3 of 3".
 */
export function ThemeToggle() {
  // The server can't know the saved choice, so it renders "system"; the real
  // value takes over right after hydration. The page colours are already
  // correct before that, thanks to the inline head script.
  const preference = useSyncExternalStore(subscribe, readPreference, () => "system" as const);

  return (
    <fieldset className="flex shrink-0 rounded-full bg-surface p-0.5 ring-1 ring-line">
      <legend className="sr-only">Theme</legend>
      {OPTIONS.map(({ value, label, Icon }) => {
        const checked = preference === value;
        return (
          <label
            key={value}
            title={label}
            className={`relative grid size-9 cursor-pointer place-items-center rounded-full transition-colors duration-150 has-focus-visible:outline-2 has-focus-visible:outline-offset-1 has-focus-visible:outline-focus ${checked ? "bg-paper text-ink shadow-[0_0_0_1px_var(--line)]" : "text-muted hover:text-ink"}`}
          >
            <input
              type="radio"
              name="theme"
              value={value}
              checked={checked}
              onChange={() => setPreference(value)}
              className="absolute inset-0 m-0 cursor-pointer appearance-none rounded-full opacity-0"
            />
            <Icon width={18} height={18} />
            <span className="sr-only">{label}</span>
          </label>
        );
      })}
    </fieldset>
  );
}
