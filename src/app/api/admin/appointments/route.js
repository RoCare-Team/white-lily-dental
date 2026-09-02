import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/adminSession";
import { getClinics } from "@/lib/content";
import { getLeads } from "@/lib/mongodb";
import { parseLead, serializeLead, SLOT_HOLDING_STATUSES } from "@/lib/leads";
import { formatTime, generateSlots, isValidDate, isValidTime } from "@/lib/slots";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Appointments created by staff, from the calendar's "Add patient" form.
 *
 * This is deliberately not the public booking route. A receptionist is looking
 * at the patient across the desk, so the rules the website needs — an hour's
 * notice, thirty days ahead, no back-dating — would only get in the way here.
 * The one rule that stays is the one the database enforces anyway: a slot can
 * be held by exactly one appointment.
 */

async function findClinic(clinicId) {
  const clinics = await getClinics();
  return clinics.find((clinic) => clinic.id === clinicId) ?? null;
}

/** Every time the clinic runs on a date, and who already has it. */
export async function GET(request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const clinicId = searchParams.get("clinic");
  const date = searchParams.get("date");

  if (!clinicId || !isValidDate(date)) {
    return NextResponse.json(
      { error: "A clinic and a date are required." },
      { status: 400 }
    );
  }

  try {
    const clinic = await findClinic(clinicId);
    if (!clinic) {
      return NextResponse.json({ error: "Unknown clinic." }, { status: 404 });
    }

    const leads = await getLeads();
    const held = await leads
      .find(
        { clinicId, slotDate: date, status: { $in: SLOT_HOLDING_STATUSES } },
        { projection: { slotTime: 1, name: 1 } }
      )
      .toArray();

    // Named rather than only counted: "12:00 — Shivani M" tells the person on
    // the desk whether the clash is worth moving, which a greyed-out chip alone
    // never does.
    const takenBy = new Map(held.map((lead) => [lead.slotTime, lead.name || "Booked"]));

    return NextResponse.json({
      clinic: { id: clinic.id, name: clinic.shortName || clinic.name || clinic.id },
      date,
      slots: generateSlots(clinic).map((time) => ({
        time,
        label: formatTime(time),
        takenBy: takenBy.get(time) ?? "",
      })),
    });
  } catch (error) {
    console.error("Failed to load admin slots:", error);
    return NextResponse.json(
      { error: "Could not load this day's times." },
      { status: 500 }
    );
  }
}

/** Register a patient, with or without a time booked for them. */
export async function POST(request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = parseLead({ ...body, source: "walk-in" });
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const wantsSlot = Boolean(body?.slotDate || body?.slotTime);
  // Named from the clinic list rather than trusted from the form, so the name
  // stored on the lead always matches the clinic the id points at.
  const clinic = body?.clinicId ? await findClinic(body.clinicId) : null;

  if (body?.clinicId && !clinic) {
    return NextResponse.json({ error: "Unknown clinic." }, { status: 404 });
  }

  if (wantsSlot) {
    if (!isValidDate(body.slotDate) || !isValidTime(body.slotTime)) {
      return NextResponse.json(
        { error: "Please choose a date and a time, or leave both empty." },
        { status: 400 }
      );
    }

    if (!clinic) {
      return NextResponse.json(
        { error: "Please choose which clinic the patient is coming to." },
        { status: 400 }
      );
    }
  }

  const record = {
    ...parsed.lead,
    // Staff typed it, so it has been read by definition — it must not arrive as
    // an unread badge on the screen it was created from.
    seenAt: new Date(),
    // A booking made at the desk is agreed, not an enquiry waiting for a reply.
    status: wantsSlot ? "booked" : "new",
  };

  if (clinic) {
    record.clinic = clinic.shortName || clinic.name || clinic.id;
    record.clinicId = clinic.id;
  }

  if (wantsSlot) {
    record.slotDate = body.slotDate;
    record.slotTime = body.slotTime;
  }

  try {
    const leads = await getLeads();

    if (wantsSlot) {
      const clash = await leads.findOne(
        {
          clinicId: clinic.id,
          slotDate: record.slotDate,
          slotTime: record.slotTime,
          status: { $in: SLOT_HOLDING_STATUSES },
        },
        { projection: { name: 1 } }
      );

      if (clash) {
        return NextResponse.json(
          {
            error: `${formatTime(record.slotTime)} is already booked for ${
              clash.name || "another patient"
            }. Please pick another time.`,
            code: "slot_taken",
          },
          { status: 409 }
        );
      }
    }

    // How many enquiries this phone number already has. Nothing depends on it,
    // but "added to an existing file" is worth saying out loud — it is the
    // difference between one patient and two half-patients.
    const previous = await leads.countDocuments({ phoneDigits: record.phoneDigits });

    const { insertedId } = await leads.insertOne(record);
    const doc = await leads.findOne({ _id: insertedId });

    return NextResponse.json(
      { ok: true, lead: serializeLead(doc), returning: previous > 0 },
      { status: 201 }
    );
  } catch (error) {
    // Two people booking the same slot from two desks: the index says no.
    if (error?.code === 11000) {
      return NextResponse.json(
        {
          error: "That time was booked a moment ago. Please pick another.",
          code: "slot_taken",
        },
        { status: 409 }
      );
    }
    console.error("Failed to add patient:", error);
    return NextResponse.json(
      { error: "Could not save this patient. Please try again." },
      { status: 500 }
    );
  }
}
