/**
 * Button looks as plain class strings, shared by <button> and <Link>.
 * Two variants is all this app needs; add more here rather than inline.
 */
const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-[15px] font-semibold " +
  "transition-[transform,background-color,box-shadow] duration-150 ease-out-soft active:scale-[0.97] " +
  "disabled:cursor-not-allowed disabled:opacity-60 aria-disabled:cursor-not-allowed aria-disabled:opacity-60";

export const buttonStyles = {
  primary: `${base} bg-leaf text-on-leaf shadow-[0_1px_0_rgb(255_255_255/0.15)_inset,0_6px_16px_-8px_rgb(var(--shadow)/0.5)] hover:brightness-110`,
  secondary: `${base} border border-line bg-surface text-ink hover:border-ink/40`,
} as const;
