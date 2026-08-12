import LeadsBoard from "@/components/admin/LeadsBoard";
import PageTitle from "@/components/admin/PageTitle";
import { loadLeadPage } from "@/lib/loadLeads";

export const metadata = { title: "Appointments" };
export const dynamic = "force-dynamic";

export default async function AdminAppointmentsPage({ searchParams }) {
  const params = (await searchParams) ?? {};

  let data = null;
  let error = null;

  try {
    data = await loadLeadPage(params, "appointment");
  } catch (cause) {
    console.error("Admin appointments failed to load:", cause);
    error =
      "Could not reach the database. Check MONGODB_URI and that this server's IP is allowed in Atlas → Network Access.";
  }

  return (
    <>
      <PageTitle
        title="Appointments"
        subtitle="Slots patients have reserved through the booking wizard, in clinic order."
      />

      {error ? (
        <p
          role="alert"
          className="mt-6 rounded-[12px] border border-coral/30 bg-coral-50 p-4 text-[14px] leading-relaxed text-navy"
        >
          {error}
        </p>
      ) : (
        <LeadsBoard
          kind="appointment"
          basePath="/admin/appointments"
          initialData={data}
          initialFilters={{
            status: params.status ?? "",
            q: params.q ?? "",
            when: params.when ?? "upcoming",
          }}
        />
      )}
    </>
  );
}
