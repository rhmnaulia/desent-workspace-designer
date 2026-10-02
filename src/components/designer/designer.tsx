"use client";

import { SetupProvider, useSetup } from "@/setup/context";
import { MobileBar } from "../sheet/mobile-bar";
import { RentalSlip } from "../sheet/rental-slip";
import { LiveRegion } from "../ui/live-region";
import { ProductDetailsProvider } from "./product-details";
import { StagePanel } from "./stage-panel";
import { StarterSetups } from "./starter-setups";
import { Steps } from "./steps";

/**
 * The interactive part of the home page. The preview always stays in view
 * while you pick, because watching it change is the point. By breakpoint:
 *  - phone:   preview pinned on top → picker → slip, with a bottom bar
 *  - md–lg:   preview pinned on the left | picker, then slip, with a bottom bar
 *  - xl:      picker | preview | slip, all in view at once
 */
export function Designer() {
  return (
    <SetupProvider>
      <ProductDetailsProvider>
        <DesignerLayout />
      </ProductDetailsProvider>
    </SetupProvider>
  );
}

function DesignerLayout() {
  const { message } = useSetup();
  return (
    <>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:grid-rows-[auto_1fr] md:[grid-template-areas:'stage_picker'_'stage_slip'] xl:grid-cols-[minmax(320px,380px)_minmax(0,1fr)_320px] xl:grid-rows-none xl:[grid-template-areas:'picker_stage_slip']">
        {/* Small landscape-ish screens (sm) scroll it normally: pinned, it would fill the screen. */}
        <div className="sticky top-0 z-20 -mx-4 bg-paper px-4 pt-2 pb-3 sm:static sm:mx-0 sm:p-0 md:sticky md:top-4 md:self-start md:[grid-area:stage] xl:top-6">
          <StagePanel />
        </div>
        <div className="grid min-w-0 content-start gap-5 md:[grid-area:picker]">
          <StarterSetups />
          <Steps />
        </div>
        <div className="min-w-0 md:[grid-area:slip] xl:sticky xl:top-6 xl:self-start">
          <RentalSlip />
        </div>
      </div>
      <MobileBar />
      <LiveRegion message={message} />
    </>
  );
}
