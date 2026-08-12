import { ICON_NAMES } from "@/lib/icons";

/**
 * Coerces a submitted record into the shape its schema describes.
 *
 * Anything the schema does not mention is dropped, so a crafted request cannot
 * smuggle extra keys into a document. Returns `{ ok, value }` or `{ ok, error }`.
 */

const MAX_TEXT = 400;
const MAX_LONG_TEXT = 20000;
const MAX_ITEMS = 200;

function coerceField(field, raw) {
  switch (field.type) {
    case "text":
    case "date":
      return String(raw ?? "").trim().slice(0, MAX_TEXT);

    case "time": {
      const value = String(raw ?? "").trim();
      // 24-hour HH:MM only — slot maths depends on it.
      return /^([01]\d|2[0-3]):[0-5]\d$/.test(value) ? value : (field.default ?? "");
    }

    case "textarea":
      return String(raw ?? "").trim().slice(0, MAX_LONG_TEXT);

    case "image":
      return String(raw ?? "").trim().slice(0, 2000);

    case "colour": {
      const value = String(raw ?? "").trim();
      // Accept #rgb / #rrggbb only — this lands straight in a style attribute.
      return /^#[0-9a-fA-F]{3,8}$/.test(value) ? value : "";
    }

    case "number": {
      const value = Number(raw);
      if (!Number.isFinite(value)) return field.default ?? 0;
      const min = field.min ?? -Infinity;
      const max = field.max ?? Infinity;
      return Math.min(max, Math.max(min, value));
    }

    case "boolean":
      return Boolean(raw);

    case "select":
      return field.options.includes(raw) ? raw : field.default ?? field.options[0];

    case "icon":
      return ICON_NAMES.includes(raw) ? raw : null;

    case "list":
      return (Array.isArray(raw) ? raw : [])
        .slice(0, MAX_ITEMS)
        .map((item) => String(item ?? "").trim().slice(0, MAX_TEXT))
        .filter(Boolean);

    case "paragraphs":
      return (Array.isArray(raw) ? raw : [])
        .slice(0, MAX_ITEMS)
        .map((item) => String(item ?? "").trim().slice(0, MAX_LONG_TEXT))
        .filter(Boolean);

    case "group":
      return coerceRecord(field.fields, raw ?? {});

    case "repeater":
      return (Array.isArray(raw) ? raw : [])
        .slice(0, MAX_ITEMS)
        .map((item) => coerceRecord(field.fields, item ?? {}));

    default:
      return null;
  }
}

function coerceRecord(fields, input) {
  const out = {};
  for (const field of fields) {
    out[field.name] = coerceField(field, input?.[field.name]);
  }
  return out;
}

/** Validates and coerces `input` against `schema.fields`. */
export function validateRecord(schema, input) {
  if (!input || typeof input !== "object") {
    return { ok: false, error: "Invalid request body." };
  }

  const value = coerceRecord(schema.fields, input);

  for (const field of schema.fields) {
    if (!field.required) continue;
    const filled = Array.isArray(value[field.name])
      ? value[field.name].length > 0
      : String(value[field.name] ?? "").length > 0;
    if (!filled) {
      return { ok: false, error: `${field.label} is required.` };
    }
  }

  // Identity fields become part of a URL — keep them to a safe alphabet.
  // Types without one (testimonials, FAQs) are keyed by their MongoDB _id.
  const identity = schema.identity;
  if (identity) {
    const slug = String(value[identity])
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    if (!slug) {
      const label = schema.fields.find((f) => f.name === identity)?.label ?? identity;
      return { ok: false, error: `${label} must contain letters or numbers.` };
    }
    value[identity] = slug;
  }

  return { ok: true, value };
}

/** Fills in a blank record so the admin form always has defined inputs. */
export function emptyRecord(fields) {
  const out = {};
  for (const field of fields) {
    if (field.default !== undefined) out[field.name] = field.default;
    else if (["list", "paragraphs", "repeater"].includes(field.type)) out[field.name] = [];
    else if (field.type === "boolean") out[field.name] = false;
    else if (field.type === "number") out[field.name] = 0;
    else if (field.type === "group") out[field.name] = emptyRecord(field.fields);
    else if (field.type === "icon") out[field.name] = null;
    else out[field.name] = "";
  }
  return out;
}
