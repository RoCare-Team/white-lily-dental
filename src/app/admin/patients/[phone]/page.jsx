import { notFound } from "next/navigation";

import PatientRecord from "@/components/admin/PatientRecord";
import { getPatient } from "@/lib/patients";
import { getDoctors, getSettings } from "@/lib/content";
import { buildDoctorColours } from "@/lib/doctorColours";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { phone } = await params;
  const patient = await getPatient(phone).catch(() => null);
  return { title: patient?.name ?? "Patient" };
}

export default async function AdminPatientPage({ params }) {
  const { phone } = await params;

  const [patient, settings, doctors] = await Promise.all([
    getPatient(phone),
    getSettings(),
    getDoctors(),
  ]);
  if (!patient) notFound();

  return (
    <PatientRecord
      patient={patient}
      siteName={settings.name}
      doctorColours={buildDoctorColours(doctors)}
    />
  );
}
