import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";

import RecordForm from "@/components/admin/RecordForm";
import { getDb } from "@/lib/mongodb";
import { CONTENT_TYPES, collectionNameFor } from "@/lib/contentSchemas";
import { emptyRecord } from "@/lib/contentValidate";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { key } = await params;
  return { title: `Edit ${CONTENT_TYPES[key]?.singular ?? "record"}` };
}

export default async function EditRecordPage({ params }) {
  const { key, id } = await params;
  const schema = CONTENT_TYPES[key];
  if (!schema || !ObjectId.isValid(id)) notFound();

  const db = await getDb();
  const doc = await db
    .collection(collectionNameFor(key))
    .findOne({ _id: new ObjectId(id) });

  if (!doc) notFound();

  // Merge over a blank record so a field added to the schema after this record
  // was saved still renders with a defined value.
  const { _id, order, createdAt, updatedAt, ...rest } = doc;
  const initial = { ...emptyRecord(schema.fields), ...rest };

  return (
    <RecordForm
      typeKey={key}
      recordId={id}
      schema={{
        label: schema.label,
        singular: schema.singular,
        description: schema.description,
        titleField: schema.titleField,
        fields: schema.fields,
      }}
      initial={JSON.parse(JSON.stringify(initial))}
      backHref={`/admin/content/${key}`}
    />
  );
}
