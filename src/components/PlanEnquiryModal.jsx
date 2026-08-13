"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Loader2,
  Phone,
  Send,
  Tag,
  X,
} from "lucide-react";

const field =
  "h-11 w-full rounded-[10px] border border-line bg-white px-3.5 text-[14.5px] text-navy outline-none transition-colors placeholder:text-muted/70 focus:border-brand focus:ring-2 focus:ring-brand/15";

const label = "mb-1.5 block text-[13px] font-semibold text-navy";

/**
 * Dental plans are bought, not scheduled — there is no chair time to reserve,
 * so this is a plain enquiry form rather than the slot-booking wizard.
 * Submissions land in the admin panel under Enquiries.
 */
export default function PlanEnquiryModal({ plans = [], clinics = [], site, telHref }) {
  const [open, setOpen] = useState(false);
  const [planId, setPlanId] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    clinic: "",
    message: "",
    company: "", // honeypot
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(null);

  const reset = useCallback(() => {
    setPlanId("");
    setForm({
      name: "",
      phone: "",
      email: "",
      clinic: "",
      message: "",
      company: "",
    });
    setError("");
    setSent(null);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setTimeout(reset, 200);
  }, [reset]);

  /* Capture phase, so next/link cannot navigate before this runs. */
  useEffect(() => {
    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const trigger = event.target.closest?.("[data-plan-enquiry]");
      if (!trigger) return;

      event.preventDefault();
      event.stopPropagation();

      const href = trigger.getAttribute("href") ?? "";
      const query = href.includes("?") ? href.slice(href.indexOf("?") + 1) : "";
      const id = new URLSearchParams(query).get("plan");

      // The card they clicked is the starting point, not a lock-in.
      const picked = plans.find((p) => p.id === id) ?? plans[0];
      setPlanId(picked?.id ?? "");
      setForm((f) => ({
        ...f,
        clinic: f.clinic || clinics[0]?.shortName || "",
      }));
      setOpen(true);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [plans, clinics]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, close]);

  const plan = plans.find((p) => p.id === planId) ?? null;

  const update = (key) => (event) =>
    setForm((f) => ({ ...f, [key]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          treatment: "Dental Plan enquiry",
          plan: plan?.name ?? "",
          pageUrl: window.location.pathname + window.location.search,
          source: "plan-enquiry",
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(
          data.error ??
            `We could not send your enquiry. Please call us on ${site.phoneDisplay}.`
        );
        return;
      }

      setSent({ name: form.name, phone: form.phone });
    } catch {
      setError(`We could not reach our server. Please call us on ${site.phoneDisplay}.`);
    } finally {
      setBusy(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-navy/60 p-4 backdrop-blur-[2px] sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Dental plan enquiry"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={close}
        className="absolute inset-0 -z-10 cursor-default"
      />

      <div className="wl-confirm relative flex max-h-[calc(100dvh-2rem)] w-full max-w-[520px] flex-col overflow-hidden rounded-[18px] bg-white shadow-2xl">
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
          <h2 className="text-[16.5px] font-bold leading-snug text-navy sm:text-[18px]">
            {sent ? "Enquiry received" : "Enquire about this dental plan"}
          </h2>
          <button
            type="button"
            onClick={close}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-coral-50 hover:text-coral-dark"
          >
            <X className="h-4.5 w-4.5" aria-hidden="true" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          {sent ? (
            <div className="text-center">
              <span className="wl-confirm-tick mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-teal-50">
                <CheckCircle2 className="h-9 w-9 text-teal" aria-hidden="true" />
              </span>

              <div className="wl-confirm-stagger">
                <h3 className="mt-5 text-[20px] font-bold tracking-tight text-navy">
                  Thank you{sent.name ? `, ${sent.name.split(" ")[0]}` : ""}
                </h3>
                <p className="mx-auto mt-2 max-w-[400px] text-[14px] leading-relaxed text-muted">
                  We have your enquiry about{" "}
                  <span className="font-semibold text-navy">
                    {plan?.name ?? "our dental plans"}
                  </span>
                  . Our team will call you on{" "}
                  <span className="font-semibold text-navy">{sent.phone}</span> to
                  explain what is covered and how to enrol.
                </p>

                <div className="mt-6 flex flex-col justify-center gap-2.5 sm:flex-row">
                  <a
                    href={telHref}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-coral px-5 text-[14.5px] font-semibold text-white transition-colors hover:bg-coral-dark"
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    Call {site.phoneDisplay}
                  </a>
                  <button
                    type="button"
                    onClick={close}
                    className="inline-flex h-12 items-center justify-center rounded-xl border border-line px-6 text-[14.5px] font-semibold text-navy transition-colors hover:border-brand hover:text-brand"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={submit}>
              <div className="mb-4 rounded-xl border border-brand/25 bg-brand-50 px-4 py-3.5">
                <label
                  className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-brand"
                  htmlFor="pe-plan"
                >
                  <Tag className="h-3.5 w-3.5" aria-hidden="true" />
                  Which plan?
                </label>

                <select
                  id="pe-plan"
                  value={planId}
                  onChange={(event) => setPlanId(event.target.value)}
                  className={`${field} mt-2 bg-white font-semibold`}
                >
                  {plans.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} — ₹{item.price} {item.period}
                    </option>
                  ))}
                </select>

                {plan?.description ? (
                  <p className="mt-2 text-[13px] leading-relaxed text-muted">
                    {plan.description}
                  </p>
                ) : null}

                {plan?.features?.length ? (
                  <ul className="mt-2 space-y-1">
                    {plan.features.slice(0, 3).map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-1.5 text-[12.5px] leading-snug text-navy/80"
                      >
                        <Check
                          className="mt-0.5 h-3 w-3 shrink-0 text-brand"
                          strokeWidth={3}
                          aria-hidden="true"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>

              {error ? (
                <p
                  role="alert"
                  className="mb-5 flex items-start gap-2 rounded-xl border border-coral/40 bg-coral-50 p-3.5 text-[13.5px] leading-relaxed text-navy"
                >
                  <AlertCircle
                    className="mt-0.5 h-4 w-4 shrink-0 text-coral-dark"
                    aria-hidden="true"
                  />
                  {error}
                </p>
              ) : null}

              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <div>
                  <label className={label} htmlFor="pe-name">
                    Full name <span className="text-coral">*</span>
                  </label>
                  <input
                    id="pe-name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={update("name")}
                    className={field}
                  />
                </div>

                <div>
                  <label className={label} htmlFor="pe-phone">
                    Phone number <span className="text-coral">*</span>
                  </label>
                  <input
                    id="pe-phone"
                    type="tel"
                    required
                    inputMode="tel"
                    autoComplete="tel"
                    pattern="[0-9+\s-]{8,15}"
                    placeholder="+91 XXXXX XXXXX"
                    value={form.phone}
                    onChange={update("phone")}
                    className={field}
                  />
                </div>

                <div>
                  <label className={label} htmlFor="pe-email">
                    Email (optional)
                  </label>
                  <input
                    id="pe-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={update("email")}
                    className={field}
                  />
                </div>

                <div>
                  <label className={label} htmlFor="pe-clinic">
                    Preferred clinic
                  </label>
                  <select
                    id="pe-clinic"
                    value={form.clinic}
                    onChange={update("clinic")}
                    className={field}
                  >
                    {clinics.map((clinic) => (
                      <option key={clinic.id} value={clinic.shortName}>
                        {clinic.shortName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className={label} htmlFor="pe-message">
                    Anything you would like to ask?
                  </label>
                  <textarea
                    id="pe-message"
                    rows={2}
                    placeholder="How many family members, what is covered, how to enrol…"
                    value={form.message}
                    onChange={update("message")}
                    className="w-full rounded-[10px] border border-line bg-white px-3.5 py-2.5 text-[14.5px] leading-relaxed text-navy outline-none transition-colors placeholder:text-muted/70 focus:border-brand focus:ring-2 focus:ring-brand/15"
                  />
                </div>
              </div>

              {/* Honeypot */}
              <div
                aria-hidden="true"
                className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
              >
                <label htmlFor="pe-company">Company</label>
                <input
                  id="pe-company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.company}
                  onChange={update("company")}
                />
              </div>

              <button
                type="submit"
                disabled={busy}
                className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-deep text-[15px] font-semibold text-white transition-colors hover:bg-deep-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? (
                  <Loader2 className="h-4.5 w-4.5 animate-spin" aria-hidden="true" />
                ) : (
                  <Send className="h-4.5 w-4.5" aria-hidden="true" />
                )}
                {busy ? "Sending…" : "Send Enquiry"}
              </button>

              <p className="mt-2.5 text-center text-[12.5px] text-muted">
                No payment now — our team will call you to explain the plan first.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
