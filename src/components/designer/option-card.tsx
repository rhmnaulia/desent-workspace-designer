import { createContext, use, useId, type ReactNode } from "react";
import { CheckIcon, PlusIcon } from "../ui/icons";

/**
 * Shared card chrome for every product in the picker. The real control
 * (radio or checkbox) is an invisible input stretched over the whole card, so
 * keyboard, touch and screen reader behaviour come from the browser, not custom code.
 */
export const cardStyles =
  "group relative flex items-center gap-3 rounded-2xl border border-line bg-surface p-2.5 pr-4 " +
  "transition-[border-color,background-color,box-shadow,transform] duration-150 ease-out-soft " +
  "hover:border-ink/30 hover:shadow-[0_4px_14px_-10px_rgb(var(--shadow)/0.6)]";

/** Applied when the product is part of the setup. */
export const cardSelectedStyles =
  "border-lagoon bg-[color-mix(in_oklab,var(--lagoon)_7%,var(--surface))] hover:border-lagoon";

/**
 * Lets a ChoiceCard's input be named by the product name alone and described
 * by the rest, so a screen reader says "Oak writing desk, radio button, 1 of 3"
 * and only then the details, instead of one long run-on label.
 */
const CardIds = createContext<{ name: string; details: string } | null>(null);

export function CardBody({
  thumbnail,
  name,
  blurb,
  meta,
  price,
  children,
}: {
  thumbnail: ReactNode;
  name: string;
  blurb: string;
  meta?: string;
  price: string;
  /** Extra controls under the text, e.g. a quantity stepper. */
  children?: ReactNode;
}) {
  const ids = use(CardIds);
  return (
    <>
      <span className="grid h-[72px] w-[84px] shrink-0 place-items-center rounded-xl bg-paper p-2">
        {thumbnail}
      </span>
      <span className="min-w-0 flex-1">
        <span id={ids?.name} className="block leading-snug font-semibold">
          {name}
        </span>
        <span id={ids?.details}>
          <span className="mt-0.5 block text-sm leading-snug text-muted">{blurb}</span>
          <span className="mt-1.5 flex flex-wrap items-baseline gap-x-2 text-sm">
            <span>
              <span className="tabular font-semibold">{price}</span>
              <span className="text-muted"> / week</span>
            </span>
            {meta && <span className="text-xs text-muted">{meta}</span>}
          </span>
        </span>
        {children}
      </span>
    </>
  );
}

interface ChoiceCardProps {
  type: "radio" | "checkbox";
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  children: ReactNode;
}

export function ChoiceCard({ type, name, value, checked, onChange, children }: ChoiceCardProps) {
  const id = useId();
  const ids = { name: `${id}-name`, details: `${id}-details` };
  return (
    <label
      className={`${cardStyles} cursor-pointer active:scale-[0.99] has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus ${checked ? cardSelectedStyles : ""}`}
    >
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        aria-labelledby={ids.name}
        aria-describedby={ids.details}
        className="absolute inset-0 z-10 m-0 cursor-pointer appearance-none rounded-2xl opacity-0"
      />
      <CardIds value={ids}>{children}</CardIds>
      {type === "radio" ? (
        <span
          aria-hidden="true"
          className={`absolute -top-2 -right-2 grid size-6 place-items-center rounded-full bg-lagoon text-on-lagoon shadow-sm transition-[opacity,transform] duration-200 ease-out-soft ${checked ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
        >
          <CheckIcon width={14} height={14} strokeWidth={2.4} />
        </span>
      ) : (
        // Add-on cards show an explicit "+" so it's obvious they can be added.
        <span
          aria-hidden="true"
          className={`grid size-8 shrink-0 place-items-center rounded-full border transition-colors duration-150 ${checked ? "border-lagoon bg-lagoon text-on-lagoon" : "border-line text-ink group-hover:border-ink/40"}`}
        >
          {checked ? (
            <CheckIcon width={16} height={16} strokeWidth={2.2} />
          ) : (
            <PlusIcon width={16} height={16} />
          )}
        </span>
      )}
    </label>
  );
}
