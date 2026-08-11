import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/adminSession";
import { getDb } from "@/lib/mongodb";
import {
  SINGLETONS,
  collectionNameFor,
  REVALIDATE_TAG,
} from "@/lib/contentSchemas";
import { validateRecord } from "@/lib/contentValidate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function schemaFor(key) {
  return Object.prototype.hasOwnProperty.call(SINGLETONS, key)
    ? SINGLETONS[key]
    : null;
}

export async function PUT(request, { params }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { key } = await params;
  const schema = schemaFor(key);
  if (!schema) {
    return NextResponse.json({ error: "Unknown settings group." }, { status: 404 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Singletons have no identity field, so validateRecord only coerces here.
  const parsed = validateRecord(schema, body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const db = await getDb();
    await db
      .collection(collectionNameFor(key))
      .updateOne(
        { key },
        { $set: { key, value: parsed.value, updatedAt: new Date() } },
        { upsert: true }
      );

    revalidateTag(REVALIDATE_TAG);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(`Failed to save ${key}:`, error);
    return NextResponse.json({ error: "Could not save." }, { status: 500 });
  }
}
