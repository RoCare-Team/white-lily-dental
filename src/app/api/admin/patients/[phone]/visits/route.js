import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/adminSession";
import { serializeVisit } from "@/lib/records";
import { phoneParam, resolveVisit } from "@/lib/visitStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Open a visit on a patient's file — the "when did the patient visit happen?"
 * step. Sent an appointment it reuses that appointment's visit instead of
 * making a second one, so charting a booking twice is not two visits.
 */
export async function POST(request, { params }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { phone } = await params;
  const digits = phoneParam(phone);
  if (!digits) return NextResponse.json({ error: "Invalid patient." }, { status: 400 });

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  try {
    const { visit, error, status } = await resolveVisit(digits, body);
    if (error) return NextResponse.json({ error }, { status });
    return NextResponse.json({ visit: serializeVisit(visit) }, { status: 201 });
  } catch (error) {
    console.error("Failed to open a visit:", error);
    return NextResponse.json({ error: "Could not open this visit." }, { status: 500 });
  }
}
