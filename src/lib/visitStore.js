import { ObjectId } from "mongodb";

import { getLeads, getVisits } from "@/lib/mongodb";
import { isValidDate, isValidTime } from "@/lib/slots";

/**
 * Finding — and, where it does not exist yet, opening — the visit a record or a
 * bill belongs to.
 *
 * Nothing in the panel creates a visit on purpose. Adding the first record to
 * an appointment opens one behind the scenes, which is why a booking the
 * patient never turned up for leaves no empty file.
 */

export function toObjectId(id) {
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

/** The visit for an appointment, opened on first use. */
async function fromLead(digits, leadId) {
  const _id = toObjectId(leadId);
  if (!_id) return { error: "Invalid appointment.", status: 400 };

  const leads = await getLeads();
  const lead = await leads.findOne({ _id });

  if (!lead) return { error: "Appointment not found.", status: 404 };
  // Belt and braces: the phone number in the URL has to be this lead's own, or
  // one patient's file could be made to grow another's records.
  if (lead.phoneDigits !== digits) {
    return { error: "That appointment belongs to another patient.", status: 400 };
  }

  const visits = await getVisits();
  const visit = await visits.findOneAndUpdate(
    { leadId: _id },
    {
      $setOnInsert: {
        phoneDigits: digits,
        leadId: _id,
        date: lead.slotDate ?? "",
        time: lead.slotTime ?? "",
        doctor: lead.doctor ?? "",
        clinic: lead.clinic ?? "",
        clinicId: lead.clinicId ?? "",
        createdAt: new Date(),
      },
    },
    { upsert: true, returnDocument: "after" }
  );

  return { visit };
}

/** A visit typed in by staff: a date, a time and a doctor, and nothing else. */
async function fromDetails(digits, body) {
  if (!isValidDate(body?.date)) {
    return { error: "Choose the date of the visit.", status: 400 };
  }
  if (body?.time && !isValidTime(body.time)) {
    return { error: "Choose a valid time.", status: 400 };
  }

  const visits = await getVisits();
  const doc = {
    phoneDigits: digits,
    leadId: null,
    date: body.date,
    time: body.time || "",
    doctor: String(body.doctor ?? "").trim().slice(0, 120),
    clinic: String(body.clinic ?? "").trim().slice(0, 120),
    clinicId: String(body.clinicId ?? "").trim().slice(0, 120),
    createdAt: new Date(),
  };

  const { insertedId } = await visits.insertOne(doc);
  return { visit: { ...doc, _id: insertedId } };
}

/**
 * The visit a request is talking about: an existing one by id, the one behind
 * an appointment, or a new one from a date and a doctor.
 * Returns `{ visit }` or `{ error, status }`.
 */
export async function resolveVisit(digits, body) {
  if (body?.visitId) {
    const _id = toObjectId(body.visitId);
    if (!_id) return { error: "Invalid visit.", status: 400 };

    const visits = await getVisits();
    const visit = await visits.findOne({ _id, phoneDigits: digits });
    if (!visit) return { error: "Visit not found.", status: 404 };
    return { visit };
  }

  if (body?.leadId) return fromLead(digits, body.leadId);

  return fromDetails(digits, body);
}

/** The digits in a `[phone]` route segment, or "" when it is not a number. */
export function phoneParam(value) {
  return String(value ?? "").replace(/\D/g, "");
}
