import { notFound } from "next/navigation";

import ContentList from "@/components/admin/ContentList";
import { getDb } from "@/lib/mongodb";
import { CONTENT_TYPES, collectionNameFor } from "@/lib/contentSchemas";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { key } = await params;
  return { title: CONTENT_TYPES[key]?.label ?? "Content" };
}

export default async function ContentListPage({ params }) {
  const { key } = await params;
  const schema = CONTENT_TYPES[key];
  if (!schema) notFound();

  let items = [];
  let error = null;

  try {
    const db = await getDb();
    const rows = await db
      .collection(collectionNameFor(key))
      .find({})
      .sort({ order: 1, _id: 1 })
      .toArray();
    items = rows.map(({ _id, ...rest }) => ({ ...rest, _id: String(_id) }));
  } catch (cause) {
    console.error(`Failed to load ${key}:`, cause);
    error = "Could not reach the database.";
  }

  if (error) {
    return (
      <>
        <h1 className="text-[24px] font-bold tracking-tight text-navy">
          {schema.label}
        </h1>
        <p
          role="alert"
          className="mt-6 rounded-[12px] border border-coral/30 bg-coral-50 p-4 text-[14px] text-navy"
        >
          {error}
        </p>
      </>
    );
  }

  // Only the plain parts of the schema cross into the client component.
  const clientSchema = {
    label: schema.label,
    singular: schema.singular,
    description: schema.description,
    titleField: schema.titleField,
    subtitleField: schema.subtitleField,
    ordered: Boolean(schema.ordered),
    // The first image field, if any, becomes the row thumbnail.
    imageField: schema.fields.find((field) => field.type === "image")?.name ?? null,
  };

  return <ContentList typeKey={key} schema={clientSchema} items={items} />;
}
