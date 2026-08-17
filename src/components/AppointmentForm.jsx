"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle,
  CalendarCheck,
  CheckCircle2,
  Loader2,
  Phone,
  Send,
} from "lucide-react";



const fieldClass =
  "h-12 w-full rounded-xl border border-line bg-white px-4 text-[14px] text-navy outline-none transition-colors placeholder:text-muted/70 focus:border-brand focus:ring-2 focus:ring-brand/15";

const labelClass = "mb-2 block text-[13px] font-semibold text-navy";

export default function AppointmentForm({
  services,
  clinics,
  plans,
  doctors,
  site,
  telHref,
}) {
  const searchParams = useSearchParams();

  // "Book appointment" buttons across the site carry what they were next to,
  // so the clinic can see who and what the request is actually for.
  const planParam = searchParams.get("plan");
  const serviceParam = searchParams.get("service");
  const subParam = searchParams.get("sub");
  const doctorParam = searchParams.get("doctor");
  const clinicParam = searchParams.get("clinic");

  const plan = plans.find((p) => p.id === planParam) ?? null;
  const service = services.find((s) => s.slug === serviceParam) ?? null;
  const doctor = doctors?.find((d) => d.slug === doctorParam) ?? null;
  const subService =
    service?.subServices?.find((sub) => sub.slug === subParam) ?? null;

  const [sent, setSent] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  // The URL is known on the first render, so the prefill is the form's initial
  // state rather than an effect that overwrites it a paint later.
  const [form, setForm] = useState(() => {
    let treatment = "";
    let message = "";

    if (plan) {
      treatment = "Dental Plan enquiry";
      message = `I would like to know more about ${plan.name} (₹${plan.price} / year).`;
    } else if (subService) {
      treatment = subService.name;
    } else if (service) {
      treatment = service.title;
    }

    if (doctor && !message) {
      message = `I would like to book an appointment with ${doctor.name}.`;
    }

    return {
      name: "",
      phone: "",
      email: "",
      clinic:
        clinics.find((c) => c.id === clinicParam)?.shortName ??
        clinics[0].shortName,
      treatment,
      date: "",
      message,
      company: "", // honeypot — real patients never see or fill this
    };
  });

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
      doctor ? `Requested doctor: ${doctor.name}` : null,
      plan ? `Dental plan: ${plan.name}` : null,
      form.date ? `Preferred date: ${form.date}` : null,
      form.message ? `Message: ${form.message}` : null,
    ]
      .filter(Boolean)
      .join("\n");

  // Errors render below a long form — scroll them into view so a failed
  // submit is never mistaken for nothing happening.
  const errorRef = useRef(null);
  useEffect(() => {
    if (error) {
      errorRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [error]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          doctor: doctor?.name ?? "",
          plan: plan?.name ?? "",
          pageUrl: window.location.pathname + window.location.search,
          source: "appointment-form",
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

      // Snapshot what was booked before clearing, so the confirmation can
      // repeat it back to the patient.
      setConfirmation({
        name: form.name,
        phone: form.phone,
        clinic: form.clinic,
        treatment: form.treatment,
        date: form.date,
        doctor: doctor?.name ?? "",
        plan: plan?.name ?? "",
      });

      // Clear the personal details so a second patient on the same device does
      // not submit the first one's information by accident.
      setForm((f) => ({
        ...f,
        name: "",
        phone: "",
        email: "",
        date: "",
        message: "",
      }));
      setSent(true);
    } catch {
      setError(
        `We could not reach our server. Please call us on ${site.phoneDisplay}.`
      );
    } finally {
      setBusy(false);
    }
  };

  const mailtoHref = `mailto:${site.email}?subject=${encodeURIComponent(
    "Appointment request — White Lily Dental"
  )}&body=${encodeURIComponent(buildMessage())}`;

  // Once the request is in, the form is replaced by its confirmation — there is
  // nothing left to fill in, and a second submit would only duplicate the lead.
  if (sent && confirmation) {
    const summary = [
      ["Name", confirmation.name],
      ["Phone", confirmation.phone],
      ["Clinic", confirmation.clinic],
      ["Treatment", confirmation.treatment],
      ["Doctor", confirmation.doctor],
      ["Dental plan", confirmation.plan],
      [
        "Preferred date",
        confirmation.date
          ? new Date(confirmation.date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : "",
      ],
    ].filter(([, value]) => value);

    return (
      <div
        role="status"
        className="wl-confirm rounded-[18px] border border-line bg-white p-6 text-center shadow-[0_28px_56px_-38px_rgba(10,37,64,0.45)] sm:p-10"
      >
        <span className="wl-confirm-tick mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-teal-50">
          <CheckCircle2 className="h-9 w-9 text-teal" aria-hidden="true" />
        </span>

        <div className="wl-confirm-stagger">
          <h2 className="mt-5 text-[23px] font-bold tracking-tight text-navy">
            Appointment request received
          </h2>
          <p className="mx-auto mt-2.5 max-w-[420px] text-[14.5px] leading-relaxed text-muted">
            Thank you{confirmation.name ? `, ${confirmation.name.split(" ")[0]}` : ""}.
            Our team will call you on{" "}
            <span className="font-semibold text-navy">{confirmation.phone}</span> to
            confirm your slot during clinic hours, {site.hours}.
          </p>

          <dl className="mx-auto mt-6 max-w-[380px] divide-y divide-line/70 rounded-[12px] border border-line bg-[#fafbfc] px-4 text-left">
            {summary.map(([term, value]) => (
              <div key={term} className="flex gap-4 py-2.5 text-[13.5px]">
                <dt className="w-[110px] shrink-0 text-muted">{term}</dt>
                <dd className="min-w-0 break-words font-semibold text-navy">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-7 flex flex-col justify-center gap-2.5 sm:flex-row">
            <a
              href={telHref}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-coral px-6 text-[14.5px] font-semibold text-white transition-colors hover:bg-coral-dark"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              Call {site.phoneDisplay}
            </a>
            <button
              type="button"
              onClick={() => {
                setSent(false);
                setConfirmation(null);
              }}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-line px-6 text-[14.5px] font-semibold text-navy transition-colors hover:border-brand hover:text-brand"
            >
              Book another appointment
            </button>
          </div>
        </div>
      </div>
    );
  }

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

      {doctor || plan || subService || service ? (
        <div className="mt-5 rounded-xl border border-brand/25 bg-brand-50 p-4">
          <p className="text-[12px] font-bold uppercase tracking-wide text-brand">
            Booking for
          </p>
          <dl className="mt-2 space-y-1 text-[13.5px]">
            {doctor ? (
              <div className="flex gap-2">
                <dt className="text-muted">Doctor</dt>
                <dd className="font-semibold text-navy">{doctor.name}</dd>
              </div>
            ) : null}
            {subService || service ? (
              <div className="flex gap-2">
                <dt className="text-muted">Treatment</dt>
                <dd className="font-semibold text-navy">
                  {subService ? `${service.title} — ${subService.name}` : service.title}
                </dd>
              </div>
            ) : null}
            {plan ? (
              <div className="flex gap-2">
                <dt className="text-muted">Plan</dt>
                <dd className="font-semibold text-navy">
                  {plan.name} (₹{plan.price} {plan.period})
                </dd>
              </div>
            ) : null}
          </dl>
        </div>
      ) : null}

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
            minLength={2}
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
            minLength={8}
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
          <CalendarCheck className="h-4.5 w-4.5" aria-hidden="true" />
        )}
        {busy ? "Sending…" : "Request Appointment"}
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
          ref={errorRef}
          role="alert"
          className="mt-5 flex items-start gap-2.5 rounded-xl border border-coral/40 bg-coral-50 p-4 text-[13.5px] leading-relaxed text-navy"
        >
          <AlertCircle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-coral-dark" aria-hidden="true" />
          {error}
        </p>
      ) : null}

    </form>
  );
}
