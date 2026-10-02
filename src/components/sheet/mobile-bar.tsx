"use client";

import Link from "next/link";
import { SETUP_PARAM, encodeSetup } from "@/setup/codec";
import { useSetup } from "@/setup/context";
import { formatPrice, weeklyTotal } from "@/setup/pricing";
import { buttonStyles } from "../ui/button";
import { ArrowRightIcon } from "../ui/icons";

/** Below xl the slip sits under the picker, so the total and the next step stay pinned. */
export function MobileBar() {
  const { setup } = useSetup();
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/90 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md xl:hidden">
      <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
        <p className="leading-tight">
          <span className="block tabular text-xl font-semibold">
            {formatPrice(weeklyTotal(setup))}
          </span>
          <span className="text-xs text-muted">per week, delivered</span>
        </p>
        <Link
          href={`/checkout?${SETUP_PARAM}=${encodeSetup(setup)}`}
          className={buttonStyles.primary}
        >
          Rent this setup
          <ArrowRightIcon width={18} height={18} />
        </Link>
      </div>
    </div>
  );
}
