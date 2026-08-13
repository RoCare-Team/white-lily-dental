import LeadsBoard from "@/components/admin/LeadsBoard";
import PageTitle from "@/components/admin/PageTitle";
import { loadLeadPage } from "@/lib/loadLeads";

export const metadata = { title: "Plan enquiries" };
export const dynamic = "force-dynamic";

export default async function AdminPlanEnquiriesPage({ searchParams }) {
  const params = (await searchParams) ?? {};

  let data = null;
  let error = null;

  try {
    data = await loadLeadPage(params, "plan");
  } catch (cause) {
    console.error("Admin plan enquiries failed to load:", cause);
    error =
      "Could not reach the database. Check MONGODB_URI and that this server's IP is allowed in Atlas → Network Access.";
  }

  return (
    <>
      <PageTitle
        title="Dental plan enquiries"
        subtitle="Patients asking about the annual family packages, with the plan they picked."
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
          kind="plan"
          basePath="/admin/plan-enquiries"
          initialData={data}
          initialFilters={{ status: params.status ?? "", q: params.q ?? "" }}
        />
      )}
    </>
  );
}
