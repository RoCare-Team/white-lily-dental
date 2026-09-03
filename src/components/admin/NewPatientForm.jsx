"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  Check,
  Loader2,
  Stethoscope,
  UserPlus,
  X,
} from "lucide-react";

import { formatDay } from "@/components/admin/leadShared";
import { todayKey } from "@/lib/leads";

/**
 * "Add patient" — the form behind the calendar's primary button.
 *
 * Two things happen at a dental desk: someone walks in and is given a time, or
 * someone rings and is written down to be called back. Both are the same
 * record, so this is one form with the appointment half switched off rather
 * than two screens. Nothing is required except a name and a number, because
 * that is all the person at the desk reliably has.
 */

const field =
  "h-10 w-full rounded-[9px] border border-line bg-white px-3 text-[13.5px] text-navy outline-none transition-colors placeholder:text-muted/60 focus:border-brand focus:ring-2 focus:ring-brand/15";

const labelClass =
  "mb-1.5 block text-[11px] font-bold uppercase tracking-[0.07em] text-muted";

const EMPTY = {
  name: "",
  phone: "",
  email: "",
  doctor: "",
  treatment: "",
  message: "",
};

function Field({ label, hint, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className={labelClass}>
        {label}
        {hint ? (
          <span className="ml-1.5 font-medium normal-case tracking-normal text-muted/70">
            {hint}
          </span>
        ) : null}
      </span>
      {children}
    </label>
  );
}

