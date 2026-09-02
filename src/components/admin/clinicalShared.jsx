"use client";

import { useEffect, useRef, useState } from "react";
import {
  Activity,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  FlaskConical,
  FileText,
  Loader2,
  Paperclip,
  Pill,
  Stethoscope,
  X,
} from "lucide-react";

import { formatSlotTime } from "@/components/admin/leadShared";
import {
  lineTotal,
  RECORD_KINDS,
  RECORD_LABELS,
  rowsTotal,
  rupees,
} from "@/lib/records";

/**
 * The furniture the charting and billing screens share: the modal shell, the
 * "when did the patient visit happen?" step, the add-records menu, and the
 * read-only rendering of a saved record.
 */

export const fieldClass =
  "h-10 w-full rounded-[9px] border border-line bg-white px-3 text-[13.5px] text-navy outline-none transition-colors placeholder:text-muted/60 focus:border-brand focus:ring-2 focus:ring-brand/15";

export const areaClass =
  "w-full resize-y rounded-[9px] border border-line bg-white px-3 py-2 text-[13.5px] leading-relaxed text-navy outline-none transition-colors placeholder:text-muted/60 focus:border-brand focus:ring-2 focus:ring-brand/15";

export const labelClass =
  "mb-1.5 block text-[11px] font-bold uppercase tracking-[0.07em] text-muted";

export const KIND_ICONS = {
  vitals: Activity,
  note: FileText,
  prescription: Pill,
  file: Paperclip,
  "lab-order": FlaskConical,
  "treatment-plan": ClipboardList,
  procedures: Stethoscope,
};

/** Every quarter hour a clinic could plausibly see someone. */
const TIME_OPTIONS = (() => {
  const times = [];
  for (let minutes = 8 * 60; minutes <= 21 * 60 + 45; minutes += 15) {
    const value = `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(
      minutes % 60
    ).padStart(2, "0")}`;
    times.push({ value, label: formatSlotTime(value) });
  }
  return times;
})();

