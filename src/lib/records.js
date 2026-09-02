/**
 * A patient's clinical file: visits, the records hung off them, and the bills
 * raised against them.
 *
 * A *visit* is one attendance — a date, a time and a doctor. Where the patient
 * booked through the website the visit points at that appointment, so the file
 * and the calendar are describing the same event rather than two copies of it.
 * Records and invoices only ever attach to a visit, never to a patient
 * directly, which is what keeps "what was done" and "when" from drifting apart.
 *
 * Everything here is plain data with no database or React in it, so the route
 * handlers and the browser can share one definition of a valid record.
 */

/** The Add records menu, in the order it is shown. */
export const RECORD_KINDS = [
  { value: "vitals", label: "Vital signs" },
  { value: "note", label: "Clinical notes" },
  { value: "prescription", label: "Prescription" },
  { value: "file", label: "Files" },
  { value: "lab-order", label: "Lab order" },
  { value: "treatment-plan", label: "Treatment plan" },
  { value: "procedures", label: "Completed procedures" },
];

export const RECORD_KIND_VALUES = RECORD_KINDS.map((kind) => kind.value);

export const RECORD_LABELS = Object.fromEntries(
  RECORD_KINDS.map((kind) => [kind.value, kind.label])
);

export const PAYMENT_MODES = ["Cash", "Card", "UPI", "Bank transfer", "Cheque"];

/**
 * What each kind of record is allowed to hold.
 *
 * `fields` are single values; `rows` describe one line of a repeating table and
 * `money` the numeric columns of that table. Anything not named here is dropped
 * on the way in, so a record can never grow a field the forms cannot show.
 */
const SHAPES = {
  vitals: {
    fields: ["bp", "pulse", "temperature", "weight", "height", "notes"],
  },
  note: {
    fields: ["complaint", "observation", "diagnosis", "notes"],
  },
  prescription: {
    rows: ["medicine", "dosage", "frequency", "duration", "instructions"],
  },
  file: {
    fields: ["label", "url", "notes"],
  },
  "lab-order": {
    fields: ["lab", "work", "sentOn", "expectedOn", "notes"],
  },
  "treatment-plan": {
    rows: ["procedure", "tooth"],
    money: ["cost", "discount"],
  },
  procedures: {
    rows: ["procedure", "tooth", "notes"],
    money: ["cost"],
  },
};

const MAX_TEXT = 600;
const MAX_NOTE = 4000;
const MAX_ROWS = 40;
const MAX_ITEMS = 40;
const MAX_PAYMENTS = 20;

function text(value, limit = MAX_TEXT) {
  if (typeof value === "number") return String(value);
  if (typeof value !== "string") return "";
  return value.trim().slice(0, limit);
}

/** Rupees, never negative, never more than two decimals. */
export function money(value) {
  const number = Number(String(value ?? "").toString().replace(/[^0-9.-]/g, ""));
  if (!Number.isFinite(number) || number <= 0) return 0;
  return Math.round(Math.min(number, 10_000_000) * 100) / 100;
}

/** What one priced line comes to after its own discount. */
export function lineTotal(row) {
  return Math.max(0, money(row?.cost) - money(row?.discount));
}

/** The money on a treatment plan or a set of completed procedures. */
export function rowsTotal(rows = []) {
  return Math.round(rows.reduce((sum, row) => sum + lineTotal(row), 0) * 100) / 100;
}

/**
 * Validates one record's payload against its kind.
 * Returns `{ ok: true, data }` or `{ ok: false, error }`.
 */
