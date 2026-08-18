"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CalendarX,
  Copy,
  Download,
  Inbox,
  RotateCcw,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  Search,
  StickyNote,
  Trash2,
  X,
} from "lucide-react";

import { LEAD_STATUSES } from "@/lib/leads";

const STATUS_STYLES = {
  new: "bg-brand-100 text-brand-dark",
  contacted: "bg-amber-100 text-amber-800",
  booked: "bg-teal-50 text-teal",
  complete: "bg-teal text-white",
  closed: "bg-slate-100 text-muted",
  cancelled: "bg-coral-50 text-coral-dark",
  spam: "bg-coral-50 text-coral-dark",
};

const SOURCE_LABELS = {
  "appointment-form": "Appointment form",
  "service-enquiry": "Service page",
  "booking-wizard": "Booking wizard",
  "plan-enquiry": "Dental plan",
};

function formatDate(iso) {
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
function formatDay(key) {
  if (!key) return "";
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** "14:30" → "2:30 PM" */
function formatSlotTime(time) {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  const period = h < 12 ? "AM" : "PM";
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")} ${period}`;
}

/**
 * A first reply, already written. Staff open WhatsApp with this in the box and
 * either send it or edit it — nobody retypes what the patient already told us.
 */
function replyText(lead, siteName) {
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

/** Everything about a lead as plain text, for pasting elsewhere. */
function leadAsText(lead) {
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

function digitsOnly(phone) {
  const digits = String(phone ?? "").replace(/\D/g, "");
  // Indian numbers are usually typed without the country code.
  return digits.length === 10 ? `91${digits}` : digits;
}

/** The statuses a receptionist reaches for during a call. */
const QUICK_STATUSES = [
  { value: "contacted", label: "Contacted" },
  { value: "booked", label: "Booked" },
  { value: "complete", label: "Complete" },
  { value: "closed", label: "Closed" },
  { value: "spam", label: "Spam" },
];

/** Puts the lead on the clipboard, with a fallback for insecure origins. */
async function copyLead(lead) {
  const text = leadAsText(lead);
  try {
    await navigator.clipboard.writeText(text);
    alert("Lead details copied.");
  } catch {
    window.prompt("Copy the details below:", text);
  }
}

/**
 * The appointments screen holds two kinds of request: slots reserved through
 * the booking wizard, and "Request appointment" forms from a treatment page
 * that have no time yet. "All" is the default so neither is ever hidden.
 */
/** "Complete" is never on an inbox — completing a lead is what moves it away. */
const INBOX_STATUSES = LEAD_STATUSES.filter((s) => s.value !== "complete");

/** Which inbox a client's lead originally came from. */
const TYPE_FILTERS = [
  { value: "", label: "Everything" },
  { value: "appointment", label: "Appointments" },
  { value: "contact", label: "Contact" },
  { value: "plan", label: "Packages" },
];

const WHEN_FILTERS = [
  { value: "all", label: "All" },
  { value: "today", label: "Today" },
  { value: "upcoming", label: "Upcoming" },
  { value: "past", label: "Past" },
  { value: "noslot", label: "Awaiting slot" },
];

export default function LeadsBoard({
  initialData,
  initialFilters,
  kind = "contact",
  basePath = "/admin/leads",
  siteName = "White Lily Dental",
}) {
  // Clients takes its bucket from ?type, so the same board can show one
  // inbox's finished leads or all of them at once.
  const isClients = kind === "clients";
  const type = isClients ? initialFilters.type || "" : kind;
  const isAppointments = type === "appointment";
  const isPlans = type === "plan";
  const router = useRouter();
  const searchParams = useSearchParams();

  const [leads, setLeads] = useState(initialData.leads);
  const [search, setSearch] = useState(initialFilters.q);
  const [active, setActive] = useState(null);
  const [pending, setPending] = useState("");
  // Says where a lead just went, because a status change makes it leave the list.
  const [notice, setNotice] = useState("");
  // The lead whose remark is being written in the small dialog, if any.
  const [remarkFor, setRemarkFor] = useState(null);
  const firstRender = useRef(true);

  // The server sends fresh rows on every navigation — adopt them during
  // render, so the previous page's rows never flash on screen.
  const [lastData, setLastData] = useState(initialData);
  if (lastData !== initialData) {
    setLastData(initialData);
    setLeads(initialData.leads);
  }

  const status = initialFilters.status;

  const pushQuery = (changes) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    // Any filter change invalidates the current page number.
    if (!("page" in changes)) params.delete("page");
    router.push(`${basePath}${params.size ? `?${params}` : ""}`);
  };

  // Debounce the search box so typing does not fire a query per keystroke.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      if (search !== initialFilters.q) pushQuery({ q: search });
    }, 400);
    return () => clearTimeout(timer);
    // Deliberately keyed on `search` alone: including pushQuery would rebuild
    // the timer on every render and the debounce would never elapse. Each
    // keystroke re-runs this with a fresh closure, so nothing goes stale.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const totals = useMemo(() => {
    const counts = initialData.counts ?? {};
    const all = Object.values(counts).reduce((sum, n) => sum + n, 0);
    return { all, ...counts };
  }, [initialData.counts]);

  /* Opening the screen clears its badge, the way an inbox tab does. The rows
     keep their "new" dots for this visit — the page was already rendered — so
     staff can still see which ones arrived since last time. */
  const seenSignature = leads.filter((l) => !l.seenAt).length;
  useEffect(() => {
    // Clients holds leads that have already been dealt with — no badge to clear.
    if (isClients || !seenSignature) return;

    const badgeKey =
      kind === "appointment" ? "appointments" : kind === "plan" ? "packages" : "contact";

    document.dispatchEvent(new CustomEvent("wl:leads-seen", { detail: badgeKey }));

    fetch("/api/admin/leads/seen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind }),
    }).catch(() => {
      /* A failed read-receipt is not worth interrupting anyone for. */
    });
  }, [seenSignature, kind, isClients]);

  const patchLead = async (id, changes) => {
    setPending(id);
    try {
      const response = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        alert(data.error ?? "Could not update this enquiry.");
        return false;
      }

      // Completing a lead sends it to Clients, and un-completing it sends it
      // back. Drop it from this list straight away rather than leaving behind a
      // row that now belongs on the other screen.
      const movesOut = changes.status
        ? isClients
          ? changes.status !== "complete"
          : changes.status === "complete"
        : false;

      if (movesOut) {
        setLeads((rows) => rows.filter((row) => row.id !== id));
        setActive((current) => (current?.id === id ? null : current));
        setNotice(
          `${data.lead.name || "Lead"} moved to ${
            changes.status === "complete" ? "Clients" : "its inbox"
          }.`
        );
        setTimeout(() => setNotice(""), 5000);
      } else {
        setLeads((rows) => rows.map((row) => (row.id === id ? data.lead : row)));
        setActive((current) => (current?.id === id ? data.lead : current));
      }
      // Refresh so the status counts above the table stay accurate.
      router.refresh();
      return true;
    } catch {
      alert("Network error. Please try again.");
      return false;
    } finally {
      setPending("");
    }
  };

  /* Keeps the dialog open when the save fails, so nothing typed is lost. */
  const saveRemark = async (notes) => {
    if (!remarkFor) return;
    const saved = await patchLead(remarkFor.id, { notes });
    if (saved) setRemarkFor(null);
  };

  const removeLead = async (id) => {
    if (!confirm("Delete this enquiry permanently? This cannot be undone.")) return;

    setPending(id);
    try {
      const response = await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        alert(data.error ?? "Could not delete this enquiry.");
        return;
      }
      setLeads((rows) => rows.filter((row) => row.id !== id));
      setActive((current) => (current?.id === id ? null : current));
      router.refresh();
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setPending("");
    }
  };

  const exportHref = `/api/admin/leads/export?${new URLSearchParams(
    Object.fromEntries(
      Object.entries({
        kind,
        status,
        q: initialFilters.q,
        when: isAppointments ? initialFilters.when : "",
        type: isClients ? type : "",
      }).filter(([, v]) => v)
    )
  )}`;

  return (
    <>
      {/* Clients is filtered by where the lead came from — every row on it is
          Complete, so a status filter would have nothing to narrow. The inboxes
          are the other way round. */}
      {isClients ? (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {TYPE_FILTERS.map((option) => (
            <FilterChip
              key={option.value || "all"}
              label={option.label}
              active={type === option.value}
              onClick={() => pushQuery({ type: option.value, when: "" })}
            />
          ))}
        </div>
      ) : (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <FilterChip
            label="All"
            count={totals.all}
            active={!status}
            onClick={() => pushQuery({ status: "" })}
          />
          {INBOX_STATUSES.map((option) => (
            <FilterChip
              key={option.value}
              label={option.label}
              count={totals[option.value] ?? 0}
              active={status === option.value}
              onClick={() => pushQuery({ status: option.value })}
            />
          ))}
        </div>
      )}

      {isAppointments ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {WHEN_FILTERS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => pushQuery({ when: option.value })}
              aria-pressed={initialFilters.when === option.value}
              className={`inline-flex h-8 items-center rounded-full border px-3.5 text-[13px] font-semibold transition-colors ${
                initialFilters.when === option.value
                  ? "border-brand bg-brand-50 text-brand"
                  : "border-line bg-white text-muted hover:border-brand hover:text-brand"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}

      {/* Search + export */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, phone, email or treatment"
            aria-label="Search requests"
            className="h-11 w-full rounded-[10px] border border-line bg-white pl-10 pr-3.5 text-[14.5px] text-navy outline-none transition-colors placeholder:text-muted/70 focus:border-brand focus:ring-2 focus:ring-brand/15"
          />
        </div>

        <a
          href={exportHref}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-[10px] border border-line bg-white px-4 text-[13.5px] font-semibold text-navy transition-colors hover:border-brand hover:text-brand"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Export CSV
        </a>
      </div>

      {notice ? (
        <p
          role="status"
          className="mt-4 rounded-[10px] border border-teal/30 bg-teal-50 px-4 py-2.5 text-[13.5px] font-medium text-navy"
        >
          {notice}
        </p>
      ) : null}

      {/* Table */}
      <div className="mt-5 overflow-hidden rounded-[14px] border border-line bg-white">
        {leads.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <Inbox className="h-8 w-8 text-muted/60" aria-hidden="true" />
            <p className="text-[15px] font-semibold text-navy">
              {isClients
                ? "No clients yet"
                : isAppointments
                  ? "No appointment requests found"
                  : isPlans
                    ? "No package requests found"
                    : "No messages found"}
            </p>
            <p className="max-w-[380px] text-[13.5px] leading-relaxed text-muted">
              {status || initialFilters.q
                ? "Try clearing the filters or the search box."
                : isClients
                  ? "Mark a lead as Complete and it moves here."
                  : isAppointments
                    ? "Appointment requests from the website stay here until you mark them Complete."
                    : isPlans
                      ? "Dental plan enquiries stay here until you mark them Complete."
                      : "Contact page messages stay here until you mark them Complete."}
            </p>
          </div>
        ) : (
          <>
          {/* Phones get cards — an 820px table on a 390px screen is a
              side-scroll nobody discovers. */}
          <ul className="divide-y divide-line/70 md:hidden">
            {leads.map((lead) => (
              <li key={lead.id}>
                <button
                  type="button"
                  onClick={() => setActive(lead)}
                  className={`flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-brand-50/50 ${
                    lead.status === "cancelled" ? "opacity-55" : ""
                  }`}
                >
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      {!lead.seenAt ? (
                        <span
                          title="Not yet opened"
                          className="inline-block h-2 w-2 shrink-0 rounded-full bg-coral"
                        />
                      ) : null}
                      <span
                        className={`truncate text-[14.5px] text-navy ${
                          lead.seenAt ? "font-semibold" : "font-bold"
                        }`}
                      >
                        {lead.name}
                      </span>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${
                          STATUS_STYLES[lead.status] ?? STATUS_STYLES.new
                        }`}
                      >
                        {lead.status}
                      </span>
                    </span>

                    <span className="mt-0.5 block text-[13px] text-muted">
                      {lead.phone}
                    </span>

                    <span className="mt-1.5 block text-[13px] text-navy">
                      {isPlans
                        ? lead.plan || "—"
                        : lead.treatment || lead.plan || "—"}
                      {lead.doctor ? (
                        <span className="text-muted"> · {lead.doctor}</span>
                      ) : null}
                    </span>

                    <span className="mt-1 block text-[12.5px] text-muted">
                      {lead.slotDate
                        ? `${formatDay(lead.slotDate)} · ${formatSlotTime(lead.slotTime)}`
                        : formatDate(lead.createdAt)}
                      {lead.clinic ? ` · ${lead.clinic}` : ""}
                    </span>

                    {lead.notes ? (
                      <span className="mt-1.5 inline-flex max-w-full items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-[12px] font-medium text-amber-800">
                        <StickyNote className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span className="truncate">{lead.notes}</span>
                      </span>
                    ) : null}
                  </span>

                  <span className="flex shrink-0 gap-1">
                    <IconLink
                      href={`tel:${lead.phone}`}
                      title={`Call ${lead.name}`}
                      icon={Phone}
                    />
                    <IconLink
                      href={`https://wa.me/${digitsOnly(lead.phone)}?text=${encodeURIComponent(
                        replyText(lead, siteName)
                      )}`}
                      title={`WhatsApp ${lead.name}`}
                      icon={MessageCircle}
                      external
                    />
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[960px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line bg-[#fafbfc] text-[12px] font-semibold uppercase tracking-wide text-muted">
                  <th className="px-4 py-3">
                    {isClients ? "When" : isAppointments ? "Appointment" : "Received"}
                  </th>
                  <th className="px-4 py-3">Patient</th>
                  <th className="px-4 py-3">{isPlans ? "Plan" : "Treatment"}</th>
                  <th className="px-4 py-3">Clinic</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Remark</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => setActive(lead)}
                    className={`cursor-pointer border-b border-line/70 text-[14px] transition-colors last:border-0 hover:bg-brand-50/60 ${
                      lead.status === "cancelled" ? "opacity-55" : ""
                    }`}
                  >
                    <td className="whitespace-nowrap px-4 py-3.5">
                      {!lead.slotDate && isAppointments ? (
                        <>
                          <span className="block font-semibold text-navy">
                            No slot chosen
                          </span>
                          <span className="block text-[13px] text-muted">
                            {formatDate(lead.createdAt)}
                          </span>
                        </>
                      ) : lead.slotDate ? (
                        <>
                          <span className="block font-semibold text-navy">
                            {formatDay(lead.slotDate)}
                          </span>
                          <span
                            className={`block text-[13px] ${
                              lead.status === "cancelled"
                                ? "text-coral-dark line-through"
                                : "text-teal"
                            }`}
                          >
                            {formatSlotTime(lead.slotTime)}
                          </span>
                        </>
                      ) : (
                        <span className="text-muted">{formatDate(lead.createdAt)}</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="flex items-center gap-2">
                        {/* Unread marker — clears the moment the row is opened */}
                        {!lead.seenAt ? (
                          <span
                            title="Not yet opened"
                            className="inline-block h-2 w-2 shrink-0 rounded-full bg-coral"
                          />
                        ) : null}
                        <span
                          className={`text-navy ${
                            lead.seenAt ? "font-semibold" : "font-bold"
                          }`}
                        >
                          {lead.name}
                        </span>
                      </span>
                      <span className="block text-[13px] text-muted">{lead.phone}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="block font-medium text-navy">
                        {isPlans ? lead.plan || "—" : lead.treatment || lead.plan || "—"}
                      </span>
                      {lead.doctor ? (
                        <span className="block text-[13px] text-muted">
                          for {lead.doctor}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="block text-muted">{lead.clinic || "—"}</span>
                      {lead.slotDate && !isAppointments && !isClients ? (
                        <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-[12px] font-semibold text-teal">
                          {formatDay(lead.slotDate)} · {formatSlotTime(lead.slotTime)}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3.5">
                      <select
                        value={lead.status}
                        disabled={pending === lead.id}
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) =>
                          patchLead(lead.id, { status: event.target.value })
                        }
                        aria-label={`Status for ${lead.name}`}
                        className={`h-8 cursor-pointer rounded-full border-0 px-3 text-[12.5px] font-semibold outline-none focus:ring-2 focus:ring-brand/30 ${
                          STATUS_STYLES[lead.status] ?? STATUS_STYLES.new
                        }`}
                      >
                        {LEAD_STATUSES.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3.5">
                      {/* Opens the small remark dialog rather than the full
                          drawer — writing one line should not be a detour. */}
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setRemarkFor(lead);
                        }}
                        title={lead.notes || "Add a remark"}
                        className={`inline-flex max-w-[220px] items-center gap-1.5 rounded-full px-2.5 py-1 text-left text-[12.5px] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-brand/30 ${
                          lead.notes
                            ? "bg-amber-100 font-medium text-amber-800 hover:bg-amber-200"
                            : "border border-dashed border-line font-semibold text-muted hover:border-brand hover:text-brand"
                        }`}
                      >
                        <StickyNote className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span className="truncate">
                          {lead.notes || "Add remark"}
                        </span>
                      </button>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <IconLink
                          href={`tel:${lead.phone}`}
                          title={`Call ${lead.name}`}
                          icon={Phone}
                        />
                        <IconLink
                          href={`https://wa.me/${digitsOnly(lead.phone)}?text=${encodeURIComponent(
                            replyText(lead, siteName)
                          )}`}
                          title={`WhatsApp ${lead.name}`}
                          icon={MessageCircle}
                          external
                        />
                        <button
                          type="button"
                          title="Delete enquiry"
                          disabled={pending === lead.id}
                          onClick={(event) => {
                            event.stopPropagation();
                            removeLead(lead.id);
                          }}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-coral-50 hover:text-coral-dark disabled:opacity-50"
                        >
                          {pending === lead.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                          ) : (
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          )}
                          <span className="sr-only">Delete enquiry</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {initialData.pageCount > 1 ? (
        <div className="mt-5 flex items-center justify-between gap-4">
          <p className="text-[13px] text-muted">
            Page {initialData.page} of {initialData.pageCount} · {initialData.total}{" "}
            enquir{initialData.total === 1 ? "y" : "ies"}
          </p>
          <div className="flex gap-2">
            <PageButton
              disabled={initialData.page <= 1}
              onClick={() => pushQuery({ page: String(initialData.page - 1) })}
            >
              Previous
            </PageButton>
            <PageButton
              disabled={initialData.page >= initialData.pageCount}
              onClick={() => pushQuery({ page: String(initialData.page + 1) })}
            >
              Next
            </PageButton>
          </div>
        </div>
      ) : null}

      {remarkFor ? (
        <RemarkDialog
          lead={remarkFor}
          busy={pending === remarkFor?.id}
          onClose={() => setRemarkFor(null)}
          onSave={saveRemark}
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

/**
 * A one-field dialog for the remark, opened straight from the list. Deliberately
 * separate from the lead drawer: adding a line after a phone call is the most
 * common thing staff do, and it should not mean opening the whole record.
 */
function RemarkDialog({ lead, busy, onClose, onSave }) {
  const [text, setText] = useState(lead.notes ?? "");

  // Opening a different lead swaps the text, during render, so the previous
  // lead's remark is never shown against the new one.
  const [lastId, setLastId] = useState(lead.id);
  if (lastId !== lead.id) {
    setLastId(lead.id);
    setText(lead.notes ?? "");
  }

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Remark for ${lead.name || "lead"}`}
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-navy/50 backdrop-blur-[2px]"
      />

      <div className="relative w-full max-w-[520px] rounded-[16px] border border-line bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-[16px] font-bold tracking-tight text-navy">Remark</h2>
            <p className="mt-0.5 truncate text-[13px] text-muted">
              {lead.name || "Lead"}
              {lead.phone ? ` · ${lead.phone}` : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-[#f0f4f9] hover:text-navy"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        <textarea
          autoFocus
          rows={4}
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Call outcome, follow-up date, quoted price…"
          className="mt-4 w-full rounded-[10px] border border-line bg-white px-3.5 py-2.5 text-[14px] leading-relaxed text-navy outline-none transition-colors placeholder:text-muted/70 focus:border-brand focus:ring-2 focus:ring-brand/15"
        />

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 items-center justify-center rounded-[10px] border border-line px-4 text-[14px] font-semibold text-muted transition-colors hover:border-brand hover:text-brand"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={busy || text === (lead.notes ?? "")}
            onClick={() => onSave(text)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-[10px] bg-deep px-5 text-[14px] font-semibold text-white transition-colors hover:bg-deep-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : null}
            Save remark
          </button>
        </div>
      </div>
    </div>
  );
}

function FilterChip({ label, count, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex h-9 items-center gap-2 rounded-full border px-4 text-[13.5px] font-semibold transition-colors ${
        active
          ? "border-deep bg-deep text-white"
          : "border-line bg-white text-navy hover:border-brand hover:text-brand"
      }`}
    >
      {label}
      {typeof count === "number" ? (
        <span className={active ? "text-white/70" : "text-muted"}>{count}</span>
      ) : null}
    </button>
  );
}

function IconLink({ href, title, icon: Icon, external }) {
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

function PageButton({ children, disabled, onClick }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-9 items-center rounded-[10px] border border-line bg-white px-4 text-[13.5px] font-semibold text-navy transition-colors hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-line disabled:hover:text-navy"
    >
      {children}
    </button>
  );
}

function LeadDrawer({
  lead,
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

  const rows = [
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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Enquiry from ${lead.name}`}
      className="fixed inset-0 z-50 flex justify-end"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-navy/40 backdrop-blur-[2px]"
      />

      <div className="relative flex h-full w-full max-w-[440px] flex-col overflow-y-auto bg-white shadow-2xl">
        <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-line bg-white px-5 py-4">
          <div className="min-w-0">
            <h2 className="truncate text-[18px] font-bold text-navy">{lead.name}</h2>
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

        <div className="flex-1 px-5 py-5">
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
