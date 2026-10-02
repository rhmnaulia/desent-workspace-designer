import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <header className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-4 sm:px-6">
      <Link
        href="/"
        className="group flex items-baseline gap-2"
        aria-label="monis.rent workspace designer, home"
      >
        <span className="font-display text-xl font-bold tracking-tight">
          monis<span className="text-leaf">.</span>rent
        </span>
        <span className="hidden text-sm text-muted sm:inline">Workspace designer</span>
      </Link>
      <div className="flex items-center gap-4">
        <p className="hidden text-right text-sm text-muted sm:block">
          <span className="hidden md:inline">Delivered and set up </span>from Canggu to Uluwatu
        </p>
        <ThemeToggle />
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mx-auto max-w-[1440px] px-4 pt-12 pb-32 text-sm text-muted sm:px-6 xl:pb-10">
      <p>
        Prices are sample weekly rates in USD for this demo. Built for the{" "}
        <a className="underline underline-offset-2 hover:text-ink" href="https://monis.rent">
          monis.rent
        </a>{" "}
        workspace challenge.
      </p>
    </footer>
  );
}