export function parseRecord(kind, input) {
  const shape = SHAPES[kind];
  if (!shape) return { ok: false, error: "Unknown record type." };
  if (!input || typeof input !== "object") {
    return { ok: false, error: "Invalid record." };
  }

  const data = {};
  let filled = false;

  for (const name of shape.fields ?? []) {
    const value = text(input[name], name === "notes" ? MAX_NOTE : MAX_TEXT);
    data[name] = value;
    if (value) filled = true;
  }

  if (shape.rows) {
    const rows = Array.isArray(input.items) ? input.items.slice(0, MAX_ROWS) : [];
    data.items = rows
      .map((row) => {
        const line = {};
        for (const name of shape.rows) line[name] = text(row?.[name]);
        for (const name of shape.money ?? []) line[name] = money(row?.[name]);
        return line;
      })
      // A half-typed row the user never finished is not worth storing.
      .filter((row) =>
        Object.entries(row).some(([, value]) =>
          typeof value === "number" ? value > 0 : Boolean(value)
        )
      );

    if (data.items.length) filled = true;
  }

  if (kind === "file" && !data.url) {
    return { ok: false, error: "Upload a file first." };
  }

  if (!filled) {
    return { ok: false, error: "Fill in at least one field before saving." };
  }

  return { ok: true, data };
}

/**
 * Validates an invoice. Line totals are worked out here rather than trusted
 * from the browser — a bill is the one thing in the panel that must add up.
 */
export function parseInvoice(input) {
  if (!input || typeof input !== "object") {
    return { ok: false, error: "Invalid invoice." };
  }

  const items = (Array.isArray(input.items) ? input.items : [])
    .slice(0, MAX_ITEMS)
    .map((item) => ({
      name: text(item?.name, 200),
      cost: money(item?.cost),
      discount: money(item?.discount),
    }))
    .filter((item) => item.name || item.cost);

  if (!items.length) {
    return { ok: false, error: "Add at least one item to the bill." };
  }

  if (items.some((item) => !item.name)) {
    return { ok: false, error: "Every line needs a name." };
  }

  const payments = (Array.isArray(input.payments) ? input.payments : [])
    .slice(0, MAX_PAYMENTS)
    .map((payment) => ({
      amount: money(payment?.amount),
      mode: PAYMENT_MODES.includes(payment?.mode) ? payment.mode : PAYMENT_MODES[0],
      at: payment?.at ? new Date(payment.at) : new Date(),
      note: text(payment?.note, 200),
    }))
    .filter((payment) => payment.amount > 0);

  return {
    ok: true,
    invoice: { items, payments, notes: text(input.notes, MAX_NOTE) },
  };
}

/** Everything a bill adds up to, worked out the same way on both sides. */
export function invoiceTotals(invoice) {
  const items = invoice?.items ?? [];
  const round = (n) => Math.round(n * 100) / 100;

  const gross = round(items.reduce((sum, item) => sum + money(item.cost), 0));
  const discount = round(
    items.reduce(
      (sum, item) => sum + Math.min(money(item.discount), money(item.cost)),
      0
    )
  );
  const total = round(gross - discount);
  const paid = round(
    (invoice?.payments ?? []).reduce((sum, payment) => sum + money(payment.amount), 0)
  );

  return { gross, discount, total, paid, balance: round(Math.max(0, total - paid)) };
}

/** "1234.5" → "₹1,234.50". Indian grouping, because the clinic bills in it. */
export function rupees(value) {
  return `₹${money(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/* ------------------------------------------------------------ serialising */

export function serializeVisit(doc) {
  if (!doc) return null;
  return {
    id: String(doc._id),
    leadId: doc.leadId ? String(doc.leadId) : "",
    date: doc.date ?? "",
    time: doc.time ?? "",
    doctor: doc.doctor ?? "",
    clinic: doc.clinic ?? "",
    clinicId: doc.clinicId ?? "",
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : null,
  };
}

export function serializeRecord(doc) {
  if (!doc) return null;
  return {
    id: String(doc._id),
    visitId: String(doc.visitId),
    kind: doc.kind,
    data: doc.data ?? {},
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : null,
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : null,
  };
}

export function serializeInvoice(doc) {
  if (!doc) return null;
  return {
    id: String(doc._id),
    visitId: String(doc.visitId),
    number: doc.number ?? "",
    items: (doc.items ?? []).map((item) => ({
      name: item.name ?? "",
      cost: money(item.cost),
      discount: money(item.discount),
    })),
    payments: (doc.payments ?? []).map((payment) => ({
      amount: money(payment.amount),
      mode: payment.mode ?? "",
      note: payment.note ?? "",
      at: payment.at ? new Date(payment.at).toISOString() : null,
    })),
    notes: doc.notes ?? "",
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : null,
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : null,
  };
}
