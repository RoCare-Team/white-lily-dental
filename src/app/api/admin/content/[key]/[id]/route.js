import { ObjectId } from "mongodb";
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

async function resolve(params) {
  const { key, id } = await params;
  const schema = Object.prototype.hasOwnProperty.call(CONTENT_TYPES, key)
    ? CONTENT_TYPES[key]
    : null;

  if (!schema) return { error: NextResponse.json({ error: "Unknown content type." }, { status: 404 }) };
  if (!ObjectId.isValid(id)) return { error: NextResponse.json({ error: "Invalid id." }, { status: 400 }) };

  return { key, schema, _id: new ObjectId(id) };
}

export async function GET(_request, { params }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const resolved = await resolve(params);
  if (resolved.error) return resolved.error;

  try {
    const db = await getDb();
    const doc = await db
      .collection(collectionNameFor(resolved.key))
      .findOne({ _id: resolved._id });

    if (!doc) return NextResponse.json({ error: "Not found." }, { status: 404 });

    const { _id, ...rest } = doc;
    return NextResponse.json({ item: { ...rest, _id: String(_id) } });
  } catch (error) {
    console.error("Failed to load record:", error);
    return NextResponse.json({ error: "Could not load." }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const resolved = await resolve(params);
  if (resolved.error) return resolved.error;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = validateRecord(resolved.schema, body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const db = await getDb();
    const collection = db.collection(collectionNameFor(resolved.key));

    const identity = resolved.schema.identity;
    if (identity) {
      const clash = await collection.findOne({
        [identity]: parsed.value[identity],
        _id: { $ne: resolved._id },
      });
      if (clash) {
        return NextResponse.json(
          { error: "Another record already uses that identifier." },
          { status: 409 }
        );
      }
    }

    const result = await collection.updateOne(
      { _id: resolved._id },
      { $set: { ...parsed.value, updatedAt: new Date() } }
    );
    if (!result.matchedCount) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    revalidateTag(REVALIDATE_TAG);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to update record:", error);
    return NextResponse.json({ error: "Could not save." }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const resolved = await resolve(params);
  if (resolved.error) return resolved.error;

  try {
    const db = await getDb();
    const collection = db.collection(collectionNameFor(resolved.key));

    // The public site falls back to the built-in content when a collection is
    // empty, so deleting the last record would silently resurrect the old copy.
    const remaining = await collection.countDocuments({});
    if (remaining <= 1) {
      return NextResponse.json(
        {
          error:
            "This is the last record — the website cannot show an empty section. Add a replacement first, then delete this one.",
        },
        { status: 409 }
      );
    }

    const { deletedCount } = await collection.deleteOne({ _id: resolved._id });
    if (!deletedCount) return NextResponse.json({ error: "Not found." }, { status: 404 });

    revalidateTag(REVALIDATE_TAG);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete record:", error);
    return NextResponse.json({ error: "Could not delete." }, { status: 500 });
  }
}