export function Labelled({ label, hint, children, className = "" }) {
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

/**
 * The one modal shell. Header, a body that scrolls, and a footer that does not
 * — so a long prescription never pushes Save off the bottom of the screen.
 */
export function Modal({
  title,
  subtitle,
  icon: Icon,
  busy,
  error,
  onClose,
  footer,
  width = "max-w-[720px]",
  children,
}) {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape" && !busy) onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [busy, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={() => (busy ? null : onClose())}
        className="absolute inset-0 bg-navy/45 backdrop-blur-[2px]"
      />

      <div
        className={`relative flex max-h-[94dvh] w-full ${width} flex-col overflow-hidden rounded-t-[18px] bg-white shadow-2xl sm:max-h-[90dvh] sm:rounded-[16px]`}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            {Icon ? (
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand">
                <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
            ) : null}
            <div className="min-w-0">
              <h2 className="truncate text-[17px] font-bold tracking-tight text-navy">
                {title}
              </h2>
              {subtitle ? (
                <p className="truncate text-[12.5px] text-muted">{subtitle}</p>
              ) : null}
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

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>

        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-line bg-[#fafbfc] px-5 py-3.5">
          <p role={error ? "alert" : undefined} className="min-w-0 flex-1 text-[12.5px] font-medium text-coral-dark">
            {error}
          </p>
          <div className="flex shrink-0 items-center gap-2">{footer}</div>
        </div>
      </div>
    </div>
  );
}

export function GhostButton({ children, ...props }) {
  return (
    <button
      type="button"
      {...props}
      className="inline-flex h-9 items-center gap-2 rounded-[9px] border border-line bg-white px-4 text-[13px] font-semibold text-muted transition-colors hover:border-brand hover:text-brand disabled:opacity-50"
    >
      {children}
    </button>
  );
}

export function PrimaryButton({ busy, children, ...props }) {
  return (
    <button
      type="button"
      {...props}
      disabled={busy || props.disabled}
      className="inline-flex h-9 items-center gap-2 rounded-[9px] bg-brand px-4 text-[13px] font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
    >
      {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
      {children}
    </button>
  );
}

/* ------------------------------------------------------------ visit step */

/**
 * "When did the patient visit happen?" — the date, time and doctor a new chart
 * or bill is filed under. Existing appointments already answer all three, so
 * this only appears for a visit being written down after the fact.
 */
export function VisitPrompt({ today, doctors = [], action, onCancel, onConfirm }) {
  const [date, setDate] = useState(today);
  const [time, setTime] = useState("12:00");
  const [doctor, setDoctor] = useState(doctors[0] ?? "");

  return (
    <div className="rounded-[13px] border border-line bg-white p-4 shadow-sm">
      <p className="text-[14px] font-bold text-navy">
        When did the patient visit happen?
      </p>

      <div className="mt-3.5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_150px]">
        <Labelled label="Visit date">
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className={fieldClass}
          />
        </Labelled>

        <Labelled label="At">
          <select
            value={time}
            onChange={(event) => setTime(event.target.value)}
            className={fieldClass}
          >
            {TIME_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Labelled>
      </div>

      <Labelled label="Doctor" className="mt-3">
        <select
          value={doctor}
          onChange={(event) => setDoctor(event.target.value)}
          className={fieldClass}
        >
          <option value="">Not recorded</option>
          {doctors.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </Labelled>

      <div className="mt-4 flex items-center justify-end gap-2 border-t border-line pt-3.5">
        <GhostButton onClick={onCancel}>Cancel</GhostButton>
        {action === "records" ? (
          <AddRecordsMenu
            label="Add records"
            onPick={(kind) => onConfirm({ date, time, doctor }, kind)}
          />
        ) : (
          <PrimaryButton onClick={() => onConfirm({ date, time, doctor })}>
            Add bill
          </PrimaryButton>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ menu */

/** The Add records dropdown: one item per kind of record. */
export function AddRecordsMenu({ label = "Add records", onPick, subtle }) {
  const [open, setOpen] = useState(false);
  const box = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (event) => {
      if (!box.current?.contains(event.target)) setOpen(false);
    };
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className={
          subtle
            ? "inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-line bg-white px-3 text-[12.5px] font-semibold text-brand transition-colors hover:border-brand hover:bg-brand-50"
            : "inline-flex h-9 items-center gap-2 rounded-[9px] bg-brand px-4 text-[13px] font-semibold text-white transition-colors hover:bg-brand-dark"
        }
      >
        {label}
        <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
      </button>

      {open ? (
        <div className="absolute right-0 z-30 mt-1.5 w-[212px] overflow-hidden rounded-[11px] border border-line bg-white py-1 shadow-xl">
          {RECORD_KINDS.map((kind) => {
            const Icon = KIND_ICONS[kind.value];
            return (
              <button
                key={kind.value}
                type="button"
                onClick={() => {
                  setOpen(false);
                  onPick(kind.value);
                }}
                className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-[13px] font-medium text-navy transition-colors hover:bg-brand-50 hover:text-brand"
              >
                <Icon className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                {kind.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

/* --------------------------------------------------------- record bodies */

const VITALS_ROWS = [
  ["bp", "Blood pressure"],
  ["pulse", "Pulse"],
  ["temperature", "Temperature"],
  ["weight", "Weight"],
  ["height", "Height"],
];

const NOTE_ROWS = [
  ["complaint", "Chief complaint"],
  ["observation", "Observations"],
  ["diagnosis", "Diagnosis"],
  ["notes", "Notes"],
];

const LAB_ROWS = [
  ["lab", "Laboratory"],
  ["work", "Work sent"],
  ["sentOn", "Sent on"],
  ["expectedOn", "Expected"],
  ["notes", "Notes"],
];

/** One saved record, drawn the way that kind of record reads best. */
export function RecordBody({ record }) {
  const { kind, data } = record;

  if (kind === "vitals") {
    const chips = VITALS_ROWS.filter(([key]) => data[key]);
    return (
      <>
        {chips.length ? (
          <div className="flex flex-wrap gap-1.5">
            {chips.map(([key, label]) => (
              <span
                key={key}
                className="inline-flex items-baseline gap-1.5 rounded-full bg-[#f6f8fb] px-2.5 py-1 text-[12.5px] text-muted"
              >
                {label}
                <span className="font-semibold text-navy">{data[key]}</span>
              </span>
            ))}
          </div>
        ) : null}
        {data.notes ? <Paragraph>{data.notes}</Paragraph> : null}
      </>
    );
  }

  if (kind === "note" || kind === "lab-order") {
    const rows = (kind === "note" ? NOTE_ROWS : LAB_ROWS).filter(([key]) => data[key]);
    return (
      <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
        {rows.map(([key, label]) => (
          <div key={key} className={key === "notes" ? "sm:col-span-2" : ""}>
            <dt className="text-[11px] font-bold uppercase tracking-[0.06em] text-muted">
              {label}
            </dt>
            <dd className="mt-0.5 whitespace-pre-wrap text-[13.5px] leading-relaxed text-navy">
              {data[key]}
            </dd>
          </div>
        ))}
      </dl>
    );
  }

  if (kind === "prescription") {
    return (
      <Table
        head={["Medicine", "Dosage", "Frequency", "Duration", "Instructions"]}
        rows={(data.items ?? []).map((item) => [
          item.medicine,
          item.dosage,
          item.frequency,
          item.duration,
          item.instructions,
        ])}
      />
    );
  }

  if (kind === "treatment-plan" || kind === "procedures") {
    const items = data.items ?? [];
    const priced = kind === "treatment-plan";
    return (
      <>
        <Table
          head={
            priced
              ? ["Procedure", "Tooth", "Cost", "Discount", "Total"]
              : ["Procedure", "Tooth", "Notes", "Cost"]
          }
          align={priced ? [0, 0, 1, 1, 1] : [0, 0, 0, 1]}
          rows={items.map((item) =>
            priced
              ? [
                  item.procedure,
                  item.tooth,
                  rupees(item.cost),
                  item.discount ? rupees(item.discount) : "—",
                  rupees(lineTotal(item)),
                ]
              : [item.procedure, item.tooth, item.notes, rupees(item.cost)]
          )}
        />
        {items.length ? (
          <p className="mt-2 text-right text-[13px] font-bold text-navy">
            Total {rupees(rowsTotal(items))}
          </p>
        ) : null}
      </>
    );
  }

  if (kind === "file") {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block overflow-hidden rounded-[9px] border border-line"
        >
          {/* A plain img: these are patient uploads of unknown size served from
              GridFS, not layout-critical site imagery. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.url}
            alt={data.label || "Patient file"}
            className="h-24 w-auto max-w-[220px] object-cover"
          />
        </a>
        <div className="min-w-0">
          <p className="text-[13.5px] font-semibold text-navy">
            {data.label || "Untitled file"}
          </p>
          {data.notes ? (
            <p className="mt-0.5 text-[13px] leading-relaxed text-muted">{data.notes}</p>
          ) : null}
        </div>
      </div>
    );
  }

  return null;
}

export function recordTitle(record) {
  return RECORD_LABELS[record.kind] ?? "Record";
}

function Paragraph({ children }) {
  return (
    <p className="mt-2 whitespace-pre-wrap text-[13.5px] leading-relaxed text-navy">
      {children}
    </p>
  );
}

/** A small data table. `align` marks which columns are right-aligned. */
function Table({ head, rows, align = [] }) {
  if (!rows.length) return null;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[420px] border-collapse text-[13px]">
        <thead>
          <tr>
            {head.map((name, index) => (
              <th
                key={name}
                className={`border-b border-line pb-1.5 text-[11px] font-bold uppercase tracking-[0.06em] text-muted ${
                  align[index] ? "text-right" : "text-left"
                }`}
              >
                {name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-line/60 last:border-b-0">
              {row.map((cell, index) => (
                <td
                  key={index}
                  className={`py-1.5 pr-3 text-navy last:pr-0 ${
                    align[index] ? "text-right tabular-nums" : "text-left"
                  }`}
                >
                  {cell || "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export { CalendarDays };
