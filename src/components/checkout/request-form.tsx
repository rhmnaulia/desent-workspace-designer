"use client";

import { SETUP_PARAM } from "@/setup/codec";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  DELIVERY_AREAS,
  formatDay,
  validateRequest,
  type RentalRequest,
  type RequestErrors,
} from "@/checkout/request";
import { RENTAL_TERMS, formatPrice, quote, type RentalTerm } from "@/setup/pricing";
import type { Setup } from "@/setup/types";
import { buttonStyles } from "../ui/button";
import { useCheckoutStatus } from "./checkout-status";
import { ArrowRightIcon } from "../ui/icons";

interface RequestFormProps {
  setup: Setup;
  setupCode: string;
  earliestDate: string;
  suggestedDate: string;
}

/** Fields checked in this order, so focus lands on the first problem a reader would meet. */
const FIELD_ORDER: Array<keyof RentalRequest> = ["area", "date", "name", "contact"];

/**
 * Rental request. There's no backend in this demo, so "sending" is simulated;
 * swapping in a server action means replacing `submitRequest` and nothing else.
 */
export function RequestForm({ setup, setupCode, earliestDate, suggestedDate }: RequestFormProps) {
  const [values, setValues] = useState<RentalRequest>({
    term: "1m",
    area: "",
    date: suggestedDate,
    name: "",
    contact: "",
    notes: "",
  });
  const [errors, setErrors] = useState<RequestErrors>({});
  const [status, setStatus] = useState<"editing" | "sending" | "sent">("editing");
  const form = useRef<HTMLFormElement>(null);
  const { markSent } = useCheckoutStatus();

  const term = RENTAL_TERMS.find((t) => t.id === values.term)!;
  const price = quote(setup, term);

  const update = <K extends keyof RentalRequest>(key: K, value: RentalRequest[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    // Clear an error as soon as the field is touched again; re-check on submit.
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (status === "sending") return;
    const found = validateRequest(values, earliestDate);
    setErrors(found);
    const firstInvalid = FIELD_ORDER.find((key) => found[key]);
    if (firstInvalid) {
      form.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    setStatus("sending");
    await submitRequest();
    setStatus("sent");
    markSent();
  };

  if (status === "sent") {
    return <Confirmation request={values} setupCode={setupCode} term={term} total={price.total} />;
  }

  return (
    <form
      ref={form}
      onSubmit={onSubmit}
      noValidate
      aria-labelledby="request-heading"
      className="grid gap-6 rounded-3xl bg-surface p-5 ring-1 ring-line sm:p-6"
    >
      <h2 id="request-heading" className="font-display text-2xl tracking-tight">
        Rent it
      </h2>

      <fieldset>
        <legend className="font-semibold">How long do you need it?</legend>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {RENTAL_TERMS.map((option) => {
            const checked = option.id === values.term;
            return (
              <label
                key={option.id}
                className={`relative flex cursor-pointer flex-col rounded-2xl border p-3 transition-colors duration-150 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus ${checked ? "border-lagoon bg-[color-mix(in_oklab,var(--lagoon)_8%,var(--surface))]" : "border-line hover:border-ink/40"}`}
              >
                <input
                  type="radio"
                  name="term"
                  value={option.id}
                  checked={checked}
                  onChange={() => update("term", option.id)}
                  className="absolute inset-0 m-0 cursor-pointer appearance-none rounded-2xl opacity-0"
                />
                <span className="font-semibold">{option.label}</span>
                <span className="text-sm text-muted">
                  {option.discount ? `Save ${option.discount * 100}%` : "Standard rate"}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Deliver to" error={errors.area} name="area">
          {(props) => (
            <div className="relative">
              <select
                {...props}
                value={values.area}
                onChange={(e) => update("area", e.target.value)}
                className={`${inputStyles} appearance-none pr-10`}
              >
                <option value="" disabled>
                  Choose an area
                </option>
                {DELIVERY_AREAS.map((area) => (
                  <option key={area}>{area}</option>
                ))}
              </select>
              <svg
                aria-hidden="true"
                viewBox="0 0 12 8"
                className="pointer-events-none absolute top-1/2 right-4 w-3 -translate-y-1/2 text-muted"
              >
                <path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </div>
          )}
        </Field>
        <Field
          label="Delivery date"
          error={errors.date}
          name="date"
          hint={`From ${formatDay(earliestDate)}`}
        >
          {(props) => (
            <input
              {...props}
              type="date"
              min={earliestDate}
              value={values.date}
              onChange={(e) => update("date", e.target.value)}
              className={inputStyles}
            />
          )}
        </Field>
      </div>

      <Field label="Your name" error={errors.name} name="name">
        {(props) => (
          <input
            {...props}
            autoComplete="name"
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            className={inputStyles}
          />
        )}
      </Field>
      <Field
        label="WhatsApp or email"
        error={errors.contact}
        name="contact"
        hint="We'll confirm here before anything is charged."
      >
        {(props) => (
          <input
            {...props}
            autoComplete="on"
            value={values.contact}
            onChange={(e) => update("contact", e.target.value)}
            className={inputStyles}
          />
        )}
      </Field>
      <Field
        label="Notes for the driver (optional)"
        name="notes"
        hint="Villa name, gate code, which floor."
      >
        {(props) => (
          <textarea
            {...props}
            rows={2}
            value={values.notes}
            onChange={(e) => update("notes", e.target.value)}
            className={`${inputStyles} min-h-20 py-3`}
          />
        )}
      </Field>

      <dl className="grid gap-1.5 border-t border-dashed border-line pt-5 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">
            {formatPrice(price.weekly)} × {term.weeks} week{term.weeks > 1 ? "s" : ""}
          </dt>
          <dd className="tabular">{formatPrice(price.gross)}</dd>
        </div>
        {price.savings > 0 && (
          <div className="flex justify-between text-lagoon">
            <dt>{term.label} discount</dt>
            <dd className="tabular">−{formatPrice(price.savings)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-muted">Delivery, assembly and pickup</dt>
          <dd>Included</dd>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <dt className="font-semibold">Total for {term.label}</dt>
          <dd className="tabular text-3xl font-semibold">{formatPrice(price.total)}</dd>
        </div>
      </dl>

      <button
        type="submit"
        aria-disabled={status === "sending"}
        className={`${buttonStyles.primary} w-full`}
      >
        {status === "sending" ? "Sending request…" : "Send rental request"}
        {status === "editing" && <ArrowRightIcon width={18} height={18} />}
      </button>
    </form>
  );
}

const inputStyles =
  "min-h-12 w-full rounded-xl border border-line bg-paper px-4 text-base text-ink transition-colors " +
  "hover:border-ink/40 focus-visible:border-ink aria-invalid:border-error";

interface FieldProps {
  label: string;
  name: keyof RentalRequest;
  hint?: string;
  error?: string;
  children: (props: {
    id: string;
    name: string;
    "aria-invalid"?: boolean;
    "aria-describedby"?: string;
  }) => ReactNode;
}

/** Label, hint and error wired to the control with ids, so screen readers read all three. */
function Field({ label, name, hint, error, children }: FieldProps) {
  const id = `field-${name}`;
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ");
  return (
    <div className="grid content-start gap-1.5">
      <label htmlFor={id} className="font-semibold">
        {label}
      </label>
      {children({
        id,
        name,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy || undefined,
      })}
      {hint && (
        <p id={`${id}-hint`} className="text-sm text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm font-semibold text-error">
          {error}
        </p>
      )}
    </div>
  );
}

/** Stand-in for a real API call. */
const submitRequest = () => new Promise((resolve) => setTimeout(resolve, 700));

function Confirmation({
  request,
  setupCode,
  term,
  total,
}: {
  request: RentalRequest;
  setupCode: string;
  term: RentalTerm;
  total: number;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    // Move focus to the result so keyboard and screen reader users land on it.
    heading.current?.focus();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- origin only exists in the browser
    setShareUrl(`${window.location.origin}/?${SETUP_PARAM}=${setupCode}`);
  }, [setupCode]);

  const firstName = request.name.trim().split(/\s+/)[0];
  const message = `My Bali workspace from monis.rent, ${term.label} for ${formatPrice(total)}: ${shareUrl}`;

  return (
    <section
      aria-labelledby="sent-heading"
      className="rise-in grid gap-4 rounded-3xl bg-surface p-6 ring-1 ring-line"
    >
      <h2
        id="sent-heading"
        ref={heading}
        tabIndex={-1}
        className="font-display text-3xl tracking-tight focus:outline-none"
      >
        Request sent, {firstName}.
      </h2>
      <p className="text-lg text-pretty">
        We&rsquo;ll check stock and message you at <strong>{request.contact}</strong> to confirm
        delivery to {request.area} on {formatDay(request.date)}. Nothing is charged until you say
        yes.
      </p>
      <p className="text-muted">
        {term.label} · <span className="tabular">{formatPrice(total)}</span> total, delivery and
        setup included.
      </p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        <a
          className={buttonStyles.primary}
          href={`https://wa.me/?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noreferrer"
        >
          Share on WhatsApp
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        <Link href={`/?${SETUP_PARAM}=${setupCode}`} className={buttonStyles.secondary}>
          Back to the designer
        </Link>
      </div>
    </section>
  );
}
