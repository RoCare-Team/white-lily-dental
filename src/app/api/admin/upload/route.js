import { GridFSBucket } from "mongodb";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/adminSession";
import { getDb } from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 5 * 1024 * 1024;

const ALLOWED = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

/**
 * Stores an uploaded image in GridFS and returns the URL to reference it by.
 *
 * Images live in MongoDB rather than on disk because the site runs on a
 * read-only filesystem in production — no external storage service needed.
 */
export async function POST(request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let form;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }

  const file = form.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file was selected." }, { status: 400 });
  }

  const extension = ALLOWED[file.type];
  if (!extension) {
    return NextResponse.json(
      { error: "Please upload a JPG, PNG, WebP, AVIF, GIF or SVG image." },
      { status: 415 }
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "That image is larger than 5 MB. Please compress it and try again." },
      { status: 413 }
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const db = await getDb();
    const bucket = new GridFSBucket(db, { bucketName: "images" });

    const safeName = (file.name || `image.${extension}`)
      .replace(/[^\w.-]+/g, "-")
      .slice(-80);

    const id = await new Promise((resolve, reject) => {
      // The driver no longer persists the `contentType` option on the files
      // document, so keep our own copy in metadata for the serving route.
      const stream = bucket.openUploadStream(safeName, {
        contentType: file.type,
        metadata: { uploadedAt: new Date(), contentType: file.type },
      });
      stream.on("error", reject);
      stream.on("finish", () => resolve(stream.id));
      stream.end(buffer);
    });

    return NextResponse.json({ url: `/api/images/${id}`, name: safeName }, { status: 201 });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json({ error: "Could not store the image." }, { status: 500 });
  }
}
