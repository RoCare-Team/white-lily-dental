import LeadsBoard from "@/components/admin/LeadsBoard";
import { getLeads } from "@/lib/mongodb";
import { buildLeadFilter, LEADS_PAGE_SIZE, serializeLead } from "@/lib/leads";

export const metadata = { title: "Enquiries" };

// Leads change constantly — never serve this from the cache.
export const dynamic = "force-dynamic";

async function loadLeads(searchParams) {
  const params = new URLSearchParams();
  if (searchParams.status) params.set("status", searchParams.status);
  if (searchParams.q) params.set("q", searchParams.q);

  const page = Math.max(1, Number(searchParams.page) || 1);
  const filter = buildLeadFilter(params);

  const leads = await getLeads();
  const [docs, total, statusCounts] = await Promise.all([
    leads
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * LEADS_PAGE_SIZE)
      .limit(LEADS_PAGE_SIZE)
      .toArray(),
    leads.countDocuments(filter),
    leads.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]).toArray(),
  ]);

  return {
    leads: docs.map(serializeLead),
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / LEADS_PAGE_SIZE)),
    counts: Object.fromEntries(statusCounts.map((s) => [s._id ?? "new", s.count])),
  };
}

export default async function AdminLeadsPage({ searchParams }) {
  const params = (await searchParams) ?? {};

  let data = null;
  let error = null;

  try {
    data = await loadLeads(params);
  } catch (cause) {
    console.error("Admin leads failed to load:", cause);
    error =
      "Could not reach the database. Check MONGODB_URI and that this server's IP is allowed in Atlas → Network Access.";
  }

  return (
    <>
      <h1 className="text-[24px] font-bold tracking-tight text-navy">
        Patient enquiries
      </h1>
      <p className="mt-1.5 text-[14px] text-muted">
        Every appointment request submitted through the website.
      </p>

      {error ? (
        <p
          role="alert"
          className="mt-6 rounded-[12px] border border-coral/30 bg-coral-50 p-4 text-[14px] leading-relaxed text-navy"
        >
          {error}
        </p>
      ) : (
        <LeadsBoard
          initialData={data}
          initialFilters={{ status: params.status ?? "", q: params.q ?? "" }}
        />
      )}
    </>
  );
}
