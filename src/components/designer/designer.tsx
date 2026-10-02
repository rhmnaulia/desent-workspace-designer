"use client";

import { SetupProvider, useSetup } from "@/setup/context";
import { MobileBar } from "../sheet/mobile-bar";
import { RentalSlip } from "../sheet/rental-slip";
import { LiveRegion } from "../ui/live-region";
import { StagePanel } from "./stage-panel";
import { StarterSetups } from "./starter-setups";
import { Steps } from "./steps";

/**
 * The interactive part of the home page. Layout by breakpoint:
 *  - phone:   preview (pinned) → picker → slip, with a bottom bar
 *  - lg:      preview + picker on the left, slip on the right
 *  - xl:      picker | preview | slip, all in view at once
 */
export function Designer() {
  return (
    <SetupProvider>
      <DesignerLayout />
    </SetupProvider>
  );
}

function DesignerLayout() {
  const { message } = useSetup();
  return (
    <>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:[grid-template-areas:'stage_slip'_'picker_slip'] xl:grid-cols-[minmax(320px,380px)_minmax(0,1fr)_320px] xl:[grid-template-areas:'picker_stage_slip']">
        {/* Pinned on phones so you can watch the setup change while you pick. */}
        <div className="sticky top-0 z-20 -mx-4 bg-paper px-4 pt-2 pb-3 sm:static sm:mx-0 sm:p-0 lg:[grid-area:stage] xl:sticky xl:top-6 xl:self-start">
          <StagePanel />
        </div>
        <div className="grid min-w-0 content-start gap-5 lg:[grid-area:picker]">
          <StarterSetups />
          <Steps />
        </div>
        <div className="lg:sticky lg:top-6 lg:self-start lg:[grid-area:slip]">
          <RentalSlip />
        </div>
      </div>
      <MobileBar />
      <LiveRegion message={message} />
    </>
  );
}
