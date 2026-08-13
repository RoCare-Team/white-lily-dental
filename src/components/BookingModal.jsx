"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  Building2,
  CalendarCheck,
  Check,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  Phone,
  Stethoscope,
  User,
  X,
} from "lucide-react";

import { bookingWindow, formatTime } from "@/lib/slots";

const STEPS = [
  { key: "clinic", label: "Select Clinic", icon: Building2 },
  { key: "slot", label: "Select Date & Time", icon: CalendarCheck },
  { key: "details", label: "Personal Details", icon: User },
  { key: "done", label: "Finish", icon: Check },
];

const field =
  "h-12 w-full rounded-xl border border-line bg-white px-4 text-[15px] text-navy outline-none transition-colors placeholder:text-muted/70 focus:border-brand focus:ring-2 focus:ring-brand/15";

/** Long date for the confirmation, from a YYYY-MM-DD key. */
function formatDate(key) {
  if (!key) return "";
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BookingModal({
  clinics,
  services = [],
  doctors = [],
  plans = [],
  site,
  telHref,
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [context, setContext] = useState({});

  const [clinicId, setClinicId] = useState("");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [slotTime, setSlotTime] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [form, setForm] = useState({ name: "", phone: "", email: "", company: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState(null);

  const [treatment, setTreatment] = useState("");

  const dialogRef = useRef(null);
  const window30 = bookingWindow();

  /**
   * What the patient was looking at when they clicked. The trigger's href
   * already carries it (/contact?service=…&doctor=…), so the button that opened
   * the wizard decides what is being booked — no extra wiring per button.
   */
  const readContext = useCallback(
    (trigger) => {
      const href = trigger.getAttribute("href") ?? "";
      const query = href.includes("?") ? href.slice(href.indexOf("?") + 1) : "";
      const params = new URLSearchParams(query);

      const service = services.find((s) => s.slug === params.get("service"));
      const sub = service?.subServices?.find((x) => x.slug === params.get("sub"));
      const doctor = doctors.find((d) => d.slug === params.get("doctor"));
      const plan = plans.find((p) => p.id === params.get("plan"));

      return {
        treatment: sub?.name ?? service?.title ?? (plan ? "Dental Plan enquiry" : ""),
        doctor: doctor?.name ?? "",
        plan: plan?.name ?? "",
        // Price is shown to the patient but not stored — the plan name is what
        // the clinic searches on, and prices change.
        planPrice: plan ? `₹${plan.price} ${plan.period}` : "",
        clinicId: params.get("clinic") ?? "",
      };
    },
    [services, doctors, plans]
  );

  const reset = useCallback(() => {
    setStep(0);
    setClinicId("");
    setDate("");
    setSlots([]);
    setSlotTime("");
    setForm({ name: "", phone: "", email: "", company: "" });
    setTreatment("");
    setContext({});
    setError("");
    setBooking(null);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    // Let the closing transition finish before wiping the contents.
    setTimeout(reset, 200);
  }, [reset]);

  /* Any element with data-book-appointment opens the wizard. Links keep their
     href, so without JavaScript they still reach the contact page.

     Listening in the capture phase matters: next/link attaches its own click
     handler to the anchor, which in the bubble phase would already have
     navigated away before this ran. */
  useEffect(() => {
    const onClick = (event) => {
      // Let modified clicks (new tab, save link) behave normally.
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const trigger = event.target.closest?.("[data-book-appointment]");
      if (!trigger) return;

      event.preventDefault();
      event.stopPropagation();

      setContext(readContext(trigger));
      setOpen(true);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [readContext]);

  /* Apply whatever the trigger told us as soon as the wizard opens. */
  useEffect(() => {
    if (!open) return;
    if (context.clinicId && clinics.some((c) => c.id === context.clinicId)) {
      setClinicId(context.clinicId);
    }
    if (context.treatment) setTreatment(context.treatment);
  }, [open, context, clinics]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, close]);

  /* Fetch availability whenever the clinic or the date changes. */
  useEffect(() => {
    if (!clinicId || !date) {
      setSlots([]);
      return;
    }

    let cancelled = false;
    setLoadingSlots(true);
    setError("");
    setSlotTime("");

    fetch(`/api/slots?clinic=${encodeURIComponent(clinicId)}&date=${date}`)
      .then((response) => response.json())
      .then((data) => {
        if (cancelled) return;
        if (data.error) {
          setError(data.error);
          setSlots([]);
          return;
        }
        setSlots(data.slots ?? []);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load available times. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false);
      });

    return () => {
      cancelled = true;
    };
  }, [clinicId, date]);

  const clinic = clinics.find((item) => item.id === clinicId);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          clinicId,
          slotDate: date,
          slotTime,
          treatment,
          doctor: context.doctor ?? "",
          plan: context.plan ?? "",
          pageUrl: window.location.pathname + window.location.search,
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error ?? "Could not complete your booking.");
        // Someone else took the slot — send them back to pick another.
        if (data.code === "slot_taken") {
          setSlotTime("");
          setStep(1);
          const refreshed = await fetch(
            `/api/slots?clinic=${encodeURIComponent(clinicId)}&date=${date}`
          )
            .then((r) => r.json())
            .catch(() => null);
          if (refreshed?.slots) setSlots(refreshed.slots);
        }
        return;
      }

      setBooking(data.booking);
      setStep(3);
    } catch {
      setError(`Could not reach our server. Please call us on ${site.phoneDisplay}.`);
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
      aria-label="Book an appointment"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={close}
        className="absolute inset-0 -z-10 cursor-default"
      />

      <div
        ref={dialogRef}
        tabIndex={-1}
        className="wl-confirm relative flex max-h-[calc(100dvh-2rem)] w-full max-w-[620px] flex-col overflow-hidden rounded-[18px] bg-white shadow-2xl outline-none"
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
          <h2 className="text-[16.5px] font-bold leading-snug text-navy sm:text-[18px]">
            Book an Appointment at{" "}
            <span className="text-brand">{site.name}</span>
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

        {/* Stepper */}
        <ol className="flex shrink-0 items-start gap-1 px-5 pt-5 sm:px-6">
          {STEPS.map((s, index) => {
            const Icon = s.icon;
            const done = index < step;
            const current = index === step;
            return (
              <li key={s.key} className="relative flex flex-1 flex-col items-center">
                {index > 0 ? (
                  <span
                    aria-hidden="true"
                    className={`absolute right-1/2 top-5 h-0.5 w-full ${
                      done || current ? "bg-brand" : "bg-line"
                    }`}
                  />
                ) : null}
                <span
                  className={`relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                    done || current ? "bg-brand text-white" : "bg-[#e9edf3] text-muted"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                </span>
                <span
                  className={`mt-2 text-center text-[11.5px] font-semibold leading-tight sm:text-[12.5px] ${
                    done || current ? "text-navy" : "text-muted"
                  }`}
                >
                  {s.label}
                </span>
              </li>
            );
          })}
        </ol>

        <div className="flex-1 overflow-y-auto px-5 pb-6 pt-5 sm:px-6">
          {/* What the button that opened this was about — so the patient can
              see they are booking the right thing. */}
          {step < 3 && (treatment || context.doctor || context.plan) ? (
            <div className="mb-5 rounded-xl border border-brand/25 bg-brand-50 px-4 py-3">
              <p className="text-[11px] font-bold uppercase tracking-wide text-brand">
                Booking for
              </p>
              <dl className="mt-1.5 space-y-0.5 text-[13.5px]">
                {treatment ? (
                  <div className="flex gap-2">
                    <dt className="text-muted">Treatment</dt>
                    <dd className="font-semibold text-navy">{treatment}</dd>
                  </div>
                ) : null}
                {context.doctor ? (
                  <div className="flex gap-2">
                    <dt className="text-muted">Doctor</dt>
                    <dd className="font-semibold text-navy">{context.doctor}</dd>
                  </div>
                ) : null}
                {context.plan ? (
                  <div className="flex gap-2">
                    <dt className="text-muted">Plan</dt>
                    <dd className="font-semibold text-navy">
                      {context.plan}
                      {context.planPrice ? (
                        <span className="font-normal text-muted">
                          {" "}({context.planPrice})
                        </span>
                      ) : null}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </div>
          ) : null}

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

          {/* 1 — clinic */}
          {step === 0 ? (
            <>
              <ul className="space-y-3">
                {clinics.map((item) => {
                  const selected = item.id === clinicId;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => setClinicId(item.id)}
                        aria-pressed={selected}
                        className={`flex w-full items-center gap-4 rounded-[13px] border p-4 text-left transition-colors ${
                          selected
                            ? "border-brand bg-brand-50"
                            : "border-line hover:border-brand-200 hover:bg-brand-50/40"
                        }`}
                      >
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-1.5 text-[16px] font-bold text-coral-dark">
                            <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                            {item.shortName}
                          </span>
                          <span className="mt-1 block text-[13.5px] leading-relaxed text-muted">
                            {item.address}
                          </span>
                        </span>
                        <span
                          className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 ${
                            selected
                              ? "border-brand bg-brand text-white"
                              : "border-line bg-white"
                          }`}
                        >
                          {selected ? (
                            <Check className="h-3.5 w-3.5" aria-hidden="true" />
                          ) : null}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <Actions
                onNext={() => setStep(1)}
                nextDisabled={!clinicId}
                nextHint={!clinicId ? "Choose a clinic to continue" : ""}
              />
            </>
          ) : null}

          {/* 2 — date and time */}
          {step === 1 ? (
            <>
              <label className="block text-[13.5px] font-semibold text-navy" htmlFor="bk-date">
                Select date
              </label>
              <input
                id="bk-date"
                type="date"
                value={date}
                min={window30.min}
                max={window30.max}
                onChange={(event) => setDate(event.target.value)}
                className={`${field} mt-1.5`}
              />

              <p className="mt-5 text-[13.5px] font-semibold text-navy">Select time</p>

              {!date ? (
                <p className="mt-2 text-[13.5px] text-muted">
                  Pick a date to see the times still open at {clinic?.shortName}.
                </p>
              ) : loadingSlots ? (
                <p className="mt-3 flex items-center gap-2 text-[13.5px] text-muted">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Checking availability…
                </p>
              ) : slots.length === 0 ? (
                <p className="mt-3 rounded-xl border border-line bg-[#fafbfc] p-4 text-[13.5px] leading-relaxed text-muted">
                  No times left at {clinic?.shortName} on this date. Please choose
                  another day, or call us on{" "}
                  <a href={telHref} className="font-semibold text-brand">
                    {site.phoneDisplay}
                  </a>
                  .
                </p>
              ) : (
                <ul className="mt-2.5 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {slots.map((slot) => {
                    const selected = slot.time === slotTime;
                    return (
                      <li key={slot.time}>
                        <button
                          type="button"
                          onClick={() => setSlotTime(slot.time)}
                          aria-pressed={selected}
                          className={`h-11 w-full rounded-[10px] border text-[13.5px] font-semibold transition-colors ${
                            selected
                              ? "border-deep bg-deep text-white"
                              : "border-line bg-white text-navy hover:border-brand hover:text-brand"
                          }`}
                        >
                          {slot.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}

              <Actions
                onBack={() => setStep(0)}
                onNext={() => setStep(2)}
                nextDisabled={!date || !slotTime}
                nextHint={!date ? "Choose a date" : !slotTime ? "Choose a time" : ""}
              />
            </>
          ) : null}

          {/* 3 — patient details */}
          {step === 2 ? (
            <form onSubmit={submit}>
              <div className="mb-5 rounded-xl border border-brand/25 bg-brand-50 p-3.5 text-[13.5px] text-navy">
                <span className="font-semibold">{clinic?.shortName}</span>
                {" · "}
                {formatDate(date)}
                {" · "}
                <span className="font-semibold">{formatTime(slotTime)}</span>
              </div>

              <div className="space-y-3.5">
                <select
                  value={treatment}
                  onChange={(e) => setTreatment(e.target.value)}
                  aria-label="Treatment required"
                  className={field}
                >
                  <option value="">What is the appointment for? (optional)</option>
                  <option value="General consultation">General consultation</option>
                  {services.map((service) => (
                    <option key={service.slug} value={service.title}>
                      {service.title}
                    </option>
                  ))}
                  <option value="Dental Plan enquiry">Dental Plan enquiry</option>
                  {/* A sub-treatment from the trigger is not in the list above */}
                  {treatment &&
                  !services.some((s) => s.title === treatment) &&
                  !["General consultation", "Dental Plan enquiry"].includes(treatment) ? (
                    <option value={treatment}>{treatment}</option>
                  ) : null}
                </select>

                <input
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Name"
                  aria-label="Your name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className={field}
                />
                <input
                  type="tel"
                  required
                  inputMode="tel"
                  autoComplete="tel"
                  pattern="[0-9+\s-]{8,15}"
                  placeholder="Mobile No"
                  aria-label="Your mobile number"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className={field}
                />
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="Email (optional)"
                  aria-label="Your email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className={field}
                />
              </div>

              {/* Honeypot */}
              <div
                aria-hidden="true"
                className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
              >
                <label htmlFor="bk-company">Company</label>
                <input
                  id="bk-company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.company}
                  onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                />
              </div>

              <Actions
                onBack={() => setStep(1)}
                submit
                busy={busy}
                nextLabel="Confirm Booking"
              />
            </form>
          ) : null}

          {/* 4 — done */}
          {step === 3 && booking ? (
            <div className="text-center">
              <span className="wl-confirm-tick mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-teal-50">
                <CheckCircle2 className="h-9 w-9 text-teal" aria-hidden="true" />
              </span>

              <div className="wl-confirm-stagger">
                <h3 className="mt-5 text-[21px] font-bold tracking-tight text-navy">
                  Your appointment is booked
                </h3>
                <p className="mx-auto mt-2 max-w-[400px] text-[14px] leading-relaxed text-muted">
                  Thank you{form.name ? `, ${form.name.split(" ")[0]}` : ""}. We have
                  reserved this slot for you and will call you on{" "}
                  <span className="font-semibold text-navy">{form.phone}</span> to
                  confirm.
                </p>

                <dl className="mx-auto mt-6 max-w-[380px] divide-y divide-line/70 rounded-xl border border-line bg-[#fafbfc] px-4 text-left">
                  <Row icon={MapPin} term="Clinic" value={booking.clinic} />
                  <Row icon={CalendarCheck} term="Date" value={formatDate(booking.date)} />
                  <Row icon={Clock} term="Time" value={booking.timeLabel} />
                  {treatment ? (
                    <Row icon={Stethoscope} term="For" value={treatment} />
                  ) : null}
                </dl>

                <div className="mt-6 flex flex-col justify-center gap-2.5 sm:flex-row">
                  <a
                    href={booking.phone ? `tel:${booking.phone}` : telHref}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-coral px-5 text-[14.5px] font-semibold text-white transition-colors hover:bg-coral-dark"
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    Call the clinic
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
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Row({ icon: Icon, term, value }) {
  return (
    <div className="flex items-center gap-3 py-2.5 text-[13.5px]">
      <Icon className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
      <dt className="w-[52px] shrink-0 text-muted">{term}</dt>
      <dd className="min-w-0 font-semibold text-navy">{value}</dd>
    </div>
  );
}

function Actions({ onBack, onNext, submit, nextDisabled, nextHint, nextLabel, busy }) {
  return (
    <>
      {nextHint ? (
        <p className="mt-5 text-center text-[12.5px] text-muted">{nextHint}</p>
      ) : null}

      <div className={`flex justify-center gap-3 ${nextHint ? "mt-2" : "mt-7"}`}>
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            disabled={busy}
            className="inline-flex h-12 items-center justify-center rounded-xl border border-line px-6 text-[14.5px] font-semibold text-navy transition-colors hover:border-brand hover:text-brand disabled:opacity-60"
          >
            Previous
          </button>
        ) : null}

        <button
          type={submit ? "submit" : "button"}
          onClick={submit ? undefined : onNext}
          disabled={nextDisabled || busy}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-deep px-7 text-[14.5px] font-semibold text-white transition-colors hover:bg-deep-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
          {busy ? "Booking…" : (nextLabel ?? "Next")}
        </button>
      </div>
    </>
  );
}
