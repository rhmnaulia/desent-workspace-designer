import type { AccessoryId, ChairId, DeskId } from "@/catalog/products";
import { getDesk } from "@/catalog/products";
import type { ReactNode } from "react";
import { Chair } from "./parts/chairs";
import { DeskBase, DeskTop } from "./parts/desks";
import { CoffeeCorner, Monstera } from "./parts/floor-items";
import { KeyboardAndMouse, LaptopOnStand, Lamp, LampGlow, Monitor } from "./parts/gear";

/**
 * Small pictures for the picker, drawn with the exact same parts as the stage
 * so what you tap is what you get. Decorative: the card's text carries the meaning.
 */

type ProductId = DeskId | ChairId | AccessoryId;

function frame(id: ProductId): { viewBox: string; art: ReactNode } {
  switch (id) {
    case "oak-desk":
    case "standing-desk":
    case "standing-desk-xl": {
      const width = getDesk(id).widthCm * 3.2;
      return {
        viewBox: `-8 -10 ${width + 16} 150`,
        art: (
          <>
            <DeskTop desk={id} width={width} />
            <DeskBase desk={id} width={width} />
          </>
        ),
      };
    }
    case "rattan-chair":
    case "mesh-chair":
    case "pro-chair":
      return { viewBox: "-80 -240 160 250", art: <Chair chair={id} /> };
    case "monitor-24":
    case "monitor-27":
      return { viewBox: "-80 -132 160 140", art: <Monitor size={id} seed={0} /> };
    case "laptop-stand":
      return { viewBox: "-60 -104 120 110", art: <LaptopOnStand /> };
    case "keyboard-mouse":
      return { viewBox: "-62 -30 154 36", art: <KeyboardAndMouse /> };
    case "desk-lamp":
      return {
        viewBox: "-120 -138 170 146",
        art: (
          <>
            <LampGlow />
            <Lamp />
          </>
        ),
      };
    case "monstera":
      return { viewBox: "-80 -196 160 204", art: <Monstera /> };
    case "coffee-machine":
      return { viewBox: "-60 -146 120 154", art: <CoffeeCorner /> };
  }
}

export function Thumbnail({ id, className }: { id: ProductId; className?: string }) {
  const { viewBox, art } = frame(id);
  return (
    <svg viewBox={viewBox} aria-hidden="true" focusable="false" className={className}>
      {art}
    </svg>
  );
}
