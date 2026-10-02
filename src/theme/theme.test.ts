import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { applyTheme, readPreference, setPreference, themeScript } from "./theme";

const mockSystemDark = (dark: boolean) =>
  vi.spyOn(window, "matchMedia").mockImplementation(
    (query) =>
      ({
        matches: query.includes("dark") && dark,
        addEventListener: () => {},
      }) as unknown as MediaQueryList,
  );

describe("theme", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it("follows the OS when set to system", () => {
    mockSystemDark(true);
    applyTheme("system");
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("lets an explicit choice override the OS", () => {
    mockSystemDark(true);
    applyTheme("light");
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("tints the browser bar to match", () => {
    mockSystemDark(false);
    document.head.innerHTML =
      '<meta name="theme-color" media="(prefers-color-scheme: light)" content="#edf0ec">' +
      '<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0e1615">';
    applyTheme("dark");
    const colors = [...document.querySelectorAll('meta[name="theme-color"]')].map((m) =>
      m.getAttribute("content"),
    );
    expect(colors).toEqual(["#0e1615", "#0e1615"]);
  });

  it("remembers a choice, and forgets it when going back to system", () => {
    mockSystemDark(false);
    setPreference("dark");
    expect(readPreference()).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
    setPreference("system");
    expect(readPreference()).toBe("system");
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("produces a pre-paint script that applies the saved theme", () => {
    mockSystemDark(false);
    localStorage.setItem("theme", "dark");
    document.documentElement.dataset.theme = "";
    new Function(themeScript)();
    expect(document.documentElement.dataset.theme).toBe("dark");
  });
});
