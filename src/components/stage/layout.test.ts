import { describe, expect, it } from "vitest";
import { MONITOR_SIZE, VIEW, layoutDesk } from "./layout";

describe("layoutDesk", () => {
  it("centres the desk in the room", () => {
    const layout = layoutDesk({ desk: "oak-desk", chair: "mesh-chair", accessories: {} });
    expect(layout.left + layout.width / 2).toBe(VIEW.width / 2);
  });

  it("puts the bigger screen in the middle of three", () => {
    const layout = layoutDesk({
      desk: "standing-desk-xl",
      chair: "pro-chair",
      accessories: { "monitor-24": 2, "monitor-27": 1 },
    });
    expect(layout.monitors.map((m) => m.id)).toEqual(["monitor-24", "monitor-27", "monitor-24"]);
  });

  it("keeps every screen on the desk, without overlaps", () => {
    const layout = layoutDesk({
      desk: "standing-desk-xl",
      chair: "pro-chair",
      accessories: { "monitor-27": 3, "laptop-stand": 1, "desk-lamp": 1 },
    });
    const edges = layout.monitors.map((m) => {
      const half = MONITOR_SIZE[m.id].width / 2;
      return [m.x - half, m.x + half];
    });
    expect(edges[0][0]).toBeGreaterThanOrEqual(0);
    expect(edges.at(-1)![1]).toBeLessThanOrEqual(layout.width);
    for (let i = 1; i < edges.length; i++) expect(edges[i][0]).toBeGreaterThan(edges[i - 1][1]);
  });

  it("gives every monitor a stable, unique key", () => {
    const layout = layoutDesk({
      desk: "standing-desk-xl",
      chair: "pro-chair",
      accessories: { "monitor-27": 3 },
    });
    expect(new Set(layout.monitors.map((m) => m.key)).size).toBe(3);
  });
});
