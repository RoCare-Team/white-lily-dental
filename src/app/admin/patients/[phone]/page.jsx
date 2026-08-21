import { notFound } from "next/navigation";

import PatientRecord from "@/components/admin/PatientRecord";
import { getPatient } from "@/lib/patients";
import { getSettings } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { phone } = await params;
  const patient = await getPatient(phone).catch(() => null);
  return { title: patient?.name ?? "Patient" };
}

export default async function AdminPatientPage({ params }) {
  const { phone } = await params;

  const [patient, settings] = await Promise.all([getPatient(phone), getSettings()]);
  if (!patient) notFound();

  return <PatientRecord patient={patient} siteName={settings.name} />;
}
