"use client";

import dynamic from "next/dynamic";
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { ProductId } from "@/catalog/products";
import { ExpandIcon } from "../ui/icons";

/**
 * A closer look at one product: the real photo (when monis.rent stocks that
 * exact item), the key facts, and why renting it makes sense. One sheet for
 * the whole picker, opened from the picture on any product card.
 */

// The sheet's code (and next/image) stays out of the first page load. Hovering
// or focusing a "More about" button starts fetching it, so opening feels instant.
const loadSheet = () => import("./product-sheet");
const SheetContent = dynamic(loadSheet, { ssr: false });

const DetailsContext = createContext<((id: ProductId) => void) | null>(null);

export function ProductDetailsProvider({ children }: { children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [openId, setOpenId] = useState<ProductId | null>(null);

  const open = useCallback((id: ProductId) => setOpenId(id), []);
  const close = useCallback(() => dialog.current?.close(), []);

  // showModal() gives us the focus trap, Esc to close and an inert page for free.
  useEffect(() => {
    if (openId && !dialog.current?.open) dialog.current?.showModal();
  }, [openId]);

  return (
    <DetailsContext value={open}>
      {children}
      {/* The click handler only adds "click the backdrop to close" for pointer users;
          keyboard users get Esc (native to <dialog>) and the Close button. */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
      <dialog
        ref={dialog}
        aria-labelledby="product-sheet-title"
        onClose={() => setOpenId(null)}
        // A click that lands on the dialog itself (not its content) is the backdrop.
        onClick={(event) => event.target === dialog.current && close()}
        className="product-sheet"
      >
        {openId && <SheetContent id={openId} onDone={close} />}
      </dialog>
    </DetailsContext>
  );
}

function useOpenDetails() {
  const open = use(DetailsContext);
  if (!open) throw new Error("useOpenDetails must be used inside <ProductDetailsProvider>");
  return open;
}

/**
 * Wraps a product card and lays a "details" button over its picture. The
 * button sits beside the card's label rather than inside it, because a label
 * can't contain a second control.
 */
export function WithDetails({
  id,
  name,
  children,
}: {
  id: ProductId;
  name: string;
  children: ReactNode;
}) {
  const open = useOpenDetails();
  return (
    <div className="relative">
      {children}
      <button
        type="button"
        onClick={() => open(id)}
        onPointerEnter={loadSheet}
        onFocus={loadSheet}
        aria-label={`More about the ${name}`}
        className="group/details absolute top-1/2 left-2.5 z-20 h-[72px] w-[84px] -translate-y-1/2 rounded-xl"
      >
        <span className="absolute right-1 bottom-1 grid size-6 place-items-center rounded-full bg-surface text-ink shadow-sm ring-1 ring-line transition-transform duration-150 group-hover/details:scale-110">
          <ExpandIcon width={12} height={12} strokeWidth={2} />
        </span>
      </button>
    </div>
  );
}
