import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { Designer } from "./designer";

const slip = () => within(screen.getByRole("region", { name: "Your rental" }));
const preview = () => screen.getByRole("img", { name: /^Preview:/ });

describe("Designer", () => {
  beforeEach(() => window.history.replaceState(null, "", "/"));

  it("starts with a real desk and chair so the preview is never empty", () => {
    render(<Designer />);
    expect(slip().getByText("Oak writing desk")).toBeInTheDocument();
    expect(slip().getByText("Ergonomic mesh chair")).toBeInTheDocument();
    expect(preview()).toHaveAccessibleName(/oak writing desk/);
  });

  it("swaps the chair everywhere at once: slip, preview, URL and announcement", async () => {
    const user = userEvent.setup();
    render(<Designer />);

    await user.click(screen.getByRole("tab", { name: /Chair/ }));
    await user.click(screen.getByRole("radio", { name: /Rattan side chair/ }));

    expect(slip().getByText("Rattan side chair")).toBeInTheDocument();
    expect(preview()).toHaveAccessibleName(/rattan side chair/);
    expect(window.location.search).toBe("?s=oak.rattan.stand.keys");
    expect(
      screen.getByText(/Chair changed to Rattan side chair\. Weekly total/),
    ).toBeInTheDocument();
  });

  it("won't add more monitors than the desk fits, and says why", async () => {
    const user = userEvent.setup();
    render(<Designer />);
    await user.click(screen.getByRole("tab", { name: /Gear/ }));

    const addBig = screen.getByRole("button", { name: "Add one 27-inch monitor" });
    await user.click(addBig);
    await user.click(addBig);
    expect(addBig).toHaveAttribute("aria-disabled", "true");

    await user.click(addBig);
    expect(slip().getByText("×2")).toBeInTheDocument();
    expect(screen.getByText("The 120 cm desk fits 2 screens.")).toBeInTheDocument();
  });

  it("loads a shared setup from the URL", () => {
    window.history.replaceState(null, "", "/?s=xl.pro.m27x3");
    render(<Designer />);
    expect(slip().getByText("Dual-motor standing desk XL")).toBeInTheDocument();
    expect(slip().getByText("×3")).toBeInTheDocument();
  });

  it("moves between steps with the arrow keys", async () => {
    const user = userEvent.setup();
    render(<Designer />);
    await user.click(screen.getByRole("tab", { name: /Desk/ }));
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: /Chair/ })).toHaveFocus();
    expect(screen.getByRole("tab", { name: /Chair/ })).toHaveAttribute("aria-selected", "true");
    await user.keyboard("{End}");
    expect(screen.getByRole("tab", { name: /Gear/ })).toHaveAttribute("aria-selected", "true");
  });

  it("applies a starter setup in one tap", async () => {
    const user = userEvent.setup();
    render(<Designer />);
    await user.click(screen.getByRole("button", { name: /The Studio/ }));
    expect(screen.getByRole("button", { name: /The Studio/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(preview()).toHaveAccessibleName(/three|two 27-inch monitors/);
  });
});

describe("Rental slip total", () => {
  it("lands on the exact amount, cents included", () => {
    window.history.replaceState(null, "", "/");
    render(<Designer />);
    // The Essentials: $4 + $5 + $1.50 + $4
    expect(slip().getByText("$14.50", { selector: '[aria-hidden="true"]' })).toBeInTheDocument();
  });
});
