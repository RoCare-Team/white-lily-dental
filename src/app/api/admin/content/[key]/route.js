import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/adminSession";
import { getDb } from "@/lib/mongodb";
import {
  CONTENT_TYPES,
  collectionNameFor,
  REVALIDATE_TAG,
} from "@/lib/contentSchemas";
import { validateRecord } from "@/lib/contentValidate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Resolves the schema for a URL segment, or null if it is not a content type. */
function schemaFor(key) {
  return Object.prototype.hasOwnProperty.call(CONTENT_TYPES, key)
    ? CONTENT_TYPES[key]
    : null;
}

export async function GET(_request, { params }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { key } = await params;
  const schema = schemaFor(key);
  if (!schema) {
    return NextResponse.json({ error: "Unknown content type." }, { status: 404 });
  }

  try {
    const db = await getDb();
    const rows = await db
      .collection(collectionNameFor(key))
      .find({})
      .sort({ order: 1, _id: 1 })
      .toArray();

    return NextResponse.json({
      items: rows.map(({ _id, ...rest }) => ({ ...rest, _id: String(_id) })),
    });
  } catch (error) {
    console.error(`Failed to list ${key}:`, error);
    return NextResponse.json({ error: "Could not load content." }, { status: 500 });
  }
}

/** Create a new record. */
export async function POST(request, { params }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { key } = await params;
  const schema = schemaFor(key);
  if (!schema) {
    return NextResponse.json({ error: "Unknown content type." }, { status: 404 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = validateRecord(schema, body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const db = await getDb();
    const collection = db.collection(collectionNameFor(key));

    const identity = schema.identity;
    if (identity) {
      const clash = await collection.findOne({ [identity]: parsed.value[identity] });
      if (clash) {
        return NextResponse.json(
          {
            error: `Another ${schema.singular.toLowerCase()} already uses that identifier.`,
          },
          { status: 409 }
        );
      }
    }

    // New records go to the end of the list.
    const last = await collection.find({}).sort({ order: -1 }).limit(1).next();

    const now = new Date();
    const result = await collection.insertOne({
      ...parsed.value,
      order: (last?.order ?? -1) + 1,
      createdAt: now,
      updatedAt: now,
    });

    revalidateTag(REVALIDATE_TAG);
    return NextResponse.json({ id: String(result.insertedId) }, { status: 201 });
  } catch (error) {
    console.error(`Failed to create ${key}:`, error);
    return NextResponse.json({ error: "Could not save." }, { status: 500 });
  }
}

/** Reorder — body is `{ ids: [...] }` in the new display order. */
export async function PUT(request, { params }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { key } = await params;
  const schema = schemaFor(key);
  if (!schema) {
    return NextResponse.json({ error: "Unknown content type." }, { status: 404 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const ids = Array.isArray(body?.ids) ? body.ids : null;
  if (!ids) {
    return NextResponse.json({ error: "Expected a list of ids." }, { status: 400 });
  }

  try {
    const { ObjectId } = await import("mongodb");
    const db = await getDb();
    const collection = db.collection(collectionNameFor(key));

    const operations = ids
      .filter((id) => ObjectId.isValid(id))
      .map((id, index) => ({
        updateOne: {
          filter: { _id: new ObjectId(id) },
          update: { $set: { order: index } },
        },
      }));

    if (operations.length) await collection.bulkWrite(operations);

    revalidateTag(REVALIDATE_TAG);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(`Failed to reorder ${key}:`, error);
    return NextResponse.json({ error: "Could not reorder." }, { status: 500 });
  }
}
