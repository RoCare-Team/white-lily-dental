"use client";

/**
 * Pieces shared by every screen that shows a lead: the list boards and the
 * appointment calendar. They were local to LeadsBoard until the calendar
 * needed the same detail panel, formatting and status colours.
 */

import { useEffect, useReducer, useState } from "react";
import Link from "next/link";
import {
  CalendarX,
  Copy,
  Loader2,
  Mail,
  MessageCircle,
  ChevronRight,
  Phone,
  RotateCcw,
  X,
} from "lucide-react";

export const STATUS_STYLES = {
  new: "bg-brand-100 text-brand-dark",
  contacted: "bg-amber-100 text-amber-800",
  booked: "bg-teal-50 text-teal",
  complete: "bg-teal text-white",
  closed: "bg-slate-100 text-muted",
  cancelled: "bg-coral-50 text-coral-dark",
  spam: "bg-coral-50 text-coral-dark",
};

export const SOURCE_LABELS = {
  "appointment-form": "Appointment form",
  "service-enquiry": "Service page",
  "booking-wizard": "Booking wizard",
  "plan-enquiry": "Dental plan",
};

export function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** "2026-08-20" → "20 Aug 2026" */
export function formatDay(key) {
  if (!key) return "";
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** "14:30" → "2:30 PM" */
export function formatSlotTime(time) {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  const period = h < 12 ? "AM" : "PM";
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")} ${period}`;
}

/**
 * A first reply, already written. Staff open WhatsApp with this in the box and
 * either send it or edit it — nobody retypes what the patient already told us.
 */
export function replyText(lead, siteName) {
  const first = String(lead.name || "").trim().split(" ")[0];
  const about =
    lead.plan ||
    (lead.slotDate
      ? `your appointment on ${formatDay(lead.slotDate)} at ${formatSlotTime(lead.slotTime)}`
      : lead.treatment) ||
    "your enquiry";

  return [
    `Hello${first ? " " + first : ""}, this is ${siteName}.`,
    lead.slotDate
      ? `We are confirming ${about} at ${lead.clinic}.`
      : `Thank you for your enquiry about ${about}.`,
    "How can we help you further?",
  ].join(" ");
}

/** "Dr. Meenakshi Singh" → "MS". The "Dr." is not part of anyone's initials. */
export function initialsOf(name) {
  const words = String(name ?? "")
    .replace(/^dr\.?\s+/i, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!words.length) return "—";
  return (words[0][0] + (words[1]?.[0] ?? "")).toUpperCase();
}

/**
 * The full detail list for one lead, in reading order. Shared so the drawer and
 * the patient's file can never drift into showing different things.
 */
export function leadRows(lead) {
  return [
    ["Phone", lead.phone],
    ["Email", lead.email || "—"],
    ["Preferred clinic", lead.clinic || "—"],
    [
      "Booked slot",
      lead.slotDate
        ? `${formatDay(lead.slotDate)} at ${formatSlotTime(lead.slotTime)}`
        : "Not a slot booking",
    ],
    ["Treatment", lead.treatment || "—"],
    ["Requested doctor", lead.doctor || "Any available"],
    ["Dental plan", lead.plan || "—"],
    ["Submitted from", lead.pageUrl || "—"],
    ["Preferred date", lead.preferredDate || "—"],
    ["Source", SOURCE_LABELS[lead.source] ?? lead.source ?? "—"],
    ["Received", formatDate(lead.createdAt)],
  ];
}

/** Everything about a lead as plain text, for pasting elsewhere. */
export function leadAsText(lead) {
  return [
    `Name: ${lead.name}`,
    `Phone: ${lead.phone}`,
    lead.email ? `Email: ${lead.email}` : null,
    lead.clinic ? `Clinic: ${lead.clinic}` : null,
    lead.slotDate
      ? `Appointment: ${formatDay(lead.slotDate)} at ${formatSlotTime(lead.slotTime)}`
      : null,
    lead.treatment ? `Treatment: ${lead.treatment}` : null,
    lead.doctor ? `Doctor: ${lead.doctor}` : null,
    lead.plan ? `Package: ${lead.plan}` : null,
    lead.message ? `Message: ${lead.message}` : null,
    `Received: ${formatDate(lead.createdAt)}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function digitsOnly(phone) {
  const digits = String(phone ?? "").replace(/\D/g, "");
  // Indian numbers are usually typed without the country code.
  return digits.length === 10 ? `91${digits}` : digits;
}

/** The statuses a receptionist reaches for during a call. */
export const QUICK_STATUSES = [
  { value: "contacted", label: "Contacted" },
  { value: "booked", label: "Booked" },
  { value: "complete", label: "Complete" },
  { value: "closed", label: "Closed" },
  { value: "spam", label: "Spam" },
];

/** Puts the lead on the clipboard, with a fallback for insecure origins. */
export async function copyLead(lead) {
  const text = leadAsText(lead);
  try {
    await navigator.clipboard.writeText(text);
    alert("Lead details copied.");
  } catch {
    window.prompt("Copy the details below:", text);
  }
}

export function IconLink({ href, title, icon: Icon, external }) {
  return (
    <a
      href={href}
      title={title}
      onClick={(event) => event.stopPropagation()}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-brand-50 hover:text-brand"
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      <span className="sr-only">{title}</span>
    </a>
  );
}

/** The anchored panel's geometry. */
const POPOVER_MARGIN = 16;
const POPOVER_GAP = 8;
const POPOVER_WIDTH = 344;

/**
 * How short the panel may get before it is lifted instead. Below this it stops
 * being readable, so the panel moves up; above it, the panel shortens and
 * scrolls inside — which keeps it level with what was clicked.
 */
const POPOVER_MIN_HEIGHT = 300;

/**
 * Where to put the panel when it was opened from a particular element.
 *
 * The rule is "stay beside what was clicked". On a wide screen that means to
 * the right of it, flipped to the left when the window edge is close. On a
 * narrow one there is no beside, so it sits directly under the element instead
 * — still at the thing you tapped, never adrift in the middle of the screen.
 *
 * Worked out during render from the live rect, so it follows the element while
 * the calendar scrolls.
 */
function popoverPosition(anchorEl) {
  if (!anchorEl || typeof window === "undefined") return null;

  const rect = anchorEl.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const narrow = vw < 720;

  const width = narrow
    ? Math.min(420, vw - POPOVER_MARGIN * 2)
    : POPOVER_WIDTH;

  let left;
  if (narrow) {
    left = rect.left + rect.width / 2 - width / 2;
  } else {
    left = rect.right + POPOVER_GAP;
    if (left + width > vw - POPOVER_MARGIN) {
      left = rect.left - width - POPOVER_GAP;
    }
  }
  left = Math.min(Math.max(POPOVER_MARGIN, left), vw - POPOVER_MARGIN - width);

  // Level with the element (or just below it on a narrow screen), lifted only
  // as far as it must be to keep a usable height on screen.
  const lowest = Math.max(POPOVER_MARGIN, vh - POPOVER_MARGIN - POPOVER_MIN_HEIGHT);
  let top = narrow ? rect.bottom + POPOVER_GAP : rect.top - 8;
  top = Math.max(POPOVER_MARGIN, Math.min(top, lowest));

  // Whatever is left below that point — so the panel always stops short of the
  // window edge and scrolls its own content instead.
  const maxHeight = vh - top - POPOVER_MARGIN;

  return { top, left, width, maxHeight };
}

export function LeadDrawer({
  lead,
  anchorEl,
  siteName,
  busy,
  onClose,
  onSaveNotes,
  onStatus,
  onCancelBooking,
  onRestoreBooking,
}) {
  const [notes, setNotes] = useState(lead.notes ?? "");

  // Opening a different lead swaps the notes; done during render so the
  // previous lead's notes are never shown against the new one.
  const [lastLead, setLastLead] = useState(lead);
  if (lastLead !== lead) {
    setLastLead(lead);
    setNotes(lead.notes ?? "");
  }

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  /* Re-render on scroll and resize so an anchored panel keeps up with the
     element it belongs to. The position itself is worked out during render. */
  const [, reposition] = useReducer((n) => n + 1, 0);
  useEffect(() => {
    if (!anchorEl) return undefined;
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    return () => {
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
  }, [anchorEl]);

  const at = popoverPosition(anchorEl);
  const rows = leadRows(lead);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Enquiry from ${lead.name}`}
      className={
        at
          ? "fixed inset-0 z-50"
          : "fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
      }
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-navy/40 backdrop-blur-[2px]"
      />

      <div
        className={
          at
            ? "absolute flex flex-col overflow-hidden rounded-[14px] border border-line bg-white shadow-2xl"
            : "relative flex max-h-[92dvh] w-full max-w-[560px] flex-col overflow-hidden rounded-t-[18px] bg-white shadow-2xl sm:max-h-[88dvh] sm:rounded-[16px]"
        }
        style={at ?? undefined}
      >
        {/* Header and footer stay put; only the detail between them scrolls. */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div className="min-w-0">
            {/* The name opens the patient's whole file — every appointment and
                message from this phone number, not just this one. */}
            {lead.phoneDigits ? (
              <Link
                href={`/admin/patients/${lead.phoneDigits}`}
                title="Open this patient's full history"
                className="group inline-flex max-w-full items-center gap-1.5 outline-none"
              >
                <h2 className="truncate text-[18px] font-bold text-navy underline decoration-line decoration-2 underline-offset-4 transition-colors group-hover:text-brand group-hover:decoration-brand group-focus-visible:text-brand">
                  {lead.name}
                </h2>
                <ChevronRight
                  className="h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand"
                  aria-hidden="true"
                />
              </Link>
            ) : (
              <h2 className="truncate text-[18px] font-bold text-navy">{lead.name}</h2>
            )}
            <p className="text-[13px] text-muted">{formatDate(lead.createdAt)}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-brand-50 hover:text-brand"
          >
            <X className="h-4.5 w-4.5" aria-hidden="true" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5" style={{ scrollbarWidth: "thin" }}>
          <div className="flex gap-2">
            <a
              href={`tel:${lead.phone}`}
              className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-[10px] bg-coral text-[14px] font-semibold text-white transition-colors hover:bg-coral-dark"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              Call
            </a>
            <a
              href={`https://wa.me/${digitsOnly(lead.phone)}?text=${encodeURIComponent(
                replyText(lead, siteName)
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Opens WhatsApp with a reply already written"
              className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-[10px] bg-whatsapp text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              WhatsApp
            </a>
            {lead.email ? (
              <a
                href={`mailto:${lead.email}`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-line text-muted transition-colors hover:border-brand hover:text-brand"
                title={`Email ${lead.email}`}
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Email patient</span>
              </a>
            ) : null}
          </div>

          {/* One tap for the statuses staff actually use, so nobody hunts
              through the dropdown mid-call. */}
          <div className="mt-5">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-muted">
              Mark as
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {QUICK_STATUSES.map((option) => {
                const current = lead.status === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    disabled={busy || current}
                    onClick={() => onStatus(option.value)}
                    className={`inline-flex h-9 items-center rounded-full border px-3.5 text-[13px] font-semibold transition-colors disabled:cursor-default ${
                      current
                        ? `border-transparent ${STATUS_STYLES[option.value]}`
                        : "border-line bg-white text-navy hover:border-brand hover:text-brand"
                    }`}
                  >
                    {current ? "✓ " : ""}
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => copyLead(lead)}
            className="mt-4 inline-flex h-9 items-center gap-2 rounded-[9px] border border-line px-3 text-[13px] font-semibold text-muted transition-colors hover:border-brand hover:text-brand"
          >
            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
            Copy all details
          </button>

          <dl className="mt-5 divide-y divide-line/70 border-y border-line/70">
            {rows.map(([term, value]) => (
              <div key={term} className="flex gap-4 py-2.5 text-[14px]">
                <dt className="w-[130px] shrink-0 text-muted">{term}</dt>
                <dd className="min-w-0 break-words font-medium text-navy">{value}</dd>
              </div>
            ))}
          </dl>

          {lead.message ? (
            <div className="mt-5">
              <p className="text-[13px] font-semibold text-muted">Patient message</p>
              <p className="mt-1.5 whitespace-pre-wrap rounded-[10px] bg-[#f5f7fa] p-3.5 text-[14px] leading-relaxed text-navy">
                {lead.message}
              </p>
            </div>
          ) : null}

          <div className="mt-6">
            <label
              htmlFor="lead-notes"
              className="text-[13px] font-semibold text-muted"
            >
              Remark
            </label>
            <textarea
              id="lead-notes"
              rows={4}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Call outcome, follow-up date, quoted price…"
              className="mt-1.5 w-full rounded-[10px] border border-line bg-white px-3.5 py-2.5 text-[14px] leading-relaxed text-navy outline-none transition-colors placeholder:text-muted/70 focus:border-brand focus:ring-2 focus:ring-brand/15"
            />
            <button
              type="button"
              disabled={busy || notes === (lead.notes ?? "")}
              onClick={() => onSaveNotes(notes)}
              className="mt-2 inline-flex h-10 items-center justify-center gap-2 rounded-[10px] bg-deep px-5 text-[14px] font-semibold text-white transition-colors hover:bg-deep-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : null}
              Save remark
            </button>
          </div>

          {lead.slotDate ? (
            <div className="mt-7 border-t border-line pt-5">
              {lead.status === "cancelled" ? (
                <>
                  <p className="flex items-start gap-2 rounded-[10px] border border-coral/30 bg-coral-50 p-3 text-[13px] leading-relaxed text-navy">
                    <CalendarX
                      className="mt-0.5 h-4 w-4 shrink-0 text-coral-dark"
                      aria-hidden="true"
                    />
                    This appointment is cancelled. The {formatSlotTime(lead.slotTime)}{" "}
                    slot on {formatDay(lead.slotDate)} is bookable again.
                  </p>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={onRestoreBooking}
                    className="mt-2.5 inline-flex h-10 items-center justify-center gap-2 rounded-[10px] border border-line px-4 text-[14px] font-semibold text-navy transition-colors hover:border-brand hover:text-brand disabled:opacity-50"
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                    Restore appointment
                  </button>
                  <p className="mt-2 text-[12px] leading-relaxed text-muted">
                    Restoring only works if nobody has taken the slot since.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-[13px] leading-relaxed text-muted">
                    Patient cannot make it? Cancelling frees the{" "}
                    {formatSlotTime(lead.slotTime)} slot on{" "}
                    {formatDay(lead.slotDate)} so another patient can book it.
                  </p>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={onCancelBooking}
                    className="mt-2.5 inline-flex h-10 items-center justify-center gap-2 rounded-[10px] border border-coral/40 bg-coral-50 px-4 text-[14px] font-semibold text-coral-dark transition-colors hover:bg-coral hover:text-white disabled:opacity-50"
                  >
                    {busy ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <CalendarX className="h-4 w-4" aria-hidden="true" />
                    )}
                    Cancel appointment
                  </button>
                </>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

