/** Shared shape + validation for enquiry leads. */

export const LEAD_STATUSES = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "booked", label: "Booked" },
  // The one status that finishes a lead: marking it Complete is what moves the
  // lead off its inbox and onto the Clients screen.
  { value: "complete", label: "Complete" },
  { value: "closed", label: "Closed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "spam", label: "Spam" },
];

/**
 * Statuses that still hold an appointment slot. A cancelled or spam booking
 * releases its time back to the public booking wizard — this list is what both
 * the availability query and the unique index are built from, so they can never
 * disagree about whether a slot is free.
 */
export const SLOT_HOLDING_STATUSES = [
  "new",
  "contacted",
  "booked",
  "complete",
  "closed",
];

export const LEAD_STATUS_VALUES = LEAD_STATUSES.map((s) => s.value);

export const LEAD_SOURCES = [
  "appointment-form",
  "service-enquiry",
  "booking-wizard",
  "plan-enquiry",
  // Typed in at the desk rather than sent by the patient: a walk-in, or a
  // booking taken over the phone.
  "walk-in",
];

/**
 * Sources that belong to the appointments screen even with no time chosen yet.
 * A treatment-page request and a walk-in registered at the desk are both people
 * waiting to be given a slot, so both sit on the calendar's "Awaiting a time"
 * strip instead of landing in the contact inbox.
 */
export const APPOINTMENT_SOURCES = ["service-enquiry", "walk-in"];

/**
 * Marks appointments with no doctor recorded, so the calendar's doctor filter
 * can still reach them. It lives here rather than beside the query that uses
 * it, because the calendar in the browser has to recognise it too and cannot
 * import anything that reaches the database.
 */
export const UNASSIGNED = "__none__";

export const LEADS_PAGE_SIZE = 25;

/** Escapes a user string so it is matched literally inside a RegExp. */
function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Today as YYYY-MM-DD in local time, the same shape slot dates are stored in. */
export function todayKey(now = new Date()) {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Builds the Mongo query for the admin leads list from a URLSearchParams. */
export function buildLeadFilter(searchParams) {
  // Collected and combined with $and, because both the bucket and the search
  // want $or and a plain object would let one silently overwrite the other.
  const clauses = [];
  const kind = searchParams.get("kind");

  // "clients" is the finished pile. It picks its bucket from ?type instead of
  // ?kind, because it can show one inbox's leads or all of them together.
  const isClients = kind === "clients";
  const bucket = isClients ? searchParams.get("type") : kind;

  if (bucket === "appointment") {
    // Everything the patient asked to be seen for: a reserved slot from the
    // booking wizard, or a "Request appointment" form on a treatment page.
    clauses.push({
      $or: [
        { slotDate: { $exists: true } },
        { source: { $in: APPOINTMENT_SOURCES } },
      ],
    });

    const when = searchParams.get("when");
    const today = todayKey();
    if (when === "today") clauses.push({ slotDate: today });
    else if (when === "past") clauses.push({ slotDate: { $lt: today } });
    else if (when === "upcoming") clauses.push({ slotDate: { $gte: today } });
    else if (when === "noslot") clauses.push({ slotDate: { $exists: false } });
    // "all" is the default and adds nothing, so no request is ever hidden.
  } else if (bucket === "contact") {
    // A catch-all rather than source === "appointment-form", so a lead with an
    // unexpected source still shows up somewhere instead of vanishing.
    clauses.push({
      slotDate: { $exists: false },
      source: { $nin: ["plan-enquiry", ...APPOINTMENT_SOURCES] },
    });
  } else if (bucket === "plan") {
    clauses.push({ source: "plan-enquiry" });
  }

  // Completing a lead is what moves it. Until then it stays on its own inbox
  // whatever else it has been marked, and afterwards it only appears under
  // Clients — so every lead is on exactly one screen.
  if (isClients) {
    clauses.push({ status: "complete" });
  } else if (kind) {
    clauses.push({ status: { $ne: "complete" } });

    const status = searchParams.get("status");
    if (status && LEAD_STATUS_VALUES.includes(status) && status !== "complete") {
      clauses.push({ status });
    }
  }

  const search = searchParams.get("q")?.trim();
  if (search) {
    const pattern = new RegExp(escapeRegex(search), "i");
    clauses.push({
      $or: [
        { name: pattern },
        { phone: pattern },
        { phoneDigits: pattern },
        { email: pattern },
        { treatment: pattern },
        { doctor: pattern },
        { plan: pattern },
        { message: pattern },
      ],
    });
  }

  return clauses.length ? { $and: clauses } : {};
}

/**
 * Enquiries read newest-first. Appointments read in clinic order — the next
 * one to walk in at the top — except when looking back, where most recent
 * first is what you want.
 */
export function buildLeadSort(searchParams) {
  const kind = searchParams.get("kind");
  // Clients read by what was finished last, not by what arrived last.
  if (kind === "clients") return { updatedAt: -1 };
  if (kind !== "appointment") return { createdAt: -1 };

  const when = searchParams.get("when");
  if (when === "past") return { slotDate: -1, slotTime: -1 };
  if (when === "today" || when === "upcoming") {
    return { slotDate: 1, slotTime: 1 };
  }
  // Mixed list: some rows have no slot at all, so fall back to arrival order.
  return { createdAt: -1 };
}

const MAX = {
  name: 120,
  phone: 20,
  email: 160,
  clinic: 120,
  treatment: 160,
  doctor: 120,
  plan: 120,
  pageUrl: 300,
  date: 20,
  message: 2000,
};

function clean(value, limit) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, limit);
}

