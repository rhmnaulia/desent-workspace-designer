"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { baliClock, type TimeOfDay } from "@/scene/bali-time";
import { MoonIcon, SunIcon, SunriseIcon, SunsetIcon } from "../ui/icons";

const OPTIONS: Array<{ value: TimeOfDay; label: string; Icon: typeof SunIcon }> = [
  { value: "morning", label: "Morning", Icon: SunriseIcon },
  { value: "day", label: "Midday", Icon: SunIcon },
  { value: "sunset", label: "Sunset", Icon: SunsetIcon },
  { value: "night", label: "Night", Icon: MoonIcon },
];

const subscribe = (onChange: () => void) => {
  const timer = setInterval(onChange, 30_000);
  return () => clearInterval(timer);
};

interface TimeOfDayControlProps {
  /** null = follow the real time in Bali. */
  value: TimeOfDay | null;
  onChange: (value: TimeOfDay | null) => void;
}

/**
 * Lets people see their setup at any hour: the room follows Bali time by
 * default, and this previews the rest (the lamps are the point at night).
 */
export function TimeOfDayControl({ value, onChange }: TimeOfDayControlProps) {
  // The clock only exists in the browser; the server renders without it.
  const clock = useSyncExternalStore(
    subscribe,
    () => baliClock(),
    () => "",
  );

  const option = (
    key: string,
    checked: boolean,
    select: () => void,
    label: string,
    content: ReactNode,
  ) => (
    <label
      key={key}
      title={label}
      className={`relative flex h-7 min-w-7 cursor-pointer items-center justify-center gap-1.5 rounded-full px-1.5 transition-colors duration-150 has-focus-visible:outline-2 has-focus-visible:outline-offset-1 has-focus-visible:outline-focus sm:h-8 sm:min-w-8 sm:px-2 ${checked ? "bg-lagoon text-on-lagoon" : "hover:bg-paper"}`}
    >
      <input
        type="radio"
        name="time-of-day"
        checked={checked}
        onChange={select}
        className="absolute inset-0 m-0 cursor-pointer appearance-none rounded-full opacity-0"
      />
      {content}
    </label>
  );

  return (
    <fieldset className="flex items-center rounded-full bg-paper p-0.5 text-xs font-semibold sm:bg-surface/85 sm:p-1 sm:backdrop-blur-sm">
      <legend className="sr-only">Light in the room</legend>
      {option(
        "now",
        value === null,
        () => onChange(null),
        "Now in Bali",
        <>
          <span className="hidden sm:inline">Now in Bali</span>
          <span className="sm:hidden">Now</span>
          {clock && <span className="hidden tabular opacity-80 min-[360px]:inline">{clock}</span>}
        </>,
      )}
      {OPTIONS.map(({ value: time, label, Icon }) =>
        option(
          time,
          value === time,
          () => onChange(time),
          label,
          <>
            <Icon width={15} height={15} />
            <span className="sr-only">{label}</span>
          </>,
        ),
      )}
    </fieldset>
  );
}
