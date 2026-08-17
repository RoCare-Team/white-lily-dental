/** Shared shape + validation for enquiry leads. */

export const LEAD_STATUSES = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "booked", label: "Booked" },
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
export const SLOT_HOLDING_STATUSES = ["new", "contacted", "booked", "closed"];

export const LEAD_STATUS_VALUES = LEAD_STATUSES.map((s) => s.value);

export const LEAD_SOURCES = [
  "appointment-form",
  "service-enquiry",
  "booking-wizard",
  "plan-enquiry",
];

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
  const filter = {};

  // Slot bookings, plan enquiries and plain enquiries are three different
  // jobs for the clinic, so each gets its own screen rather than one mixed list.
  const kind = searchParams.get("kind");
  if (kind === "appointment") {
    filter.slotDate = { $exists: true };
  } else if (kind === "plan") {
    filter.source = "plan-enquiry";
  } else if (kind === "enquiry") {
    filter.slotDate = { $exists: false };
    filter.source = { $ne: "plan-enquiry" };
  }

  if (kind === "appointment") {
    const when = searchParams.get("when");
    const today = todayKey();
    if (when === "today") filter.slotDate = today;
    else if (when === "past") filter.slotDate = { $lt: today };
    else if (when !== "all") filter.slotDate = { $gte: today };
  }

  const status = searchParams.get("status");
  if (status && LEAD_STATUS_VALUES.includes(status)) {
    filter.status = status;
  }

  const search = searchParams.get("q")?.trim();
  if (search) {
    const pattern = new RegExp(escapeRegex(search), "i");
    filter.$or = [
      { name: pattern },
      { phone: pattern },
      { phoneDigits: pattern },
      { email: pattern },
      { treatment: pattern },
      { doctor: pattern },
      { plan: pattern },
      { message: pattern },
    ];
  }

  return filter;
}

/**
 * Enquiries read newest-first. Appointments read in clinic order — the next
 * one to walk in at the top — except when looking back, where most recent
 * first is what you want.
 */
export function buildLeadSort(searchParams) {
  if (searchParams.get("kind") !== "appointment") return { createdAt: -1 };
  const backwards = searchParams.get("when") === "past";
  return backwards
    ? { slotDate: -1, slotTime: -1 }
    : { slotDate: 1, slotTime: 1 };
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
