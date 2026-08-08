"use client";

import { useState } from "react";
import { CheckCircle2, MessageCircle, Phone } from "lucide-react";

import { clinics } from "@/data/clinics";
import { site, telHref } from "@/data/site";

const field =
  "h-11 w-full rounded-[10px] border border-line bg-white px-3.5 text-[15px] text-navy outline-none transition-colors placeholder:text-muted/70 focus:border-brand focus:ring-2 focus:ring-brand/15";

const label = "mb-1.5 block text-[13.5px] font-semibold text-navy";

/** Compact enquiry form for the service page sidebar. */
export default function ServiceEnquiryForm({ treatment }) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    clinic: clinics[0].shortName,
    message: "",
  });

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = [
      `Appointment request — ${treatment}`,
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Preferred clinic: ${form.clinic}`,
      form.message ? `Message: ${form.message}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    window.open(
      `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener"
    );
    setSent(true);
  };

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

      <button
        type="submit"
        className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[11px] bg-deep text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-deep-600"
      >
        <MessageCircle className="h-4.5 w-4.5" aria-hidden="true" />
        Send Request
      </button>

      <a
        href={telHref}
        className="mt-2.5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[11px] bg-coral text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-coral-dark"
      >
        <Phone className="h-[18px] w-[18px]" aria-hidden="true" />
        {site.phoneDisplay}
      </a>

      {sent ? (
        <p
          role="status"
          className="mt-4 flex items-start gap-2.5 rounded-[10px] border border-coral/30 bg-coral-50 p-3.5 text-[14px] leading-relaxed text-navy"
        >
          <CheckCircle2
            className="mt-0.5 h-4.5 w-4.5 shrink-0 text-coral"
            aria-hidden="true"
          />
          Opened in WhatsApp — send the message and we&rsquo;ll confirm your slot.
        </p>
      ) : null}
    </form>
  );
}
