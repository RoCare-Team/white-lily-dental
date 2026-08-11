import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/adminSession";
import { getLeads } from "@/lib/mongodb";
import { LEAD_STATUS_VALUES, serializeLead } from "@/lib/leads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function toObjectId(id) {
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

/** Update a lead's status or internal notes. */
export async function PATCH(request, { params }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const _id = toObjectId(id);
  if (!_id) return NextResponse.json({ error: "Invalid id." }, { status: 400 });

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const update = { updatedAt: new Date() };

  if (body?.status !== undefined) {
    if (!LEAD_STATUS_VALUES.includes(body.status)) {
      return NextResponse.json({ error: "Unknown status." }, { status: 400 });
    }
    update.status = body.status;
  }

  if (body?.notes !== undefined) {
    update.notes = String(body.notes).slice(0, 2000);
  }

  if (update.status === undefined && update.notes === undefined) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  try {
    const leads = await getLeads();
    const doc = await leads.findOneAndUpdate(
      { _id },
      { $set: update },
      { returnDocument: "after" }
    );
    if (!doc) return NextResponse.json({ error: "Lead not found." }, { status: 404 });
    return NextResponse.json({ lead: serializeLead(doc) });
  } catch (error) {
    console.error("Failed to update lead:", error);
    return NextResponse.json({ error: "Could not update lead." }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const _id = toObjectId(id);
  if (!_id) return NextResponse.json({ error: "Invalid id." }, { status: 400 });

  try {
    const leads = await getLeads();
    const { deletedCount } = await leads.deleteOne({ _id });
    if (!deletedCount) {
      return NextResponse.json({ error: "Lead not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete lead:", error);
    return NextResponse.json({ error: "Could not delete lead." }, { status: 500 });
  }
}
