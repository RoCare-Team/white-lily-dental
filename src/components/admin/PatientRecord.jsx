"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarClock,
  MessageCircle,
  Phone,
  Stethoscope,
  StickyNote,
} from "lucide-react";

import {
  digitsOnly,
  formatDate,
  formatDay,
  formatSlotTime,
  LeadDrawer,
  replyText,
  SOURCE_LABELS,
  STATUS_STYLES,
} from "@/components/admin/leadShared";

/** A colour per doctor, by name, so the same face keeps the same badge. */
const DOCTOR_COLOURS = ["#1668c7", "#0f8478", "#9a5c07", "#7b4fd0", "#c2544f"];

function doctorColour(name) {
  if (!name) return "#8fa2b5";
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return DOCTOR_COLOURS[hash % DOCTOR_COLOURS.length];
}

/** "Dr. Meenakshi Singh" → "MS". The "Dr." is not part of anyone's initials. */
function initialsOf(name) {
  const words = String(name ?? "")
    .replace(/^dr\.?\s+/i, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!words.length) return "—";
  return (words[0][0] + (words[1]?.[0] ?? "")).toUpperCase();
}

/** "2026-08-22" → { day: "22", month: "AUG 26" } */
function stamp(lead) {
  const source = lead.slotDate ? `${lead.slotDate}T00:00:00` : lead.createdAt;
  const date = source ? new Date(source) : null;
  if (!date || Number.isNaN(date.getTime())) return { day: "—", month: "" };
  return {
    day: String(date.getDate()).padStart(2, "0"),
    month: `${date.toLocaleDateString("en-IN", { month: "short" })} ${String(
      date.getFullYear()
    ).slice(2)}`.toUpperCase(),
  };
}

/**
 * One patient's whole file: who they are, and every appointment and message
 * they have ever sent, newest first. Each entry opens the same detail panel the
 * lead screens use, so there is only one place a lead is ever edited.
 */
