import { notFound } from "next/navigation";

import RecordForm from "@/components/admin/RecordForm";
import { CONTENT_TYPES } from "@/lib/contentSchemas";
import { emptyRecord } from "@/lib/contentValidate";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { key } = await params;
  return { title: `New ${CONTENT_TYPES[key]?.singular ?? "record"}` };
}

export default async function NewRecordPage({ params }) {
  const { key } = await params;
  const schema = CONTENT_TYPES[key];
  if (!schema) notFound();

  return (
    <RecordForm
      typeKey={key}
      schema={{
        label: schema.label,
        singular: schema.singular,
        description: schema.description,
        titleField: schema.titleField,
        fields: schema.fields,
      }}
      initial={emptyRecord(schema.fields)}
      backHref={`/admin/content/${key}`}
    />
  );
}
