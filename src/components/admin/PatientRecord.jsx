"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarClock,
  FilePlus2,
  MessageCircle,
  Pencil,
  Phone,
  Receipt,
  Stethoscope,
  StickyNote,
  Trash2,
} from "lucide-react";

import {
  digitsOnly,
  formatDate,
  formatDay,
  formatSlotTime,
  initialsOf,
  LeadDrawer,
  replyText,
  SOURCE_LABELS,
  STATUS_STYLES,
} from "@/components/admin/leadShared";
import {
  AddRecordsMenu,
  KIND_ICONS,
  RecordBody,
  recordTitle,
  VisitPrompt,
} from "@/components/admin/clinicalShared";
import InvoiceEditor from "@/components/admin/InvoiceEditor";
import RecordEditor from "@/components/admin/RecordEditor";
import { colourFor } from "@/lib/doctorColours";
import { invoiceTotals, rupees } from "@/lib/records";
import { todayKey } from "@/lib/leads";

/** "2026-08-22" → { day: "22", month: "AUG 26" } */
function stamp(date) {
  const parsed = date ? new Date(`${date}T00:00:00`) : null;
  if (!parsed || Number.isNaN(parsed.getTime())) return { day: "—", month: "" };
  return {
    day: String(parsed.getDate()).padStart(2, "0"),
    month: `${parsed.toLocaleDateString("en-IN", { month: "short" })} ${String(
      parsed.getFullYear()
    ).slice(2)}`.toUpperCase(),
  };
}

const TABS = [
  { value: "charting", label: "Charting" },
  { value: "billing", label: "Billing" },
];

/**
 * One patient's whole file.
 *
 * The spine is the visit: every appointment they booked, plus any visit typed
 * in afterwards. Charting hangs clinical records off those visits and Billing
 * hangs invoices off the same ones, so a bill and the treatment it is for are
 * never two unrelated entries — they are two views of one attendance.
 */