export default function NewPatientForm({
  open,
  onClose,
  onSaved,
  clinics = [],
  doctors = [],
  treatments = [],
  defaults = {},
}) {
  const [form, setForm] = useState(EMPTY);
  const [booking, setBooking] = useState(true);
  const [clinicId, setClinicId] = useState("");
  const [date, setDate] = useState("");
  const [slotTime, setSlotTime] = useState("");

  // The rows are kept with the key they were fetched for, so "which day is on
  // screen" is derived rather than cleared by hand on every change.
  const [slotData, setSlotData] = useState({ key: "", slots: [] });
  const [reload, setReload] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");

  const firstInput = useRef(null);

  /* Opening the form resets it and takes whatever the calendar already knows:
     the clinic being filtered on, and the day — or the exact half hour — that
     was clicked on the grid. Half the form is filled in before it is seen. */
  const [wasOpen, setWasOpen] = useState(false);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setForm({ ...EMPTY, doctor: defaults.doctor || "" });
      setError("");
      setDone("");
      setSlotData({ key: "", slots: [] });
      setBooking(true);
      setClinicId(defaults.clinicId || (clinics.length === 1 ? clinics[0].id : ""));
      setDate(defaults.date || todayKey());
      setSlotTime(defaults.time || "");
    }
  }

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape" && !busy) onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, busy, onClose]);

  useEffect(() => {
    if (open) firstInput.current?.focus();
  }, [open]);

  /* The day's times, with the ones already held marked. This is the staff
     endpoint, so it shows the whole day — including times the website would
     refuse to offer because they are an hour away or already past. */
  const slotsKey =
    open && booking && clinicId && date ? `${clinicId}|${date}|${reload}` : "";

  // Anything the form is not currently asking for is simply not rendered, and
  // a key that has not arrived yet is what "loading" means.
  const slots = slotsKey && slotData.key === slotsKey ? slotData.slots : [];
  const loadingSlots = Boolean(slotsKey) && slotData.key !== slotsKey;

  useEffect(() => {
    if (!slotsKey) return undefined;

    let cancelled = false;

    fetch(`/api/admin/appointments?clinic=${encodeURIComponent(clinicId)}&date=${date}`)
      .then((response) => response.json())
      .then((data) => {
        if (!cancelled) {
          setSlotData({
            key: slotsKey,
            slots: Array.isArray(data.slots) ? data.slots : [],
          });
        }
      })
      .catch(() => {
        if (!cancelled) setSlotData({ key: slotsKey, slots: [] });
      });

    return () => {
      cancelled = true;
    };
  }, [slotsKey, clinicId, date]);

  if (!open) return null;

  const set = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
    setError("");
  };

  const submit = async (event) => {
    event.preventDefault();
    if (busy) return;

    if (booking && !clinicId) {
      setError("Choose which clinic the patient is coming to.");
      return;
    }
    if (booking && !slotTime) {
      setError("Pick a time, or switch the appointment off to save the patient only.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/admin/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          clinicId: booking ? clinicId : "",
          slotDate: booking ? date : "",
          slotTime: booking ? slotTime : "",
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error ?? "Could not save this patient.");
        // A clash means the day changed under us — show it as it now stands.
        if (data.code === "slot_taken") {
          setSlotTime("");
          setReload((n) => n + 1);
        }
        return;
      }

      setDone(
        booking
          ? `${data.lead.name} booked for ${formatDay(date)}.`
          : `${data.lead.name} added, awaiting a time.`
      );
      onSaved?.(data.lead);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const free = slots.filter((slot) => !slot.takenBy).length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Add a patient"
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={() => (busy ? null : onClose())}
        className="absolute inset-0 bg-navy/45 backdrop-blur-[2px]"
      />

      <form
        onSubmit={submit}
        className="relative flex max-h-[94dvh] w-full max-w-[680px] flex-col overflow-hidden rounded-t-[18px] bg-white shadow-2xl sm:max-h-[90dvh] sm:rounded-[16px]"
      >
        {/* ------------------------------------------------------- header */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand">
              <UserPlus className="h-[18px] w-[18px]" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h2 className="text-[17px] font-bold tracking-tight text-navy">
                Add a patient
              </h2>
              <p className="truncate text-[12.5px] text-muted">
                Walk-ins, and bookings taken over the phone.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            title="Close"
            className="-mr-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] text-muted transition-colors hover:bg-[#f4f7fa] hover:text-navy disabled:opacity-50"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        {/* --------------------------------------------------------- body */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <div className="grid gap-3.5 sm:grid-cols-2">
            <Field label="Patient name">
              <input
                ref={firstInput}
                value={form.name}
                onChange={set("name")}
                required
                autoComplete="off"
                placeholder="Full name"
                className={field}
              />
            </Field>

            <Field label="Mobile number">
              <input
                value={form.phone}
                onChange={set("phone")}
                required
                inputMode="tel"
                autoComplete="off"
                placeholder="+91 98765 43210"
                className={field}
              />
            </Field>

            <Field label="Email" hint="optional">
              <input
                value={form.email}
                onChange={set("email")}
                type="email"
                autoComplete="off"
                placeholder="name@example.com"
                className={field}
              />
            </Field>

            <Field label="Treatment" hint="optional">
              <input
                value={form.treatment}
                onChange={set("treatment")}
                list="wl-treatments"
                autoComplete="off"
                placeholder="Reason for the visit"
                className={field}
              />
              <datalist id="wl-treatments">
                {treatments.map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
            </Field>

            <Field label="Doctor" hint="optional" className="sm:col-span-2">
              <div className="flex flex-wrap gap-1.5">
                <Chip
                  active={!form.doctor}
                  onClick={() => setForm((current) => ({ ...current, doctor: "" }))}
                >
                  Any available
                </Chip>
                {doctors.map((doctor) => (
                  <Chip
                    key={doctor.name}
                    active={form.doctor === doctor.name}
                    dot={doctor.colour}
                    onClick={() =>
                      setForm((current) => ({ ...current, doctor: doctor.name }))
                    }
                  >
                    {doctor.name}
                  </Chip>
                ))}
              </div>
            </Field>
          </div>

          {/* ------------------------------------------------ appointment */}
          <div className="mt-5 rounded-[12px] border border-line">
            <div className="flex items-center justify-between gap-3 border-b border-line px-3.5 py-2.5">
              <p className="flex items-center gap-2 text-[13px] font-bold text-navy">
                <CalendarDays className="h-4 w-4 text-muted" aria-hidden="true" />
                Appointment
              </p>

              {/* Off means "written down, no time yet" — the strip above the
                  grid, not a lost record. */}
              <label className="flex cursor-pointer select-none items-center gap-2 text-[12.5px] font-semibold text-muted">
                Book a time now
                <span className="relative inline-flex">
                  <input
                    type="checkbox"
                    checked={booking}
                    onChange={(event) => {
                      setBooking(event.target.checked);
                      setError("");
                    }}
                    className="peer sr-only"
                  />
                  <span className="block h-5 w-9 rounded-full bg-[#dbe3ec] transition-colors peer-checked:bg-brand peer-focus-visible:ring-2 peer-focus-visible:ring-brand/30" />
                  <span className="pointer-events-none absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
                </span>
              </label>
            </div>

            {booking ? (
              <div className="px-3.5 py-3.5">
                <div className="grid gap-3.5 sm:grid-cols-[minmax(0,1fr)_162px]">
                  <Field label="Clinic">
                    <div className="flex flex-wrap gap-1.5">
                      {clinics.map((clinic) => (
                        <Chip
                          key={clinic.id}
                          active={clinicId === clinic.id}
                          onClick={() => {
                            setClinicId(clinic.id);
                            setSlotTime("");
                            setError("");
                          }}
                        >
                          {clinic.name}
                        </Chip>
                      ))}
                    </div>
                  </Field>

                  <Field label="Date">
                    <input
                      type="date"
                      value={date}
                      onChange={(event) => {
                        setDate(event.target.value);
                        setSlotTime("");
                        setError("");
                      }}
                      className={field}
                    />
                  </Field>
                </div>

                <div className="mt-3.5">
                  <p className={labelClass}>
                    Time
                    {clinicId && date && !loadingSlots && slots.length ? (
                      <span className="ml-1.5 font-medium normal-case tracking-normal text-muted/70">
                        {free} free
                      </span>
                    ) : null}
                  </p>

                  {!clinicId ? (
                    <Hint>Choose a clinic to see its times.</Hint>
                  ) : loadingSlots ? (
                    <Hint>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                      Loading times…
                    </Hint>
                  ) : slots.length === 0 ? (
                    <Hint>This clinic has no times on that date.</Hint>
                  ) : (
                    <div className="grid max-h-[168px] grid-cols-3 gap-1.5 overflow-y-auto pr-0.5 sm:grid-cols-5">
                      {slots.map((slot) => {
                        const taken = Boolean(slot.takenBy);
                        const active = slotTime === slot.time;
                        return (
                          <button
                            key={slot.time}
                            type="button"
                            disabled={taken}
                            title={taken ? `Booked — ${slot.takenBy}` : slot.label}
                            onClick={() => {
                              setSlotTime(slot.time);
                              setError("");
                            }}
                            className={`h-9 rounded-[8px] border text-[12.5px] font-semibold tabular-nums transition-colors ${
                              taken
                                ? "cursor-not-allowed border-line bg-[#f6f8fb] text-muted/50 line-through"
                                : active
                                  ? "border-brand bg-brand text-white"
                                  : "border-line bg-white text-navy hover:border-brand hover:text-brand"
                            }`}
                          >
                            {slot.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="flex items-start gap-2 px-3.5 py-3.5 text-[12.5px] leading-relaxed text-muted">
                <Stethoscope className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                Saved without a time. They sit on the &ldquo;Awaiting a time&rdquo;
                strip above the calendar until one is given.
              </p>
            )}
          </div>

          <Field label="Note" hint="optional" className="mt-4">
            <textarea
              value={form.message}
              onChange={set("message")}
              rows={2}
              placeholder="Anything the doctor should know before the visit."
              className="w-full resize-y rounded-[9px] border border-line bg-white px-3 py-2 text-[13.5px] leading-relaxed text-navy outline-none transition-colors placeholder:text-muted/60 focus:border-brand focus:ring-2 focus:ring-brand/15"
            />
          </Field>
        </div>

        {/* ------------------------------------------------------- footer */}
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-line bg-[#fafbfc] px-5 py-3.5">
          <p
            role={error ? "alert" : undefined}
            className="min-w-0 flex-1 text-[12.5px] font-medium"
          >
            {error ? (
              <span className="flex items-start gap-1.5 text-coral-dark">
                <AlertCircle className="mt-px h-4 w-4 shrink-0" aria-hidden="true" />
                {error}
              </span>
            ) : done ? (
              <span className="flex items-center gap-1.5 text-teal">
                <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
                {done}
              </span>
            ) : null}
          </p>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="inline-flex h-9 items-center rounded-[9px] border border-line bg-white px-4 text-[13px] font-semibold text-muted transition-colors hover:border-brand hover:text-brand disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="inline-flex h-9 items-center gap-2 rounded-[9px] bg-brand px-4 text-[13px] font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Check className="h-4 w-4" aria-hidden="true" />
              )}
              {booking ? "Save appointment" : "Save patient"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

/* ----------------------------------------------------------------- bits */

function Chip({ active, dot, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex max-w-full items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${
        active
          ? "border-brand bg-brand-50 text-brand"
          : "border-line bg-white text-navy hover:border-brand hover:text-brand"
      }`}
    >
      {dot ? (
        <span
          aria-hidden="true"
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: dot }}
        />
      ) : null}
      <span className="truncate">{children}</span>
    </button>
  );
}

function Hint({ children }) {
  return (
    <p className="flex items-center gap-2 rounded-[9px] border border-dashed border-line px-3 py-3 text-[12.5px] text-muted">
      {children}
    </p>
  );
}
