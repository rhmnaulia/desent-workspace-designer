import { Designer } from "@/components/designer/designer";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { JsonLd } from "@/components/json-ld";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto max-w-[1440px] px-4 sm:px-6">
        <div className="grid gap-3 pt-2 pb-6 sm:pt-4 sm:pb-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-end lg:gap-12">
          <h1 className="font-display text-[32px] leading-[1.08] font-semibold tracking-tight text-balance sm:text-5xl">
            Build your Bali desk before the jet lag wears off.
          </h1>
          <p className="max-w-xl text-lg text-pretty text-muted lg:pb-1">
            Pick a desk, a chair and the gear you actually use. Watch it come together, then rent it
            for a week or a whole season. We deliver it and set it up for you.
          </p>
        </div>
        <Designer />
      </main>
      <SiteFooter />
      <JsonLd />
    </>
  );
}
