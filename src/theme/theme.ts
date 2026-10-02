/**
 * Light/dark theme. The user picks "system", "light" or "dark"; the page
 * always carries the *resolved* theme as `<html data-theme="light|dark">`,
 * which is what the CSS tokens key off.
 *
 * `applyTheme` is the single implementation. The same function is inlined
 * into <head> (see `themeScript`) so the right theme is set before the first
 * paint, with no flash of the wrong colours.
 */

export const THEME_PREFERENCES = ["system", "light", "dark"] as const;
export type ThemePreference = (typeof THEME_PREFERENCES)[number];

export const THEME_STORAGE_KEY = "theme";
/** Fired on window whenever the preference changes in this tab. */
export const THEME_EVENT = "themechange";

export function readPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : "system";
  } catch {
    return "system"; // Storage can be blocked (private mode, strict settings).
  }
}

/**
 * Resolves a preference against the OS setting and writes it to <html>.
 * Self-contained on purpose: it is serialised into the inline head script.
 */
export function applyTheme(preference: string) {
  const dark =
    preference === "dark" ||
    (preference !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  // Tint the phone's browser bar to match the chosen theme, not just the OS.
  // Colours are spelled out because this function is inlined into <head>.
  for (const meta of document.querySelectorAll('meta[name="theme-color"]')) {
    meta.setAttribute("content", dark ? "#0e1615" : "#edf0ec");
  }
}

export function setPreference(preference: ThemePreference) {
  try {
    if (preference === "system") localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // Not persisted, but still applied for this visit.
  }
  const update = () => applyTheme(preference);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (document.startViewTransition && !reduceMotion) document.startViewTransition(update);
  else update();
  window.dispatchEvent(new Event(THEME_EVENT));
}

/**
 * Runs in <head> before anything renders. Also keeps "system" in sync when
 * the OS switches (e.g. automatic dark mode at sunset).
 */
export const themeScript = `(() => {
  const applyTheme = ${applyTheme.toString()};
  const read = () => { try { return localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)}) || "system"; } catch { return "system"; } };
  applyTheme(read());
  // Metadata tags (theme-color) may be parsed after this script: tint them too.
  document.addEventListener("DOMContentLoaded", () => applyTheme(read()));
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => applyTheme(read()));
})();`;
