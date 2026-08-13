import { NextResponse } from "next/server";

import { getClinics } from "@/lib/content";
import { getLeads } from "@/lib/mongodb";
import { parseLead, SLOT_HOLDING_STATUSES } from "@/lib/leads";
import { clientIp, rateLimit } from "@/lib/rateLimit";
import { availableSlots, formatTime, isValidDate, isValidTime } from "@/lib/slots";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Public: reserve one appointment slot.
 *
 * The slot is checked for availability and then written with a unique index
 * behind it, so the check-then-write race between two patients clicking at the
 * same moment ends with exactly one booking, not two.
 */
export async function POST(request) {
  const limited = rateLimit(`booking:${clientIp(request)}`, {
    limit: 5,
    windowMs: 10 * 60 * 1000,
  });

  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many booking attempts. Please try again in a few minutes." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot — accept silently so the bot does not try another approach.
  if (typeof body?.company === "string" && body.company.trim()) {
    return NextResponse.json({ ok: true });
  }

  const { clinicId, slotDate, slotTime } = body ?? {};

  if (!clinicId || !isValidDate(slotDate) || !isValidTime(slotTime)) {
    return NextResponse.json(
      { error: "Please choose a clinic, a date and a time." },
      { status: 400 }
    );
  }

  try {
    const clinics = await getClinics();
    const clinic = clinics.find((item) => item.id === clinicId);
    if (!clinic) {
      return NextResponse.json({ error: "Unknown clinic." }, { status: 404 });
    }

    const leads = await getLeads();

    const taken = await leads
      .find(
        { clinicId, slotDate, status: { $in: SLOT_HOLDING_STATUSES } },
        { projection: { slotTime: 1 } }
      )
      .toArray();

    const free = availableSlots(clinic, slotDate, taken.map((l) => l.slotTime));
    if (!free.includes(slotTime)) {
      return NextResponse.json(
        {
          error: "Sorry, that time has just been taken. Please pick another slot.",
          code: "slot_taken",
        },
        { status: 409 }
      );
    }

    const parsed = parseLead({
      ...body,
      clinic: clinic.shortName,
      source: "booking-wizard",
    });
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    await leads.insertOne({
      ...parsed.lead,
      clinicId,
      slotDate,
      slotTime,
      meta: {
        ip: clientIp(request),
        userAgent: request.headers.get("user-agent")?.slice(0, 300) ?? "",
        referer: request.headers.get("referer")?.slice(0, 300) ?? "",
      },
    });

    return NextResponse.json(
      {
        ok: true,
        booking: {
          clinic: clinic.shortName,
          address: clinic.address ?? "",
          phone: clinic.phoneDisplay ?? "",
          date: slotDate,
          time: slotTime,
          timeLabel: formatTime(slotTime),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    // The unique index rejects the loser of a race for the same slot.
    if (error?.code === 11000) {
      return NextResponse.json(
        {
          error: "Sorry, that time has just been taken. Please pick another slot.",
          code: "slot_taken",
        },
        { status: 409 }
      );
    }
    console.error("Failed to create booking:", error);
    return NextResponse.json(
      { error: "Could not complete your booking. Please call the clinic." },
      { status: 500 }
    );
  }
}
