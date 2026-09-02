import { getInvoices, getLeads, getRecords, getVisits } from "@/lib/mongodb";
import { serializeLead, todayKey } from "@/lib/leads";
import {
  invoiceTotals,
  serializeInvoice,
  serializeRecord,
  serializeVisit,
} from "@/lib/records";

/**
 * A patient is every lead that shares a phone number.
 *
 * There is no patient record in the database and there does not need to be —
 * `phoneDigits` is already stored on every lead, normalised, and is the one
 * thing a returning patient always gives the same way. Grouping on it turns
 * the enquiry log into a history without a second source of truth to keep in
 * step.
 */

const LIST_LIMIT = 300;

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** The people to show on the patients list, newest contact first. */
export async function listPatients({ q = "", tab = "recent" } = {}) {
  const leads = await getLeads();
  const today = todayKey();

  const match = { phoneDigits: { $nin: [null, ""] } };

  if (tab === "today") {
    match.slotDate = today;
  } else if (tab !== "all") {
    // "Recent" is the last 90 days of contact — long enough to cover a course
    // of treatment, short enough that the list stays scannable.
    const since = new Date();
    since.setDate(since.getDate() - 90);
    match.createdAt = { $gte: since };
  }

  const search = q.trim();
  if (search) {
    const pattern = new RegExp(escapeRegex(search), "i");
    match.$or = [
      { name: pattern },
      { phone: pattern },
      { phoneDigits: pattern },
      { email: pattern },
    ];
  }

  const rows = await leads
    .aggregate([
      { $match: match },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$phoneDigits",
          // $first after the sort above, so the newest spelling of a name wins
          // — people correct their own details on a second enquiry.
          name: { $first: "$name" },
          phone: { $first: "$phone" },
          email: { $first: "$email" },
          clinic: { $first: "$clinic" },
          doctor: { $first: "$doctor" },
          visits: { $sum: 1 },
          lastContact: { $max: "$createdAt" },
          lastSlot: { $max: "$slotDate" },
          nextSlot: {
            $min: {
              $cond: [{ $gte: ["$slotDate", today] }, "$slotDate", null],
            },
          },
        },
      },
      { $sort: { lastContact: -1 } },
      { $limit: LIST_LIMIT },
    ])
    .toArray();

  return rows.map((row) => ({
    id: row._id,
    name: row.name || "Unnamed",
    phone: row.phone || "",
    email: row.email || "",
    clinic: row.clinic || "",
    doctor: row.doctor || "",
    visits: row.visits,
    lastContact: row.lastContact ? new Date(row.lastContact).toISOString() : null,
    lastSlot: row.lastSlot || "",
    nextSlot: row.nextSlot || "",
  }));
}

/** One patient and everything they have ever sent, newest first. */
export async function getPatient(phoneDigits) {
  const digits = String(phoneDigits ?? "").replace(/\D/g, "");
  if (!digits) return null;

  const [leads, visitsCollection] = await Promise.all([getLeads(), getVisits()]);

  const [docs, visitDocs] = await Promise.all([
    leads.find({ phoneDigits: digits }).sort({ createdAt: -1 }).toArray(),
    visitsCollection.find({ phoneDigits: digits }).toArray(),
  ]);

  if (!docs.length && !visitDocs.length) return null;

  const history = docs.map(serializeLead);
  const latest = history[0];
  const today = todayKey();

  const slots = history.map((lead) => lead.slotDate).filter(Boolean).sort();

  return {
    id: digits,
    // The most recent enquiry carries the details the patient last gave us.
    name: latest?.name || visitDocs[0]?.patientName || "Unnamed",
    phone: latest?.phone || visitDocs[0]?.patientPhone || "",
    email: history.find((lead) => lead.email)?.email || "",
    clinic: latest?.clinic || "",
    doctor: history.find((lead) => lead.doctor)?.doctor || "",
    firstSeen: history[history.length - 1]?.createdAt ?? null,
    visits: history.length,
    appointments: slots.length,
    nextSlot: slots.find((key) => key >= today) || "",
    lastSlot: [...slots].reverse().find((key) => key < today) || "",
    history,
    ...(await clinicalFile(digits, history, visitDocs)),
  };
}

/**
 * The charting and billing timeline.
 *
 * One entry per visit, in date order, newest first. A visit the patient booked
 * on the website is the same entry as its appointment rather than a second one
 * beside it — the booking is what says the visit happened. A visit typed in by
 * staff, for someone who simply walked in, stands on its own.
 */
async function clinicalFile(digits, history, visitDocs) {
  const [recordsCollection, invoicesCollection] = await Promise.all([
    getRecords(),
    getInvoices(),
  ]);

  const visitIds = visitDocs.map((visit) => visit._id);
  const [recordDocs, invoiceDocs] = visitIds.length
    ? await Promise.all([
        recordsCollection
          .find({ visitId: { $in: visitIds } })
          .sort({ createdAt: 1 })
          .toArray(),
        invoicesCollection
          .find({ visitId: { $in: visitIds } })
          .sort({ createdAt: 1 })
          .toArray(),
      ])
    : [[], []];

  const recordsByVisit = new Map();
  for (const doc of recordDocs) {
    const key = String(doc.visitId);
    if (!recordsByVisit.has(key)) recordsByVisit.set(key, []);
    recordsByVisit.get(key).push(serializeRecord(doc));
  }

  const invoicesByVisit = new Map();
  for (const doc of invoiceDocs) {
    const key = String(doc.visitId);
    if (!invoicesByVisit.has(key)) invoicesByVisit.set(key, []);
    invoicesByVisit.get(key).push(serializeInvoice(doc));
  }

  const visits = visitDocs.map(serializeVisit);
  const byLead = new Map(visits.filter((v) => v.leadId).map((v) => [v.leadId, v]));
  const attached = new Set();

  const entry = (visit, lead) => {
    if (visit) attached.add(visit.id);
    const date = lead?.slotDate || visit?.date || dayOf(lead?.createdAt);
    return {
      key: lead ? `lead:${lead.id}` : `visit:${visit.id}`,
      visitId: visit?.id ?? "",
      leadId: lead?.id ?? "",
      date,
      time: lead?.slotTime || visit?.time || "",
      doctor: lead?.doctor || visit?.doctor || "",
      clinic: lead?.clinic || visit?.clinic || "",
      lead: lead ?? null,
      records: visit ? (recordsByVisit.get(visit.id) ?? []) : [],
      invoices: visit ? (invoicesByVisit.get(visit.id) ?? []) : [],
    };
  };

  const timeline = [
    ...history.map((lead) => entry(byLead.get(lead.id) ?? null, lead)),
    ...visits.filter((visit) => !attached.has(visit.id)).map((visit) => entry(visit, null)),
  ].sort(
    (a, b) => (b.date || "").localeCompare(a.date || "") ||
      (b.time || "").localeCompare(a.time || "")
  );

  // The billing summary for the sidebar, so the whole file's money is answered
  // without opening a single bill.
  const billed = { total: 0, paid: 0, balance: 0, count: invoiceDocs.length };
  for (const doc of invoiceDocs) {
    const totals = invoiceTotals(doc);
    billed.total += totals.total;
    billed.paid += totals.paid;
    billed.balance += totals.balance;
  }
  for (const key of ["total", "paid", "balance"]) {
    billed[key] = Math.round(billed[key] * 100) / 100;
  }

  return { timeline, billed, recordCount: recordDocs.length };
}

/** The local day an ISO timestamp falls on, as a YYYY-MM-DD key. */
function dayOf(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
}
