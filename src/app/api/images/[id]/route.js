import { Readable } from "node:stream";

import { GridFSBucket, ObjectId } from "mongodb";

import { getDb } from "@/lib/mongodb";

export const runtime = "nodejs";

/**
 * Serves an uploaded image out of GridFS.
 *
 * Public by design — these are website images. Ids are immutable, so the
 * response is cached hard; replacing an image creates a new id.
 */
export async function GET(_request, { params }) {
  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const db = await getDb();
    const bucket = new GridFSBucket(db, { bucketName: "images" });
    const _id = new ObjectId(id);

    const file = await db.collection("images.files").findOne({ _id });
    if (!file) return new Response("Not found", { status: 404 });

    const stream = Readable.toWeb(bucket.openDownloadStream(_id));

    return new Response(stream, {
      headers: {
        "Content-Type":
          file.metadata?.contentType ?? file.contentType ?? "application/octet-stream",
        "Content-Length": String(file.length),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Failed to serve image:", error);
    return new Response("Server error", { status: 500 });
  }
}
