import LeadsBoard from "@/components/admin/LeadsBoard";
import PageTitle from "@/components/admin/PageTitle";
import { loadLeadPage } from "@/lib/loadLeads";
import { getSettings } from "@/lib/content";

export const metadata = { title: "Enquiries" };

// Leads change constantly — never serve this from the cache.
export const dynamic = "force-dynamic";

export default async function AdminLeadsPage({ searchParams }) {
  const params = (await searchParams) ?? {};
  // Used to sign the ready-made WhatsApp reply.
  const settings = await getSettings();

  let data = null;
  let error = null;

  try {
    data = await loadLeadPage(params, "enquiry");
  } catch (cause) {
    console.error("Admin enquiries failed to load:", cause);
    error =
      "Could not reach the database. Check MONGODB_URI and that this server's IP is allowed in Atlas → Network Access.";
  }

  return (
    <>
      <PageTitle
        title="Patient enquiries"
        subtitle="Contact and treatment enquiries — appointments with a booked slot live under Appointments."
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
          kind="enquiry"
          siteName={settings.name}
          basePath="/admin/leads"
          initialData={data}
          initialFilters={{ status: params.status ?? "", q: params.q ?? "" }}
        />
      )}
    </>
  );
}
