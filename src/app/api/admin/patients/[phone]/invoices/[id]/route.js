import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/adminSession";
import { getInvoices } from "@/lib/mongodb";
import { parseInvoice, serializeInvoice } from "@/lib/records";
import { phoneParam, toObjectId } from "@/lib/visitStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function locate(params) {
  const { phone, id } = await params;
  const digits = phoneParam(phone);
  const _id = toObjectId(id);
  if (!digits || !_id) return null;
  return { _id, phoneDigits: digits };
}

/** Edit a bill, or record a payment against it. */
export async function PATCH(request, { params }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const filter = await locate(params);
  if (!filter) return NextResponse.json({ error: "Invalid bill." }, { status: 400 });

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = parseInvoice(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  try {
    const invoices = await getInvoices();
    const doc = await invoices.findOneAndUpdate(
      filter,
      { $set: { ...parsed.invoice, updatedAt: new Date() } },
      { returnDocument: "after" }
    );

    if (!doc) return NextResponse.json({ error: "Bill not found." }, { status: 404 });
    return NextResponse.json({ invoice: serializeInvoice(doc) });
  } catch (error) {
    console.error("Failed to update an invoice:", error);
    return NextResponse.json({ error: "Could not save this bill." }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const filter = await locate(params);
  if (!filter) return NextResponse.json({ error: "Invalid bill." }, { status: 400 });

  try {
    const invoices = await getInvoices();
    const { deletedCount } = await invoices.deleteOne(filter);
    if (!deletedCount) {
      return NextResponse.json({ error: "Bill not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete an invoice:", error);
    return NextResponse.json({ error: "Could not delete this bill." }, { status: 500 });
  }
}
