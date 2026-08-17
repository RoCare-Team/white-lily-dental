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

  // Opening a lead marks it read. Only ever set once, so the badge counts
  // "never looked at", not "not looked at recently".
  const markSeen = body?.seen === true;
  if (markSeen) update.seenAt = new Date();

  if (
    update.status === undefined &&
    update.notes === undefined &&
    !markSeen
  ) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  try {
    const leads = await getLeads();
    // $min keeps the earliest value, so re-opening a lead never rewrites when
    // it was first read. On a missing field it simply sets it.
    const { seenAt, ...always } = update;
    const operations = { $set: always };
    if (seenAt) operations.$min = { seenAt };

    const doc = await leads.findOneAndUpdate({ _id }, operations, {
      returnDocument: "after",
    });
    if (!doc) return NextResponse.json({ error: "Lead not found." }, { status: 404 });
    return NextResponse.json({ lead: serializeLead(doc) });
  } catch (error) {
    // Un-cancelling only works while the slot is still free — the unique index
    // is what says no, and it deserves a human explanation.
    if (error?.code === 11000) {
      return NextResponse.json(
        {
          error:
            "That slot has already been booked by another patient, so this appointment cannot be restored. Cancel the other booking first, or book this patient a different time.",
        },
        { status: 409 }
      );
    }
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
