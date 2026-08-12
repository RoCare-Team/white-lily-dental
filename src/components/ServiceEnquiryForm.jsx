"use client";

import { useState } from "react";
import { AlertCircle, CalendarCheck, CheckCircle2, Loader2, Phone } from "lucide-react";



const field =
  "h-11 w-full rounded-[10px] border border-line bg-white px-3.5 text-[15px] text-navy outline-none transition-colors placeholder:text-muted/70 focus:border-brand focus:ring-2 focus:ring-brand/15";

const label = "mb-1.5 block text-[13.5px] font-semibold text-navy";

/** Compact enquiry form for the service page sidebar. */
export default function ServiceEnquiryForm({ treatment, clinics, site, telHref }) {
  const [sent, setSent] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    clinic: clinics[0].shortName,
    message: "",
    company: "", // honeypot — real patients never see or fill this
  });

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          treatment,
          pageUrl: window.location.pathname,
          source: "service-enquiry",
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(
          data.error ??
            `We could not send your request. Please call us on ${site.phoneDisplay}.`
        );
        return;
      }

      setConfirmation({ name: form.name, phone: form.phone, clinic: form.clinic });
      setForm((f) => ({ ...f, name: "", phone: "", message: "" }));
      setSent(true);
    } catch {
      setError(
        `We could not reach our server. Please call us on ${site.phoneDisplay}.`
      );
    } finally {
      setBusy(false);
    }
  };

  // The sidebar is narrow, so the confirmation replaces the form rather than
  // sitting below it and pushing everything off screen.
  if (sent && confirmation) {
    return (
      <div
        role="status"
        className="wl-confirm rounded-[14px] border border-line bg-white p-5 text-center shadow-[0_18px_36px_-28px_rgba(10,37,64,0.4)]"
      >
        <span className="wl-confirm-tick mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-teal-50">
          <CheckCircle2 className="h-7 w-7 text-teal" aria-hidden="true" />
        </span>

        <div className="wl-confirm-stagger">
          <h2 className="mt-4 text-[18px] font-bold tracking-tight text-navy">
            Request received
          </h2>
          <p className="mt-2 text-[14px] leading-relaxed text-muted">
            Thank you{confirmation.name ? `, ${confirmation.name.split(" ")[0]}` : ""}.
            We will call you on{" "}
            <span className="font-semibold text-navy">{confirmation.phone}</span> to
            confirm your {treatment.toLowerCase()} appointment at{" "}
            {confirmation.clinic}.
          </p>

          <a
            href={telHref}
            className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[11px] bg-coral text-[15px] font-semibold text-white transition-colors hover:bg-coral-dark"
          >
            <Phone className="h-4.5 w-4.5" aria-hidden="true" />
            {site.phoneDisplay}
          </a>

          <button
            type="button"
            onClick={() => {
              setSent(false);
              setConfirmation(null);
            }}
            className="mt-2.5 inline-flex h-11 w-full items-center justify-center rounded-[11px] border border-line text-[14px] font-semibold text-navy transition-colors hover:border-brand hover:text-brand"
          >
            Send another request
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[14px] border border-line bg-white p-5 shadow-[0_18px_36px_-28px_rgba(10,37,64,0.4)]"
    >
      <h2 className="text-[19px] font-bold text-navy">Request Appointment</h2>
      <p className="mt-1.5 text-[14px] leading-relaxed text-muted">
        Fill your details to request an appointment.
      </p>

      <div className="mt-5 space-y-3.5">
        <div>
          <label className={label} htmlFor="sf-name">
            Full name <span className="text-coral">*</span>
          </label>
          <input
            id="sf-name"
            type="text"
            required
            autoComplete="name"
            placeholder="Your name"
            value={form.name}
            onChange={update("name")}
            className={field}
          />
        </div>

        <div>
          <label className={label} htmlFor="sf-phone">
            Phone <span className="text-coral">*</span>
          </label>
          <input
            id="sf-phone"
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
          <label className={label} htmlFor="sf-clinic">
            Preferred clinic
          </label>
          <select
            id="sf-clinic"
            value={form.clinic}
            onChange={update("clinic")}
            className={field}
          >
            {clinics.map((c) => (
              <option key={c.id} value={c.shortName}>
                {c.shortName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={label} htmlFor="sf-message">
            Message
          </label>
          <textarea
            id="sf-message"
            rows={3}
            placeholder={`Tell us about your ${treatment.toLowerCase()} needs`}
            value={form.message}
            onChange={update("message")}
            className="w-full rounded-[10px] border border-line bg-white px-3.5 py-2.5 text-[15px] leading-relaxed text-navy outline-none transition-colors placeholder:text-muted/70 focus:border-brand focus:ring-2 focus:ring-brand/15"
          />
        </div>
      </div>

      {/* Honeypot — hidden from patients and screen readers, bots fill it in. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="sf-company">Company</label>
        <input
          id="sf-company"
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
        className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[11px] bg-deep text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-deep-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? (
          <Loader2 className="h-4.5 w-4.5 animate-spin" aria-hidden="true" />
        ) : (
          <CalendarCheck className="h-4.5 w-4.5" aria-hidden="true" />
        )}
        {busy ? "Sending…" : "Request Appointment"}
      </button>

      <a
        href={telHref}
        className="mt-2.5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[11px] bg-coral text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-coral-dark"
      >
        <Phone className="h-[18px] w-[18px]" aria-hidden="true" />
        {site.phoneDisplay}
      </a>

      {error ? (
        <p
          role="alert"
          className="mt-4 flex items-start gap-2.5 rounded-[10px] border border-coral/40 bg-coral-50 p-3.5 text-[14px] leading-relaxed text-navy"
        >
          <AlertCircle
            className="mt-0.5 h-4.5 w-4.5 shrink-0 text-coral-dark"
            aria-hidden="true"
          />
          {error}
        </p>
      ) : null}

    </form>
  );
}
