import { NextResponse } from "next/server";

import { getClinics } from "@/lib/content";
import { getLeads } from "@/lib/mongodb";
import { availableSlots, formatTime, isValidDate } from "@/lib/slots";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Public: which times are still free at a clinic on a date.
 *
 * Availability is computed per request — a slot booked a second ago is gone
 * from the next patient's list.
 */
export async function GET(request) {
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
    const clinics = await getClinics();
    const clinic = clinics.find((item) => item.id === clinicId);
    if (!clinic) {
      return NextResponse.json({ error: "Unknown clinic." }, { status: 404 });
    }

    const leads = await getLeads();
    const taken = await leads
      .find(
        { clinicId, slotDate: date, status: { $ne: "spam" } },
        { projection: { slotTime: 1 } }
      )
      .toArray();

    const slots = availableSlots(
      clinic,
      date,
      taken.map((lead) => lead.slotTime)
    );

    return NextResponse.json({
      clinic: { id: clinic.id, name: clinic.shortName },
      date,
      slots: slots.map((time) => ({ time, label: formatTime(time) })),
    });
  } catch (error) {
    console.error("Failed to load slots:", error);
    return NextResponse.json(
      { error: "Could not load available times." },
      { status: 500 }
    );
  }
}
