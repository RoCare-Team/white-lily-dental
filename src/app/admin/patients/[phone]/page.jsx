import { notFound } from "next/navigation";

import PatientRecord from "@/components/admin/PatientRecord";
import { getPatient } from "@/lib/patients";
import { getDoctors, getServices, getSettings } from "@/lib/content";
import { buildDoctorColours } from "@/lib/doctorColours";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { phone } = await params;
  const patient = await getPatient(phone).catch(() => null);
  return { title: patient?.name ?? "Patient" };
}

export default async function AdminPatientPage({ params }) {
  const { phone } = await params;

  const [patient, settings, doctors, services] = await Promise.all([
    getPatient(phone),
    getSettings(),
    getDoctors(),
    getServices(),
  ]);
  if (!patient) notFound();

  return (
    <PatientRecord
      patient={patient}
      siteName={settings.name}
      doctorColours={buildDoctorColours(doctors)}
      // The pickers the charting and billing forms offer: who could have seen
      // the patient, and what the clinic actually does.
      doctors={doctors.map((doctor) => doctor.name).filter(Boolean)}
      treatments={services.map((service) => service.title).filter(Boolean)}
    />
  );
}
