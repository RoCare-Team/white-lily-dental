import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/adminSession";
import { getDb } from "@/lib/mongodb";
import {
  CONTENT_TYPES,
  SINGLETONS,
  collectionNameFor,
  REVALIDATE_TAG,
} from "@/lib/contentSchemas";
import { validateRecord } from "@/lib/contentValidate";
import { iconNameOf } from "@/lib/icons";

import { services } from "@/data/services";
import { doctors } from "@/data/doctors";
import { clinics } from "@/data/clinics";
import { posts } from "@/data/blog";
import { plans } from "@/data/plans";
import { testimonials } from "@/data/testimonials";
import { homeFaqs } from "@/data/faqs";
import { associations } from "@/data/associations";
import { navLinks, quickLinks } from "@/data/nav";
import { site } from "@/data/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Turns a label into the identifier the schema expects. */
function slugify(value, fallback) {
  const slug = String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return slug || fallback;
}

/** Source rows, with identifiers filled in for the types that lacked them. */
function sourceRows() {
  return {
    services: services.map((service) => ({
      ...service,
      icon: iconNameOf(service.icon),
    })),
    doctors,
    clinics,
    posts,
    plans,
    testimonials: testimonials.map((row, index) => ({
      ...row,
      id: slugify(row.name, `testimonial-${index + 1}`),
    })),
    faqs: homeFaqs.map((row, index) => ({
      ...row,
      id: slugify(row.q, `faq-${index + 1}`),
    })),
    associations: associations.map((row, index) => ({
      ...row,
      id: slugify(row.abbr || row.name, `association-${index + 1}`),
    })),
  };
}

/**
 * Copies the built-in content into MongoDB so it can be edited.
 *
 * Safe to run more than once: a collection that already holds records is left
 * untouched unless `?force=1` is passed, which replaces it wholesale.
 */
export async function POST(request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const force = new URL(request.url).searchParams.get("force") === "1";
  const rows = sourceRows();
  const report = {};

  try {
    const db = await getDb();

    for (const [key, schema] of Object.entries(CONTENT_TYPES)) {
      const collection = db.collection(collectionNameFor(key));
      const existing = await collection.countDocuments({});

      if (existing > 0 && !force) {
        report[key] = `skipped (${existing} already there)`;
        continue;
      }

      const now = new Date();
      const documents = [];

      for (const [index, row] of (rows[key] ?? []).entries()) {
        const parsed = validateRecord(schema, row);
        if (!parsed.ok) {
          report[key] = `failed: ${parsed.error}`;
          break;
        }
        documents.push({
          ...parsed.value,
          order: index,
          createdAt: now,
          updatedAt: now,
        });
      }

      if (typeof report[key] === "string") continue;

      if (documents.length) {
        if (existing > 0) await collection.deleteMany({});
        await collection.insertMany(documents);
      }
      report[key] = `imported ${documents.length}`;
    }

    const singletonValues = {
      settings: site,
      navigation: { navLinks, quickLinks },
    };

    for (const [key, schema] of Object.entries(SINGLETONS)) {
      const collection = db.collection(collectionNameFor(key));
      const existing = await collection.findOne({ key });

      if (existing && !force) {
        report[key] = "skipped (already there)";
        continue;
      }

      const parsed = validateRecord(schema, singletonValues[key]);
      if (!parsed.ok) {
        report[key] = `failed: ${parsed.error}`;
        continue;
      }

      await collection.updateOne(
        { key },
        { $set: { key, value: parsed.value, updatedAt: new Date() } },
        { upsert: true }
      );
      report[key] = "imported";
    }

    revalidateTag(REVALIDATE_TAG);
    return NextResponse.json({ ok: true, report });
  } catch (error) {
    console.error("Seed failed:", error);
    return NextResponse.json(
      { error: `Seed failed: ${error.message}`, report },
      { status: 500 }
    );
  }
}