/**
 * Validates a public form submission.
 * Returns `{ ok: true, lead }` or `{ ok: false, error }`.
 */
export function parseLead(input) {
  if (!input || typeof input !== "object") {
    return { ok: false, error: "Invalid request body." };
  }

  const name = clean(input.name, MAX.name);
  const phone = clean(input.phone, MAX.phone);
  const email = clean(input.email, MAX.email).toLowerCase();

  if (name.length < 2) {
    return { ok: false, error: "Please enter your name." };
  }

  const digits = phone.replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15) {
    return { ok: false, error: "Please enter a valid phone number." };
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  const source = LEAD_SOURCES.includes(input.source)
    ? input.source
    : "appointment-form";

  return {
    ok: true,
    lead: {
      name,
      phone,
      phoneDigits: digits,
      email,
      clinic: clean(input.clinic, MAX.clinic),
      treatment: clean(input.treatment, MAX.treatment),
      // Booking context: which specialist / package the request is for, and
      // the page it was sent from. Filled in by the form, not typed.
      doctor: clean(input.doctor, MAX.doctor),
      plan: clean(input.plan, MAX.plan),
      pageUrl: clean(input.pageUrl, MAX.pageUrl),
      preferredDate: clean(input.date, MAX.date),
      message: clean(input.message, MAX.message),
      source,
      status: "new",
      notes: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };
}

/** Converts a Mongo document into a JSON-safe object for the client. */
export function serializeLead(doc) {
  if (!doc) return null;
  return {
    id: String(doc._id),
    name: doc.name ?? "",
    phone: doc.phone ?? "",
    phoneDigits: doc.phoneDigits ?? "",
    email: doc.email ?? "",
    clinic: doc.clinic ?? "",
    clinicId: doc.clinicId ?? "",
    slotDate: doc.slotDate ?? "",
    slotTime: doc.slotTime ?? "",
    treatment: doc.treatment ?? "",
    doctor: doc.doctor ?? "",
    plan: doc.plan ?? "",
    pageUrl: doc.pageUrl ?? "",
    preferredDate: doc.preferredDate ?? "",
    message: doc.message ?? "",
    source: doc.source ?? "",
    status: doc.status ?? "new",
    // When a member of staff first opened it — absent means unread.
    seenAt: doc.seenAt ? new Date(doc.seenAt).toISOString() : null,
    notes: doc.notes ?? "",
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : null,
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : null,
  };
}
