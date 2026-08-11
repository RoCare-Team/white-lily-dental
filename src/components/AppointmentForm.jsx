"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2, MessageCircle, Send } from "lucide-react";



const fieldClass =
  "h-12 w-full rounded-xl border border-line bg-white px-4 text-[14px] text-navy outline-none transition-colors placeholder:text-muted/70 focus:border-brand focus:ring-2 focus:ring-brand/15";

const labelClass = "mb-2 block text-[13px] font-semibold text-navy";

export default function AppointmentForm({ services, clinics, plans, site }) {
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan");
  const serviceParam = searchParams.get("service");

  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    clinic: clinics[0].shortName,
    treatment: "",
    date: "",
    message: "",
    company: "", // honeypot — real patients never see or fill this
  });

  useEffect(() => {
    const plan = plans.find((p) => p.id === planParam);
    const service = services.find((s) => s.slug === serviceParam);

    if (plan) {
      setForm((f) => ({
        ...f,
        treatment: "Dental Plan enquiry",
        message: `I would like to know more about ${plan.name} (₹${plan.price} / year).`,
      }));
    } else if (service) {
      setForm((f) => ({ ...f, treatment: service.title }));
    }
  }, [planParam, serviceParam]);

  const update = (key) => (event) =>
    setForm((f) => ({ ...f, [key]: event.target.value }));

  const buildMessage = () =>
    [
      "New appointment request — White Lily Dental",
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      form.email ? `Email: ${form.email}` : null,
      `Preferred clinic: ${form.clinic}`,
      form.treatment ? `Treatment: ${form.treatment}` : null,
      form.date ? `Preferred date: ${form.date}` : null,
      form.message ? `Message: ${form.message}` : null,
    ]
      .filter(Boolean)
      .join("\n");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");

    // Open the tab synchronously — a tab opened after an await is blocked as a popup.
    const text = encodeURIComponent(buildMessage());
    const waTab = window.open(
      `https://wa.me/${site.whatsapp}?text=${text}`,
      "_blank",
      "noopener"
    );

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "appointment-form" }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        // The WhatsApp hand-off already happened, so this is a soft warning.
        setError(
          data.error ??
            "We could not save your request on our side — please send the WhatsApp message so we still receive it."
        );
      }
    } catch {
      setError(
        "We could not reach our server — please send the WhatsApp message so we still receive your request."
      );
    } finally {
      if (!waTab) {
        setError(
          "Your browser blocked the WhatsApp window. Please allow pop-ups, or call us directly."
        );
      }
      setBusy(false);
      setSent(true);
    }
  };

  const mailtoHref = `mailto:${site.email}?subject=${encodeURIComponent(
    "Appointment request — White Lily Dental"
  )}&body=${encodeURIComponent(buildMessage())}`;

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[18px] border border-line bg-white p-5 shadow-[0_28px_56px_-38px_rgba(10,37,64,0.45)] sm:p-8"
    >
      <h2 className="text-[22px] font-bold text-navy">Request an Appointment</h2>
      <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
        Fill in your details and we will confirm your slot on WhatsApp or by
        phone. Same-day appointments are often available.
      </p>

      <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="name">
            Full name <span className="text-brand">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Your full name"
            value={form.name}
            onChange={update("name")}
            className={fieldClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="phone">
            Phone number <span className="text-brand">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            inputMode="tel"
            autoComplete="tel"
            pattern="[0-9+\s-]{8,15}"
            placeholder="+91 XXXXX XXXXX"
            value={form.phone}
            onChange={update("phone")}
            className={fieldClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="email">
            Email (optional)
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={update("email")}
            className={fieldClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="clinic">
            Preferred clinic
          </label>
          <select
            id="clinic"
            name="clinic"
            value={form.clinic}
            onChange={update("clinic")}
            className={fieldClass}
          >
            {clinics.map((clinic) => (
              <option key={clinic.id} value={clinic.shortName}>
                {clinic.shortName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="treatment">
            Treatment required
          </label>
          <select
            id="treatment"
            name="treatment"
            value={form.treatment}
            onChange={update("treatment")}
            className={fieldClass}
          >
            <option value="">Select a treatment</option>
            <option value="General consultation">General consultation</option>
            {services.map((service) => (
              <option key={service.slug} value={service.title}>
                {service.title}
              </option>
            ))}
            <option value="Invisible Aligners">Invisible Aligners</option>
            <option value="Dental Plan enquiry">Dental Plan enquiry</option>
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="date">
            Preferred date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            value={form.date}
            onChange={update("date")}
            className={fieldClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="message">
            Tell us about your concern
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            placeholder="Briefly describe the problem, e.g. pain in a lower back tooth for the last week."
            value={form.message}
            onChange={update("message")}
            className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[14px] leading-relaxed text-navy outline-none transition-colors placeholder:text-muted/70 focus:border-brand focus:ring-2 focus:ring-brand/15"
          />
        </div>
      </div>

      {/* Honeypot — hidden from patients and screen readers, bots fill it in. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
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
        className="mt-7 inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-deep px-6 text-[14.5px] font-semibold text-white shadow-[0_10px_24px_-12px_rgba(7,83,107,0.85)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-deep-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {busy ? (
          <Loader2 className="h-4.5 w-4.5 animate-spin" aria-hidden="true" />
        ) : (
          <MessageCircle className="h-4.5 w-4.5" aria-hidden="true" />
        )}
        {busy ? "Sending…" : "Send Request on WhatsApp"}
      </button>

      <p className="mt-4 text-[14px] leading-relaxed text-muted">
        Prefer email?{" "}
        <a
          href={mailtoHref}
          className="inline-flex items-center gap-1 font-semibold text-coral hover:text-coral-dark"
        >
          Send the same details by email
          <Send className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
        . We reply during clinic hours, {site.hours}.
      </p>

      {error ? (
        <p
          role="alert"
          className="mt-5 flex items-start gap-2.5 rounded-xl border border-coral/40 bg-coral-50 p-4 text-[13.5px] leading-relaxed text-navy"
        >
          <AlertCircle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-coral-dark" aria-hidden="true" />
          {error}
        </p>
      ) : null}

      {sent && !error ? (
        <p
          role="status"
          className="mt-5 flex items-start gap-2.5 rounded-xl border border-coral/30 bg-coral-50 p-4 text-[13.5px] leading-relaxed text-navy"
        >
          <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-coral" aria-hidden="true" />
          We have received your request and opened it in WhatsApp. Send the
          message and our team will confirm your appointment shortly.
        </p>
      ) : null}
    </form>
  );
}
