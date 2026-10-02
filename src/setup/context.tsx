"use client";

import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_SETUP } from "@/catalog/presets";
import { announceChange } from "./announce";
import { SETUP_PARAM, decodeSetup, encodeSetup } from "./codec";
import { setupReducer } from "./reducer";
import type { Setup, SetupAction } from "./types";

interface SetupContextValue {
  setup: Setup;
  dispatch: (action: SetupAction) => void;
  /** Latest polite announcement for screen readers. */
  message: string;
  announce: (message: string) => void;
}

const SetupContext = createContext<SetupContextValue | null>(null);

/**
 * Owns the current setup for the designer.
 *
 * - The page is prerendered with the default setup, then a `?s=` link (if
 *   any) is applied after hydration. That keeps the page static and fast.
 * - After every change the URL is updated in place, so the address bar is
 *   always a shareable link to exactly what's on screen.
 */
export function SetupProvider({ children }: { children: ReactNode }) {
  const [setup, setSetup] = useState<Setup>(DEFAULT_SETUP);
  const [message, setMessage] = useState("");
  const touched = useRef(false);

  useEffect(() => {
    const fromUrl = decodeSetup(new URLSearchParams(window.location.search).get(SETUP_PARAM));
    // Applying external state (the URL) once after hydration is what effects are for.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (fromUrl) setSetup(fromUrl);
  }, []);

  useEffect(() => {
    if (!touched.current) return;
    const url = new URL(window.location.href);
    url.searchParams.set(SETUP_PARAM, encodeSetup(setup));
    window.history.replaceState(window.history.state, "", url);
  }, [setup]);

  // Screen readers ignore a live region whose text didn't change, so repeated
  // messages ("Link copied" twice) get an invisible alternating suffix.
  const announce = useCallback((text: string) => {
    setMessage((prev) => (prev === text ? `${text}\u00a0` : text));
  }, []);

  const dispatch = useCallback(
    (action: SetupAction) => {
      touched.current = true;
      const next = setupReducer(setup, action);
      setSetup(next);
      const sentence = announceChange(setup, next);
      if (sentence) announce(sentence);
    },
    [setup, announce],
  );

  const value = useMemo(
    () => ({ setup, dispatch, message, announce }),
    [setup, dispatch, message, announce],
  );

  return <SetupContext value={value}>{children}</SetupContext>;
}

export function useSetup(): SetupContextValue {
  const context = use(SetupContext);
  if (!context) throw new Error("useSetup must be used inside <SetupProvider>");
  return context;
}
