import { getLeads } from "@/lib/mongodb";
import { serializeLead, todayKey } from "@/lib/leads";

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

  const leads = await getLeads();
  const docs = await leads
    .find({ phoneDigits: digits })
    .sort({ createdAt: -1 })
    .toArray();

  if (!docs.length) return null;

  const history = docs.map(serializeLead);
  const latest = history[0];
  const today = todayKey();

  const slots = history.map((lead) => lead.slotDate).filter(Boolean).sort();

  return {
    id: digits,
    // The most recent enquiry carries the details the patient last gave us.
    name: latest.name || "Unnamed",
    phone: latest.phone || "",
    email: history.find((lead) => lead.email)?.email || "",
    clinic: latest.clinic || "",
    doctor: history.find((lead) => lead.doctor)?.doctor || "",
    firstSeen: history[history.length - 1].createdAt,
    visits: history.length,
    appointments: slots.length,
    nextSlot: slots.find((key) => key >= today) || "",
    lastSlot: [...slots].reverse().find((key) => key < today) || "",
    history,
  };
}
