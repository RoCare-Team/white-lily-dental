import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/adminSession";
import { getInvoices } from "@/lib/mongodb";
import { parseInvoice, serializeInvoice } from "@/lib/records";
import { phoneParam, resolveVisit } from "@/lib/visitStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * The next invoice number: one past the highest already issued.
 *
 * Read rather than kept in a counter, so there is one less thing to keep in
 * step with the invoices themselves. Deleting the newest bill does hand its
 * number to the next one, which is the right behaviour for a bill raised and
 * cancelled in the same breath.
 */
async function nextNumber(invoices) {
  const [last] = await invoices
    .find({}, { projection: { number: 1 } })
    .sort({ createdAt: -1 })
    .limit(1)
    .toArray();

  const previous = Number(String(last?.number ?? "").match(/(\d+)$/)?.[1] ?? 0);
  return `WL-${String(previous + 1).padStart(4, "0")}`;
}

/** Raise a bill against a visit. */
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

  const parsed = parseInvoice(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  try {
    const { visit, error, status } = await resolveVisit(digits, body);
    if (error) return NextResponse.json({ error }, { status });

    const invoices = await getInvoices();
    const now = new Date();
    const doc = {
      visitId: visit._id,
      phoneDigits: digits,
      number: await nextNumber(invoices),
      ...parsed.invoice,
      createdAt: now,
      updatedAt: now,
    };

    const { insertedId } = await invoices.insertOne(doc);
    return NextResponse.json(
      {
        invoice: serializeInvoice({ ...doc, _id: insertedId }),
        visitId: String(visit._id),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to raise an invoice:", error);
    return NextResponse.json({ error: "Could not save this bill." }, { status: 500 });
  }
}
