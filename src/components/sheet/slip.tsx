import type { ReactNode } from "react";
import { formatPrice, type LineItem } from "@/setup/pricing";

/**
 * The paper rental slip: the app's signature piece. Presentational only, so
 * the live slip in the designer and the stamped copy after checkout look
 * identical.
 */

export function SlipPaper({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative min-w-0 bg-surface px-5 pt-7 pb-8 font-mono shadow-[0_24px_48px_-32px_rgb(var(--shadow)/0.45)] perforated ${className}`}
    >
      {children}
    </div>
  );
}

/** Same setup, same number, so a shared link shows the same slip. */
export function slipNumber(code: string): string {
  let hash = 0;
  for (const char of code) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return String(1000 + (hash % 9000));
}

export function SlipHeader({ code, aside }: { code: string; aside?: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-[11px] tracking-widest text-muted uppercase">
      <span>monis.rent · No. {slipNumber(code)}</span>
      {aside}
    </div>
  );
}

/** Line items with dotted leaders. New lines "print" in; existing ones stay put. */
export function SlipLines({ items }: { items: LineItem[] }) {
  return (
    <ul className="mt-3 grid gap-2 border-y border-dashed border-line py-3 text-[13px] leading-snug">
      {items.map((item) => (
        <li key={item.id} className="print-in flex items-end gap-2">
          <span className="min-w-0">
            {item.name}
            {item.quantity > 1 && <span className="text-muted"> ×{item.quantity}</span>}
          </span>
          <span
            aria-hidden="true"
            className="mb-1 min-w-4 flex-1 border-b border-dotted border-muted/60"
          />
          <span className="shrink-0 tabular">{formatPrice(item.weekly)}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * A decorative barcode of the setup's share code, with the code printed
 * underneath. The code is real: it's the same one in the shareable link.
 */
export function SlipBarcode({ code }: { code: string }) {
  const bars = Array.from(code, (char, i) => (char.charCodeAt(0) + i) % 4);
  return (
    <div className="mt-5">
      <div aria-hidden="true" className="flex h-9 w-full items-stretch gap-[2px] overflow-hidden">
        {bars.flatMap((width, i) => [
          <span key={`b${i}`} className="bg-ink" style={{ width: width + 1 }} />,
          <span key={`s${i}`} style={{ width: ((width + i) % 3) + 1 }} />,
        ])}
      </div>
      <p className="mt-1.5 truncate text-[11px] tracking-wider text-muted">
        <span className="sr-only">Setup code: </span>
        {code}
      </p>
    </div>
  );
}

/** A rubber stamp that lands on the slip. Decorative; the text around it says the same thing. */
export function Stamp({ children }: { children: ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className="stamp pointer-events-none absolute right-5 bottom-12 rounded-md border-[3px] border-error px-3 py-1 font-mono text-lg font-semibold tracking-widest text-error uppercase"
    >
      {children}
    </span>
  );
}
