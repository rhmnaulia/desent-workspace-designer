"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SETUP_PARAM, encodeSetup } from "@/setup/codec";
import { useSetup } from "@/setup/context";
import { RENTAL_TERMS, formatPrice, lineItems, quote } from "@/setup/pricing";
import { buttonStyles } from "../ui/button";
import { ArrowRightIcon, CheckIcon, LinkIcon } from "../ui/icons";
import { useTweenedNumber } from "./use-tweened-number";

const LONGEST_TERM = RENTAL_TERMS.at(-1)!;

/**
 * The running bill, styled like a paper rental slip. It's the "summary" half
 * of the designer: every change on the stage shows up here as a line item.
 */
export function RentalSlip() {
  const { setup, announce } = useSetup();
  const items = lineItems(setup);
  const weekly = quote(setup, RENTAL_TERMS[0]).weekly;
  const shown = useTweenedNumber(weekly);
  const longTerm = quote(setup, LONGEST_TERM);
  const code = encodeSetup(setup);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const copyLink = async () => {
    const url = `${window.location.origin}/?${SETUP_PARAM}=${code}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      announce("Link to this setup copied.");
    } catch {
      announce("Couldn't copy automatically. The address bar has the same link.");
    }
  };

  return (
    <section
      aria-labelledby="slip-title"
      className="rounded-b-3xl bg-surface px-5 pt-7 pb-5 shadow-[0_24px_48px_-32px_rgb(var(--shadow)/0.45)] ring-1 ring-line perforated"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="slip-title" className="font-display text-xl font-semibold tracking-tight">
          Your rental
        </h2>
        <span className="text-xs text-muted">Weekly rates</span>
      </div>

      <ul className="mt-4 divide-y divide-dashed divide-line border-y border-dashed border-line">
        {items.map((item) => (
          <li key={item.id} className="slide-in flex items-baseline gap-2 py-2.5 text-sm">
            <span className="min-w-0 flex-1">
              {item.name}
              {item.quantity > 1 && <span className="text-muted"> × {item.quantity}</span>}
            </span>
            <span className="tabular">{formatPrice(item.weekly)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-end justify-between gap-3">
        <span className="text-sm text-muted">Per week</span>
        <span className="font-display text-3xl font-semibold tracking-tight">
          <span aria-hidden="true" className="tabular">
            {formatPrice(Math.round(shown / 100) * 100)}
          </span>
          <span className="sr-only">{formatPrice(weekly)}</span>
        </span>
      </div>
      <p className="mt-1 text-right text-sm text-muted">
        or{" "}
        <span className="tabular">
          {formatPrice(Math.round(longTerm.total / LONGEST_TERM.weeks))}
        </span>
        /wk when you rent for {LONGEST_TERM.label}
      </p>

      <Link
        href={`/checkout?${SETUP_PARAM}=${code}`}
        className={`${buttonStyles.primary} mt-5 w-full`}
      >
        Rent this setup
        <ArrowRightIcon width={18} height={18} />
      </Link>
      <button type="button" onClick={copyLink} className={`${buttonStyles.secondary} mt-2 w-full`}>
        {copied ? <CheckIcon width={18} height={18} /> : <LinkIcon width={18} height={18} />}
        {copied ? "Link copied" : "Copy link to this setup"}
      </button>

      <ul className="mt-5 grid gap-1.5 text-sm text-muted">
        {[
          "Delivery, assembly and pickup included",
          "Rent for a week, a month or a whole season",
        ].map((line) => (
          <li key={line} className="flex gap-2">
            <CheckIcon width={16} height={16} className="mt-0.5 shrink-0 text-leaf" />
            {line}
          </li>
        ))}
      </ul>
    </section>
  );
}