export default function PatientRecord({
  patient,
  siteName,
  doctorColours,
  doctors = [],
  treatments = [],
}) {
  const router = useRouter();

  const [tab, setTab] = useState("charting");
  const [active, setActive] = useState(null);
  const [pending, setPending] = useState("");

  // The "when did the patient visit happen?" step, for a visit with no booking.
  const [prompting, setPrompting] = useState(false);
  // { kind, record?, target } and { invoice?, target } — the two editors.
  const [editor, setEditor] = useState(null);
  const [bill, setBill] = useState(null);

  const phone = patient.id;
  const timeline = patient.timeline ?? [];

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

  /**
   * How the server should find this entry's visit. An existing visit by id, an
   * appointment that will open one on first use, or a bare date for a visit
   * that has neither yet.
   */
  const targetOf = (entry) => {
    if (entry.visitId) return { visitId: entry.visitId };
    if (entry.leadId) return { leadId: entry.leadId };
    return { date: entry.date, time: entry.time, doctor: entry.doctor };
  };

  const deleteRecord = async (record) => {
    if (!confirm("Delete this record? It cannot be brought back.")) return;
    try {
      const response = await fetch(
        `/api/admin/patients/${phone}/records/${record.id}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        alert(result.error ?? "Could not delete this record.");
        return;
      }
      router.refresh();
    } catch {
      alert("Network error. Please try again.");
    }
  };

  const closeAndRefresh = () => {
    setEditor(null);
    setBill(null);
    setPrompting(false);
    router.refresh();
  };

  const whatsapp = `https://wa.me/${digitsOnly(patient.phone)}?text=${encodeURIComponent(
    replyText(patient.history[0] ?? { name: patient.name }, siteName)
  )}`;

  // Drawn from the history rather than stored, so they can never fall behind it.
  const doctorsSeen = [...new Set(patient.history.map((l) => l.doctor).filter(Boolean))];
  const clinicsUsed = [...new Set(patient.history.map((l) => l.clinic).filter(Boolean))];
  const asked = [...new Set(patient.history.map((l) => l.treatment).filter(Boolean))];
  const remarks = patient.history.filter((lead) => lead.notes);
  const billed = patient.billed ?? { total: 0, paid: 0, balance: 0, count: 0 };

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

        {/* --------------------------------------------------- timeline */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex overflow-hidden rounded-[9px] border border-line bg-white">
              {TABS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTab(option.value)}
                  aria-pressed={tab === option.value}
                  className={`h-9 px-4 text-[13px] font-semibold transition-colors ${
                    tab === option.value
                      ? "bg-deep text-white"
                      : "text-muted hover:bg-brand-50 hover:text-brand"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setPrompting((current) => !current)}
              className="inline-flex h-9 items-center gap-2 rounded-[9px] border border-line bg-white px-3.5 text-[13px] font-semibold text-brand transition-colors hover:border-brand hover:bg-brand-50"
            >
              {tab === "charting" ? (
                <FilePlus2 className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Receipt className="h-4 w-4" aria-hidden="true" />
              )}
              {tab === "charting" ? "Create a new chart" : "Create a new bill"}
            </button>
          </div>

          {prompting ? (
            <div className="mt-3">
              <VisitPrompt
                today={todayKey()}
                doctors={doctors}
                action={tab === "charting" ? "records" : "bill"}
                onCancel={() => setPrompting(false)}
                onConfirm={(details, kind) => {
                  setPrompting(false);
                  if (tab === "charting") setEditor({ kind, target: details });
                  else setBill({ target: details });
                }}
              />
            </div>
          ) : null}

          {timeline.length === 0 ? (
            <p className="mt-3 rounded-[13px] border border-dashed border-line bg-white px-5 py-10 text-center text-[13.5px] leading-relaxed text-muted">
              Nothing on this patient&rsquo;s file yet. Start a chart or a bill above.
            </p>
          ) : (
            <ol className="relative mt-3 flex flex-col gap-3 pl-[46px]">
              {/* The thread down the left, so the entries read as one story. */}
              <span
                aria-hidden="true"
                className="absolute bottom-4 left-[17px] top-4 w-px bg-line"
              />

              {timeline.map((entry) => (
                <VisitCard
                  key={entry.key}
                  entry={entry}
                  tab={tab}
                  colours={doctorColours}
                  onOpenLead={setActive}
                  onAddRecord={(kind) =>
                    setEditor({ kind, target: targetOf(entry) })
                  }
                  onEditRecord={(record) =>
                    setEditor({ kind: record.kind, record, target: targetOf(entry) })
                  }
                  onDeleteRecord={deleteRecord}
                  onAddBill={() => setBill({ target: targetOf(entry) })}
                  onOpenBill={(invoice) =>
                    setBill({ invoice, target: targetOf(entry) })
                  }
                />
              ))}
            </ol>
          )}
        </div>

        {/* -------------------------------------------------- at a glance */}
        <aside className="flex flex-col gap-4">
          <div className="rounded-[14px] border border-line bg-white">
            <p className="border-b border-line px-4 py-3 text-[12px] font-bold uppercase tracking-[0.08em] text-muted">
              At a glance
            </p>

            <div className="grid grid-cols-3 divide-x divide-line border-b border-line text-center">
              <Tally label="Visits" value={timeline.length} />
              <Tally label="Records" value={patient.recordCount ?? 0} />
              <Tally label="Bookings" value={patient.appointments} />
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

          {billed.count ? (
            <div className="rounded-[14px] border border-line bg-white">
              <p className="border-b border-line px-4 py-3 text-[12px] font-bold uppercase tracking-[0.08em] text-muted">
                Account
              </p>
              <dl className="divide-y divide-line/70 px-4">
                <Row term={`Billed · ${billed.count}`}>{rupees(billed.total)}</Row>
                <Row term="Paid">{rupees(billed.paid)}</Row>
                <Row term="Balance">
                  <span
                    className={
                      billed.balance > 0 ? "font-bold text-coral-dark" : "text-teal"
                    }
                  >
                    {rupees(billed.balance)}
                  </span>
                </Row>
              </dl>
            </div>
          ) : null}

          {asked.length ? (
            <div className="rounded-[14px] border border-line bg-white">
              <p className="border-b border-line px-4 py-3 text-[12px] font-bold uppercase tracking-[0.08em] text-muted">
                Treatments asked about
              </p>
              <ul className="flex flex-col gap-2 p-4">
                {asked.map((treatment) => (
                  <li
                    key={treatment}
                    className="flex items-start gap-2 text-[13.5px] text-navy"
                  >
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
                No remarks yet. Open an appointment to add one.
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

      {editor ? (
        <RecordEditor
          phone={phone}
          kind={editor.kind}
          record={editor.record ?? null}
          target={editor.target}
          treatments={treatments}
          onClose={() => setEditor(null)}
          onSaved={closeAndRefresh}
        />
      ) : null}

      {bill ? (
        <InvoiceEditor
          phone={phone}
          invoice={bill.invoice ?? null}
          target={bill.target}
          treatments={treatments}
          patientName={patient.name}
          onClose={() => setBill(null)}
          onSaved={closeAndRefresh}
          onDeleted={closeAndRefresh}
        />
      ) : null}

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

/* ------------------------------------------------------------ visit card */

function VisitCard({
  entry,
  tab,
  colours,
  onOpenLead,
  onAddRecord,
  onEditRecord,
  onDeleteRecord,
  onAddBill,
  onOpenBill,
}) {
  const { day, month } = stamp(entry.date);
  const lead = entry.lead;

  return (
    <li className="relative">
      <span
        title={entry.doctor || "No doctor recorded"}
        className="absolute -left-[46px] top-3 inline-flex h-9 w-9 items-center justify-center rounded-full text-[11.5px] font-bold text-white ring-4 ring-[#f6f8fb]"
        style={{ backgroundColor: colourFor(colours, entry.doctor) }}
      >
        {initialsOf(entry.doctor)}
      </span>

      <div className="overflow-hidden rounded-[13px] border border-line bg-white">
        {/* --------------------------------------------------- card head */}
        <div className="flex flex-wrap items-start gap-3 p-4">
          <span className="flex w-[48px] shrink-0 flex-col items-center rounded-[10px] bg-[#f6f8fb] py-2">
            <span className="text-[17px] font-bold leading-none tabular-nums text-navy">
              {day}
            </span>
            <span className="mt-1 text-[10px] font-bold uppercase tracking-wide text-muted">
              {month}
            </span>
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              {lead ? (
                <button
                  type="button"
                  onClick={() => onOpenLead(lead)}
                  title="Open the appointment"
                  className="text-left text-[14.5px] font-semibold text-navy underline decoration-transparent decoration-2 underline-offset-4 transition-colors hover:text-brand hover:decoration-brand"
                >
                  {lead.slotDate
                    ? entry.doctor
                      ? `Appointment with ${entry.doctor}`
                      : "Appointment"
                    : lead.plan
                      ? `Enquiry about ${lead.plan}`
                      : "Enquiry"}
                </button>
              ) : (
                <span className="text-[14.5px] font-semibold text-navy">
                  {entry.doctor ? `Visit with ${entry.doctor}` : "Visit"}
                </span>
              )}

              {lead ? (
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${
                    STATUS_STYLES[lead.status] ?? STATUS_STYLES.new
                  }`}
                >
                  {lead.status}
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-[#f0f4f9] px-2 py-0.5 text-[11px] font-semibold text-muted">
                  Added at the desk
                </span>
              )}
            </div>

            <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[13px] text-muted">
              <span className="inline-flex items-center gap-1.5">
                <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
                {formatDay(entry.date) || "No date"}
                {entry.time ? ` at ${formatSlotTime(entry.time)}` : ""}
              </span>
              {entry.clinic ? <span>· {entry.clinic}</span> : null}
              {lead?.treatment ? <span>· {lead.treatment}</span> : null}
              {lead ? <span>· {SOURCE_LABELS[lead.source] ?? lead.source}</span> : null}
            </p>

            {lead?.notes ? (
              <span className="mt-2 inline-flex max-w-full items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-[12px] font-medium text-amber-800">
                <StickyNote className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{lead.notes}</span>
              </span>
            ) : null}

            {lead?.message ? (
              <p className="mt-2 rounded-[9px] bg-[#f6f8fb] px-3 py-2 text-[13px] leading-relaxed text-navy">
                {lead.message}
              </p>
            ) : null}
          </div>

          <div className="shrink-0">
            {tab === "charting" ? (
              <AddRecordsMenu subtle onPick={onAddRecord} />
            ) : (
              <button
                type="button"
                onClick={onAddBill}
                className="inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-line bg-white px-3 text-[12.5px] font-semibold text-brand transition-colors hover:border-brand hover:bg-brand-50"
              >
                <Receipt className="h-3.5 w-3.5" aria-hidden="true" />
                Add bill
              </button>
            )}
          </div>
        </div>

        {/* --------------------------------------------------- card body */}
        {tab === "charting" ? (
          entry.records.length === 0 ? (
            <Empty>No records added yet.</Empty>
          ) : (
            <ul className="divide-y divide-line/70 border-t border-line">
              {entry.records.map((record) => {
                const Icon = KIND_ICONS[record.kind];
                return (
                  <li key={record.id} className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                      <p className="min-w-0 flex-1 truncate text-[13px] font-bold text-navy">
                        {recordTitle(record)}
                      </p>
                      <IconButton
                        title="Edit"
                        icon={Pencil}
                        onClick={() => onEditRecord(record)}
                      />
                      <IconButton
                        title="Delete"
                        icon={Trash2}
                        danger
                        onClick={() => onDeleteRecord(record)}
                      />
                    </div>
                    <div className="mt-2">
                      <RecordBody record={record} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )
        ) : entry.invoices.length === 0 ? (
          <Empty>No invoices added yet.</Empty>
        ) : (
          <ul className="divide-y divide-line/70 border-t border-line">
            {entry.invoices.map((invoice) => {
              const totals = invoiceTotals(invoice);
              return (
                <li key={invoice.id}>
                  <button
                    type="button"
                    onClick={() => onOpenBill(invoice)}
                    className="flex w-full flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 text-left transition-colors hover:bg-brand-50/50"
                  >
                    <span className="text-[13px] font-bold text-navy">
                      {invoice.number}
                    </span>
                    <span className="text-[12.5px] text-muted">
                      {invoice.items.length}{" "}
                      {invoice.items.length === 1 ? "item" : "items"}
                    </span>
                    <span className="ml-auto flex items-center gap-4 text-[13px] tabular-nums">
                      <span className="font-semibold text-navy">
                        {rupees(totals.total)}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11.5px] font-semibold ${
                          totals.balance > 0
                            ? "bg-coral-50 text-coral-dark"
                            : "bg-teal-50 text-teal"
                        }`}
                      >
                        {totals.balance > 0
                          ? `${rupees(totals.balance)} due`
                          : "Paid"}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </li>
  );
}

/* ----------------------------------------------------------------- bits */

function Empty({ children }) {
  return (
    <p className="border-t border-line bg-[#fafbfc] px-4 py-4 text-center text-[13px] text-muted">
      {children}
    </p>
  );
}

function IconButton({ title, icon: Icon, onClick, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] text-muted transition-colors ${
        danger ? "hover:bg-coral-50 hover:text-coral-dark" : "hover:bg-brand-50 hover:text-brand"
      }`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      <span className="sr-only">{title}</span>
    </button>
  );
}

function Tally({ label, value }) {
  return (
    <div className="px-2 py-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.07em] text-muted">
        {label}
      </p>
      <p className="text-[20px] font-bold tabular-nums text-navy">{value}</p>
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
