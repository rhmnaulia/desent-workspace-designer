import type { Metadata } from "next";
import Link from "next/link";
import { DEFAULT_SETUP } from "@/catalog/presets";
import { RequestForm } from "@/components/checkout/request-form";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { Stage } from "@/components/stage/stage";
import { ArrowLeftIcon } from "@/components/ui/icons";
import { DELIVERY_LEAD_DAYS, baliDate } from "@/checkout/request";
import { SETUP_PARAM, decodeSetup, encodeSetup } from "@/setup/codec";
import { formatPrice, lineItems, weeklyTotal } from "@/setup/pricing";
import { CheckoutStatusProvider, StampWhenSent } from "@/components/checkout/checkout-status";
import { SlipBarcode, SlipHeader, SlipLines, SlipPaper } from "@/components/sheet/slip";

export const metadata: Metadata = {
  title: "Review your setup",
  description: "Check your desk setup, choose how long to rent it and where to deliver it in Bali.",
  // Every setup has its own URL; the canonical folds them into one page for search engines.
  alternates: { canonical: "/checkout" },
};

export default async function CheckoutPage({ searchParams }: PageProps<"/checkout">) {
  const raw = (await searchParams)[SETUP_PARAM];
  const decoded = decodeSetup(typeof raw === "string" ? raw : null);
  const setup = decoded ?? DEFAULT_SETUP;
  const code = encodeSetup(setup);
  const items = lineItems(setup);

  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <Link
          href={`/?${SETUP_PARAM}=${code}`}
          className="-ml-2 inline-flex min-h-11 items-center gap-2 rounded-full px-2 text-sm font-semibold text-muted transition-colors hover:text-ink"
        >
          <ArrowLeftIcon width={18} height={18} />
          Keep designing
        </Link>
        <h1 className="mt-2 font-display text-4xl tracking-tight sm:text-5xl">Review your setup</h1>
        <p className="mt-3 max-w-2xl text-lg text-pretty text-muted">
          Nothing is charged today. Send the request and we&rsquo;ll confirm stock and a delivery
          slot with you first.
        </p>
        {raw !== undefined && !decoded && (
          <p
            role="note"
            className="mt-4 max-w-2xl rounded-2xl border border-line bg-surface px-4 py-3"
          >
            We couldn&rsquo;t read that setup link, so here&rsquo;s our starter setup instead. You
            can{" "}
            <Link href="/" className="font-semibold underline underline-offset-2">
              design your own
            </Link>
            .
          </p>
        )}

        <CheckoutStatusProvider>
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-start">
            <section aria-labelledby="setup-heading" className="grid gap-5">
              <h2 id="setup-heading" className="sr-only">
                Your setup
              </h2>
              <div className="overflow-hidden rounded-[28px] border border-line bg-surface">
                <Stage setup={setup} className="block aspect-[5/3] w-full" />
              </div>
              <SlipPaper>
                <SlipHeader code={code} aside={<span>Per week</span>} />
                <SlipLines items={items} />
                <div className="mt-3 flex items-end justify-between">
                  <span className="text-sm text-muted">Total / week</span>
                  <span className="tabular text-xl font-semibold">
                    {formatPrice(weeklyTotal(setup))}
                  </span>
                </div>
                <SlipBarcode code={code} />
                <StampWhenSent />
              </SlipPaper>
            </section>

            <RequestForm
              setup={setup}
              setupCode={code}
              earliestDate={baliDate(new Date(), DELIVERY_LEAD_DAYS)}
              suggestedDate={baliDate(new Date(), DELIVERY_LEAD_DAYS + 1)}
            />
          </div>
        </CheckoutStatusProvider>
      </main>
      <SiteFooter />
    </>
  );
}
