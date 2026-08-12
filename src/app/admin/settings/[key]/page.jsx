import { notFound } from "next/navigation";

import RecordForm from "@/components/admin/RecordForm";
import { getDb } from "@/lib/mongodb";
import { SINGLETONS, collectionNameFor } from "@/lib/contentSchemas";
import { emptyRecord } from "@/lib/contentValidate";
import { getNavigation, getSettings } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { key } = await params;
  return { title: SINGLETONS[key]?.label ?? "Settings" };
}

export default async function SingletonPage({ params }) {
  const { key } = await params;
  const schema = SINGLETONS[key];
  if (!schema) notFound();

  let stored = null;
  try {
    const db = await getDb();
    stored = (await db.collection(collectionNameFor(key)).findOne({ key }))?.value ?? null;
  } catch (error) {
    console.error(`Failed to load ${key}:`, error);
  }

  // Before the first save there is no document — start from whatever the
  // website is currently showing so the form is never blank.
  const current =
    stored ?? (key === "settings" ? await getSettings() : await getNavigation());

  const initial = { ...emptyRecord(schema.fields), ...current };

  return (
    <RecordForm
      typeKey={key}
      mode="singleton"
      schema={{
        label: schema.label,
        singular: schema.label,
        description: schema.description,
        titleField: "name",
        fields: schema.fields,
      }}
      initial={JSON.parse(JSON.stringify(initial))}
      backHref="/admin"
    />
  );
}