export default function PatientRecord({ patient, siteName }) {
  const router = useRouter();
  const [active, setActive] = useState(null);
  const [pending, setPending] = useState("");

  const patchLead = async (id, changes) => {
    setPending(id);
    try {
      const response = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        alert(result.error ?? "Could not update this record.");
        return false;
      }

      setActive((current) => (current?.id === id ? result.lead : current));
      router.refresh();
      return true;
    } catch {
      alert("Network error. Please try again.");
      return false;
    } finally {
      setPending("");
    }
  };

  const whatsapp = `https://wa.me/${digitsOnly(patient.phone)}?text=${encodeURIComponent(
    replyText(patient.history[0], siteName)
  )}`;

  // Drawn from the history rather than stored, so they can never fall behind it.
  const doctorsSeen = [...new Set(patient.history.map((l) => l.doctor).filter(Boolean))];
  const clinicsUsed = [...new Set(patient.history.map((l) => l.clinic).filter(Boolean))];
  const treatments = [...new Set(patient.history.map((l) => l.treatment).filter(Boolean))];
  const remarks = patient.history.filter((lead) => lead.notes);

  return (
    <>
      {/* ------------------------------------------------------ profile */}
      <div className="rounded-[14px] border border-line bg-white p-5">
        <div className="flex flex-wrap items-start gap-4">
          <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#f0f4f9] text-[20px] font-bold text-navy">
            {(patient.name || "?").charAt(0).toUpperCase()}
          </span>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[22px] font-bold tracking-tight text-navy">
              {patient.name}
            </h1>

            <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13.5px] text-muted">
              <span className="inline-flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                {patient.phone}
              </span>
              {patient.email ? <span>{patient.email}</span> : null}
              {patient.firstSeen ? (
                <span>First contact {formatDate(patient.firstSeen)}</span>
              ) : null}
            </p>
          </div>

          <div className="flex shrink-0 gap-2">
            <a
              href={`tel:${patient.phone}`}
              className="inline-flex h-10 items-center gap-2 rounded-[10px] bg-coral px-4 text-[14px] font-semibold text-white transition-colors hover:bg-coral-dark"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              Call
            </a>
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              title="Opens WhatsApp with a reply already written"
              className="inline-flex h-10 items-center gap-2 rounded-[10px] bg-whatsapp px-4 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 2xl:grid-cols-[minmax(0,1fr)_284px]">

        {/* ---------------------------------------------------- history */}
        <div className="min-w-0">
          <h2 className="text-[12px] font-bold uppercase tracking-[0.08em] text-muted">
            History · {patient.visits}
          </h2>

          <ol className="relative mt-3 flex flex-col gap-3 pl-[46px]">
            {/* The thread down the left, so the entries read as one story. */}
            <span
              aria-hidden="true"
              className="absolute bottom-4 left-[17px] top-4 w-px bg-line"
            />

            {patient.history.map((lead) => {
              const { day, month } = stamp(lead);
              return (
                <li key={lead.id} className="relative">
                  <span
                    title={lead.doctor || "No doctor recorded"}
                    className="absolute -left-[46px] top-3 inline-flex h-9 w-9 items-center justify-center rounded-full text-[11.5px] font-bold text-white ring-4 ring-[#f6f8fb]"
                    style={{ backgroundColor: doctorColour(lead.doctor) }}
                  >
                    {initialsOf(lead.doctor)}
                  </span>

                  <button
                    type="button"
                    onClick={() => setActive(lead)}
                    className="flex w-full items-start gap-4 rounded-[13px] border border-line bg-white p-4 text-left outline-none transition-colors hover:border-brand focus-visible:ring-2 focus-visible:ring-brand/30"
                  >
                    <span className="flex w-[48px] shrink-0 flex-col items-center rounded-[10px] bg-[#f6f8fb] py-2">
                      <span className="text-[17px] font-bold leading-none tabular-nums text-navy">
                        {day}
                      </span>
                      <span className="mt-1 text-[10px] font-bold uppercase tracking-wide text-muted">
                        {month}
                      </span>
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="text-[14.5px] font-semibold text-navy">
                          {lead.slotDate
                            ? lead.doctor
                              ? `Appointment with ${lead.doctor}`
                              : "Appointment"
                            : lead.plan
                              ? `Enquiry about ${lead.plan}`
                              : "Enquiry"}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${
                            STATUS_STYLES[lead.status] ?? STATUS_STYLES.new
                          }`}
                        >
                          {lead.status}
                        </span>
                      </span>

                      <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[13px] text-muted">
                        {lead.slotDate ? (
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
                            {formatDay(lead.slotDate)} at {formatSlotTime(lead.slotTime)}
                          </span>
                        ) : (
                          <span>Sent {formatDate(lead.createdAt)}</span>
                        )}
                        {lead.clinic ? <span>· {lead.clinic}</span> : null}
                        {lead.treatment ? <span>· {lead.treatment}</span> : null}
                        <span>· {SOURCE_LABELS[lead.source] ?? lead.source}</span>
                      </span>

                      {lead.notes ? (
                        <span className="mt-2 inline-flex max-w-full items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-[12px] font-medium text-amber-800">
                          <StickyNote className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                          <span className="truncate">{lead.notes}</span>
                        </span>
                      ) : null}


                      {lead.message ? (
                        <span className="mt-3 block rounded-[9px] bg-[#f6f8fb] px-3 py-2 text-[13px] leading-relaxed text-navy">
                          {lead.message}
                        </span>
                      ) : null}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        {/* -------------------------------------------------- at a glance */}
        <aside className="flex flex-col gap-4">
          <div className="rounded-[14px] border border-line bg-white">
            <p className="border-b border-line px-4 py-3 text-[12px] font-bold uppercase tracking-[0.08em] text-muted">
              At a glance
            </p>

            <div className="grid grid-cols-2 divide-x divide-line border-b border-line text-center">
              <Tally label="Records" value={patient.visits} tone="text-navy" />
              <Tally label="Appointments" value={patient.appointments} tone="text-navy" />
            </div>

            <dl className="divide-y divide-line/70 px-4">
              <Row term="Next appointment">
                {patient.nextSlot ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2 py-0.5 text-[12.5px] font-semibold text-teal">
                    <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
                    {formatDay(patient.nextSlot)}
                  </span>
                ) : (
                  "None booked"
                )}
              </Row>
              <Row term="Last visit">
                {patient.lastSlot ? formatDay(patient.lastSlot) : "—"}
              </Row>
              <Row term="Doctors seen">
                {doctorsSeen.length ? doctorsSeen.join(", ") : "—"}
              </Row>
              <Row term="Clinics">{clinicsUsed.length ? clinicsUsed.join(", ") : "—"}</Row>
            </dl>
          </div>

          {treatments.length ? (
            <div className="rounded-[14px] border border-line bg-white">
              <p className="border-b border-line px-4 py-3 text-[12px] font-bold uppercase tracking-[0.08em] text-muted">
                Treatments asked about
              </p>
              <ul className="flex flex-col gap-2 p-4">
                {treatments.map((treatment) => (
                  <li key={treatment} className="flex items-start gap-2 text-[13.5px] text-navy">
                    <Stethoscope
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted"
                      aria-hidden="true"
                    />
                    {treatment}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="rounded-[14px] border border-line bg-white">
            <p className="border-b border-line px-4 py-3 text-[12px] font-bold uppercase tracking-[0.08em] text-muted">
              Remarks
            </p>

            {remarks.length === 0 ? (
              <p className="px-4 py-6 text-center text-[13px] leading-relaxed text-muted">
                No remarks yet. Open an entry to add one.
              </p>
            ) : (
              <ul className="divide-y divide-line/70">
                {remarks.map((lead) => (
                  <li key={lead.id} className="px-4 py-3">
                    <p className="text-[11.5px] font-semibold uppercase tracking-wide text-muted">
                      {lead.slotDate ? formatDay(lead.slotDate) : formatDate(lead.createdAt)}
                    </p>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-navy">
                      {lead.notes}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>

      {active ? (
        <LeadDrawer
          lead={active}
          siteName={siteName}
          busy={pending === active.id}
          onClose={() => setActive(null)}
          onStatus={(status) => patchLead(active.id, { status })}
          onSaveNotes={(notes) => patchLead(active.id, { notes })}
          onCancelBooking={() => {
            if (
              !confirm(
                "Cancel this appointment? The slot goes back on sale immediately and another patient can book it."
              )
            )
              return;
            patchLead(active.id, { status: "cancelled" });
          }}
          onRestoreBooking={() => patchLead(active.id, { status: "new" })}
        />
      ) : null}
    </>
  );
}

function Tally({ label, value, tone }) {
  return (
    <div className="px-2 py-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.07em] text-muted">
        {label}
      </p>
      <p className={`text-[20px] font-bold tabular-nums ${tone}`}>{value}</p>
    </div>
  );
}

function Row({ term, children }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2.5">
      <dt className="shrink-0 text-[13px] text-muted">{term}</dt>
      <dd className="min-w-0 text-right text-[13.5px] font-medium text-navy">
        {children}
      </dd>
    </div>
  );
}
