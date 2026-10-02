import type { Metadata } from "next";
import Link from "next/link";
import { DEFAULT_SETUP } from "@/catalog/presets";
import { RequestForm } from "@/components/checkout/request-form";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { Stage } from "@/components/stage/stage";
import { ArrowLeftIcon } from "@/components/ui/icons";
import { baliDate } from "@/checkout/request";
import { SETUP_PARAM, decodeSetup, encodeSetup } from "@/setup/codec";
import { formatPrice, lineItems } from "@/setup/pricing";

export const metadata: Metadata = {
  title: "Review your setup",
  description: "Check your desk setup, choose how long to rent it and where to deliver it in Bali.",
  // Every setup has its own URL; none of them should compete with the designer in search.
  robots: { index: false, follow: true },
  alternates: { canonical: "/checkout" },
};

/** Orders need a day to pick and load the van. */
const LEAD_DAYS = 1;

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
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Review your setup
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-pretty text-muted">
          Nothing is charged today. Send the request and we&rsquo;ll confirm stock and a delivery
          slot with you first.
        </p>
        {!decoded && (
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

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-start">
          <section aria-labelledby="setup-heading" className="grid gap-5">
            <h2 id="setup-heading" className="sr-only">
              Your setup
            </h2>
            <div className="overflow-hidden rounded-[28px] border border-line bg-[var(--wall)]">
              <Stage setup={setup} className="block aspect-[5/3] w-full" />
            </div>
            <ul className="divide-y divide-dashed divide-line rounded-3xl bg-surface px-5 ring-1 ring-line">
              {items.map((item) => (
                <li key={item.id} className="flex items-baseline gap-3 py-3">
                  <span className="min-w-0 flex-1">
                    {item.name}
                    {item.quantity > 1 && <span className="text-muted"> × {item.quantity}</span>}
                  </span>
                  <span className="tabular">{formatPrice(item.weekly)}</span>
                  <span className="text-sm text-muted">/ wk</span>
                </li>
              ))}
            </ul>
          </section>

          <RequestForm
            setup={setup}
            setupCode={code}
            earliestDate={baliDate(new Date(), LEAD_DAYS)}
            suggestedDate={baliDate(new Date(), LEAD_DAYS + 1)}
          />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
