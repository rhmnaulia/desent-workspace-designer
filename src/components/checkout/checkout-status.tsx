"use client";

import { createContext, use, useState, type ReactNode } from "react";
import { Stamp } from "../sheet/slip";

/**
 * Lets the request form tell the slip beside it that the request went out,
 * so the slip can be stamped. The two sit in different columns of the page.
 */
const CheckoutStatus = createContext<{ sent: boolean; markSent: () => void } | null>(null);

export function CheckoutStatusProvider({ children }: { children: ReactNode }) {
  const [sent, setSent] = useState(false);
  return (
    <CheckoutStatus value={{ sent, markSent: () => setSent(true) }}>{children}</CheckoutStatus>
  );
}

export function useCheckoutStatus() {
  const status = use(CheckoutStatus);
  if (!status) throw new Error("useCheckoutStatus must be used inside <CheckoutStatusProvider>");
  return status;
}

export function StampWhenSent() {
  const { sent } = useCheckoutStatus();
  return sent ? <Stamp>Requested</Stamp> : null;
}
