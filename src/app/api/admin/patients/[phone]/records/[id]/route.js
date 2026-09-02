import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/adminSession";
import { getRecords } from "@/lib/mongodb";
import { parseRecord, serializeRecord } from "@/lib/records";
import { phoneParam, toObjectId } from "@/lib/visitStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Both handlers match on the patient as well as the id, so a record can only
    ever be reached through the file it belongs to. */
async function locate(params) {
  const { phone, id } = await params;
  const digits = phoneParam(phone);
  const _id = toObjectId(id);
  if (!digits || !_id) return null;
  return { filter: { _id, phoneDigits: digits } };
}

export async function PATCH(request, { params }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const found = await locate(params);
  if (!found) return NextResponse.json({ error: "Invalid record." }, { status: 400 });

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  try {
    const records = await getRecords();
    const existing = await records.findOne(found.filter);
    if (!existing) {
      return NextResponse.json({ error: "Record not found." }, { status: 404 });
    }

    // The kind is fixed at creation: a prescription cannot become an X-ray.
    const parsed = parseRecord(existing.kind, body?.data);
    if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

    const doc = await records.findOneAndUpdate(
      found.filter,
      { $set: { data: parsed.data, updatedAt: new Date() } },
      { returnDocument: "after" }
    );

    return NextResponse.json({ record: serializeRecord(doc) });
  } catch (error) {
    console.error("Failed to update a record:", error);
    return NextResponse.json({ error: "Could not save this record." }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const found = await locate(params);
  if (!found) return NextResponse.json({ error: "Invalid record." }, { status: 400 });

  try {
    const records = await getRecords();
    const { deletedCount } = await records.deleteOne(found.filter);
    if (!deletedCount) {
      return NextResponse.json({ error: "Record not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete a record:", error);
    return NextResponse.json({ error: "Could not delete this record." }, { status: 500 });
  }
}
