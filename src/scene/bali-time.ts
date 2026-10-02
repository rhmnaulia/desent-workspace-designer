/**
 * The room is lit by the actual time of day in Bali, so a freelancer
 * checking at night from Berlin sees their future desk at sunset in Canggu.
 *
 * The page carries the current phase as `<html data-bali-time="…">`, set
 * before first paint by `sceneTimeScript` (and refreshed every minute).
 * The stage can override it with its own `data-time` when someone previews
 * another time of day. All colours live in `app/scene.css`.
 */

export const TIMES_OF_DAY = ["morning", "day", "sunset", "night"] as const;
export type TimeOfDay = (typeof TIMES_OF_DAY)[number];

/** Self-contained (no imports) because it is also inlined into <head>. */
export function timeOfDayAt(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 9) return "morning";
  if (hour >= 9 && hour < 16) return "day";
  if (hour >= 16 && hour < 19) return "sunset";
  return "night";
}

/** Bali runs on WITA (UTC+8), with no daylight saving. */
const BALI_TIME_ZONE = "Asia/Makassar";

export function baliHour(now: Date = new Date()): number {
  // Zone spelled out (not BALI_TIME_ZONE): this function is inlined into <head>.
  return Number(
    new Intl.DateTimeFormat("en-GB", {
      hour: "numeric",
      hourCycle: "h23",
      timeZone: "Asia/Makassar",
    }).format(now),
  );
}

/** "14:05" */
export function baliClock(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: BALI_TIME_ZONE,
  }).format(now);
}

export const sceneTimeScript = `(() => {
  const timeOfDayAt = ${timeOfDayAt.toString()};
  const baliHour = ${baliHour.toString()};
  const apply = () => { document.documentElement.dataset.baliTime = timeOfDayAt(baliHour(new Date())); };
  apply();
  setInterval(apply, 60000);
})();`;
