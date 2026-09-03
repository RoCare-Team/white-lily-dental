import LeadsBoard from "@/components/admin/LeadsBoard";
import PageTitle from "@/components/admin/PageTitle";
import { loadLeadPage } from "@/lib/loadLeads";
import { getSettings } from "@/lib/content";


export const metadata = { title: "Clients" };

// Leads change constantly — never serve this from the cache.
export const dynamic = "force-dynamic";

/**
 * Everyone whose enquiry actually turned into treatment. A lead lands here the
 * moment it is marked Complete, which is also what clears it out of the inbox
 * it came from — so the inboxes stay a list of what is still open, and this is
 * the record of what came of them.
 */
export default async function AdminClientsPage({ searchParams }) {
  const params = (await searchParams) ?? {};
  // Used to sign the ready-made WhatsApp reply.
  const settings = await getSettings();

  let data = null;
  let error = null;

  try {
    data = await loadLeadPage(params, "clients");
  } catch (cause) {
    console.error("Admin clients failed to load:", cause);
    error =
      "Could not reach the database. Check MONGODB_URI and that this server's IP is allowed in Atlas → Network Access.";
  }

  return (
    <>
      <PageTitle
        title="Clients"
        subtitle="Leads you have marked Complete. Setting one back to any other status returns it to the list it came from."
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
          kind="clients"
          siteName={settings.name}
          basePath="/admin/clients"
          initialData={data}
          initialFilters={{
            status: params.status ?? "",
            q: params.q ?? "",
            type: params.type ?? "",
            when: params.when ?? "all",
          }}
        />
      )}
    </>
  );
}
