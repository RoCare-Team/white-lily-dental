import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/adminSession";
import { getRecords } from "@/lib/mongodb";
import { parseRecord, RECORD_KIND_VALUES, serializeRecord } from "@/lib/records";
import { phoneParam, resolveVisit } from "@/lib/visitStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Add one record — vitals, a note, a prescription — to a visit. */
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

  if (!RECORD_KIND_VALUES.includes(body?.kind)) {
    return NextResponse.json({ error: "Unknown record type." }, { status: 400 });
  }

  const parsed = parseRecord(body.kind, body.data);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  try {
    // The visit is resolved after the record is known to be valid, so a form
    // abandoned at the last moment cannot leave an empty visit behind.
    const { visit, error, status } = await resolveVisit(digits, body);
    if (error) return NextResponse.json({ error }, { status });

    const records = await getRecords();
    const now = new Date();
    const doc = {
      visitId: visit._id,
      phoneDigits: digits,
      kind: body.kind,
      data: parsed.data,
      createdAt: now,
      updatedAt: now,
    };

    const { insertedId } = await records.insertOne(doc);
    return NextResponse.json(
      { record: serializeRecord({ ...doc, _id: insertedId }), visitId: String(visit._id) },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to add a record:", error);
    return NextResponse.json({ error: "Could not save this record." }, { status: 500 });
  }
}
