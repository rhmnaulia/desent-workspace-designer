"use client";

import { useEffect, useRef, useState } from "react";

const DURATION_MS = 380;
const easeOut = (t: number) => 1 - (1 - t) ** 3;

/**
 * Animates a number toward `target` so totals visibly count up or down
 * instead of jumping. Jumps straight there when the user prefers reduced motion.
 */
export function useTweenedNumber(target: number): number {
  const [value, setValue] = useState(target);
  const from = useRef(target);

  useEffect(() => {
    const start = from.current;
    if (start === target) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      from.current = target;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing to the new target
      setValue(target);
      return;
    }

    let frame = 0;
    const startedAt = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / DURATION_MS, 1);
      const current = start + (target - start) * easeOut(progress);
      from.current = current;
      setValue(progress === 1 ? target : current);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return value;
}
