/** Shared shape + validation for enquiry leads. */

export const LEAD_STATUSES = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "booked", label: "Booked" },
  { value: "closed", label: "Closed" },
  { value: "spam", label: "Spam" },
];

export const LEAD_STATUS_VALUES = LEAD_STATUSES.map((s) => s.value);

export const LEAD_SOURCES = ["appointment-form", "service-enquiry"];

export const LEADS_PAGE_SIZE = 25;

/** Escapes a user string so it is matched literally inside a RegExp. */
function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Builds the Mongo query for the admin leads list from a URLSearchParams. */
export function buildLeadFilter(searchParams) {
  const filter = {};

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
      { message: pattern },
    ];
  }

  return filter;
}

const MAX = {
  name: 120,
  phone: 20,
  email: 160,
  clinic: 120,
  treatment: 160,
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
    treatment: doc.treatment ?? "",
    preferredDate: doc.preferredDate ?? "",
    message: doc.message ?? "",
    source: doc.source ?? "",
    status: doc.status ?? "new",
    notes: doc.notes ?? "",
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : null,
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : null,
  };
}
