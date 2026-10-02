"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { DELIVERY_LEAD_DAYS, baliDate, formatDay } from "@/checkout/request";
import { SETUP_PARAM, encodeSetup } from "@/setup/codec";
import { useSetup } from "@/setup/context";
import { RENTAL_TERMS, formatPrice, lineItems, quote } from "@/setup/pricing";
import { SlipBarcode, SlipHeader, SlipLines, SlipPaper } from "./slip";
import { buttonStyles } from "../ui/button";
import { ArrowRightIcon, CheckIcon, LinkIcon } from "../ui/icons";
import { useTweenedNumber } from "./use-tweened-number";

const LONGEST_TERM = RENTAL_TERMS.at(-1)!;

// Today's date only exists in the browser (the page is prerendered), so the
// server renders nothing and the slip fills it in after hydration.
const noSubscribe = () => () => {};
const earliestSetupDay = () => formatDay(baliDate(new Date(), DELIVERY_LEAD_DAYS));

/**
 * The running bill, printed on a paper rental slip. It's the "summary" half
 * of the designer: every change on the stage prints here as a new line.
 */
export function RentalSlip() {
  const { setup, announce } = useSetup();
  const items = lineItems(setup);
  const weekly = quote(setup, RENTAL_TERMS[0]).weekly;
  const shown = useTweenedNumber(weekly);
  const longTerm = quote(setup, LONGEST_TERM);
  const code = encodeSetup(setup);
  const setupDay = useSyncExternalStore(noSubscribe, earliestSetupDay, () => "");
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
    <section aria-labelledby="slip-title" className="grid min-w-0 gap-4">
      <SlipPaper>
        <SlipHeader code={code} aside={<span>Per week</span>} />
        <h2 id="slip-title" className="mt-3 font-sans text-lg font-bold">
          Your rental
        </h2>
        <SlipLines items={items} />

        <div className="mt-4 flex items-end justify-between gap-3">
          <span className="text-sm text-muted">Total / week</span>
          <span className="tabular text-3xl font-semibold">
            {/* Whole dollars while counting, exact once it lands. */}
            <span aria-hidden="true">
              {formatPrice(shown === weekly ? weekly : Math.round(shown / 100) * 100)}
            </span>
            <span className="sr-only">{formatPrice(weekly)}</span>
          </span>
        </div>
        <p className="mt-1 text-right text-xs text-muted">
          {formatPrice(Math.round(longTerm.total / LONGEST_TERM.weeks))}/wk if you rent for{" "}
          {LONGEST_TERM.label}
        </p>
        {/* Space reserved before hydration, so the slip doesn't jump when the date appears. */}
        <p className="mt-3 min-h-5 text-xs font-semibold text-lagoon">
          {setupDay && `Order today, set up by ${setupDay}`}
        </p>
        <SlipBarcode code={code} />
      </SlipPaper>

      <div className="grid gap-2">
        <Link
          href={`/checkout?${SETUP_PARAM}=${code}`}
          className={`${buttonStyles.primary} w-full`}
        >
          Rent this setup
          <ArrowRightIcon width={18} height={18} />
        </Link>
        <button type="button" onClick={copyLink} className={`${buttonStyles.secondary} w-full`}>
          {copied ? <CheckIcon width={18} height={18} /> : <LinkIcon width={18} height={18} />}
          {copied ? "Link copied" : "Copy link to this setup"}
        </button>
      </div>

      <ul className="grid gap-1.5 text-sm text-muted">
        {[
          "Delivery, assembly and pickup included",
          "Rent for a week, a month or a whole season",
        ].map((line) => (
          <li key={line} className="flex gap-2">
            <CheckIcon width={16} height={16} className="mt-0.5 shrink-0 text-lagoon" />
            {line}
          </li>
        ))}
      </ul>
    </section>
  );
}
