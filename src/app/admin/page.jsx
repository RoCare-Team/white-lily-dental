import Link from "next/link";
import { ArrowRight, Inbox } from "lucide-react";

import SeedPrompt from "@/components/admin/SeedPrompt";
import { getDb, getLeads } from "@/lib/mongodb";
import { CONTENT_TYPES, collectionNameFor } from "@/lib/contentSchemas";

export const metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

async function loadOverview() {
  const db = await getDb();

  const counts = Object.fromEntries(
    await Promise.all(
      Object.keys(CONTENT_TYPES).map(async (key) => [
        key,
        await db.collection(collectionNameFor(key)).countDocuments({}),
      ])
    )
  );

  const leads = await getLeads();
  const [totalLeads, newLeads, recent] = await Promise.all([
    leads.countDocuments({}),
    leads.countDocuments({ status: "new" }),
    leads.find({}).sort({ createdAt: -1 }).limit(5).toArray(),
  ]);

  return {
    counts,
    totalLeads,
    newLeads,
    recent: recent.map((lead) => ({
      id: String(lead._id),
      name: lead.name ?? "",
      treatment: lead.treatment ?? "",
      createdAt: lead.createdAt ? new Date(lead.createdAt).toISOString() : null,
    })),
    seeded: Object.values(counts).some((count) => count > 0),
  };
}

export default async function AdminDashboardPage() {
  let data = null;
  let error = null;

  try {
    data = await loadOverview();
  } catch (cause) {
    console.error("Dashboard failed to load:", cause);
    error =
      "Could not reach the database. Check MONGODB_URI and that this server's IP is allowed in Atlas → Network Access.";
  }

  if (error) {
    return (
      <>
        <h1 className="text-[24px] font-bold tracking-tight text-navy">Dashboard</h1>
        <p
          role="alert"
          className="mt-6 rounded-[12px] border border-coral/30 bg-coral-50 p-4 text-[14px] leading-relaxed text-navy"
        >
          {error}
        </p>
      </>
    );
  }

  return (
    <>
      <h1 className="text-[24px] font-bold tracking-tight text-navy">Dashboard</h1>
      <p className="mt-1.5 text-[14px] text-muted">
        Everything on the website can be edited from here.
      </p>

      {!data.seeded ? <SeedPrompt /> : null}

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total enquiries" value={data.totalLeads} href="/admin/leads" />
        <StatCard
          label="New enquiries"
          value={data.newLeads}
          href="/admin/leads?status=new"
          highlight
        />
        <StatCard
          label="Services"
          value={data.counts.services ?? 0}
          href="/admin/content/services"
        />
        <StatCard
          label="Blog posts"
          value={data.counts.posts ?? 0}
          href="/admin/content/posts"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-[14px] border border-line bg-white p-5">
          <h2 className="text-[16px] font-bold text-navy">Website content</h2>
          <p className="mt-1 text-[13.5px] text-muted">
            Edit any section of the public site.
          </p>
          <ul className="mt-4 divide-y divide-line/70">
            {Object.entries(CONTENT_TYPES).map(([key, schema]) => (
              <li key={key}>
                <Link
                  href={`/admin/content/${key}`}
                  className="group flex items-center justify-between gap-4 py-2.5 text-[14px]"
                >
                  <span className="font-medium text-navy group-hover:text-brand">
                    {schema.label}
                  </span>
                  <span className="flex items-center gap-2 text-muted">
                    {data.counts[key] ?? 0}
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-[14px] border border-line bg-white p-5">
          <h2 className="text-[16px] font-bold text-navy">Latest enquiries</h2>
          <p className="mt-1 text-[13.5px] text-muted">
            The five most recent appointment requests.
          </p>

          {data.recent.length === 0 ? (
            <div className="mt-6 flex flex-col items-center gap-2 py-8 text-center">
              <Inbox className="h-7 w-7 text-muted/60" aria-hidden="true" />
              <p className="text-[13.5px] text-muted">No enquiries yet.</p>
            </div>
          ) : (
            <>
              <ul className="mt-4 divide-y divide-line/70">
                {data.recent.map((lead) => (
                  <li key={lead.id} className="flex justify-between gap-4 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-medium text-navy">
                        {lead.name}
                      </p>
                      <p className="truncate text-[13px] text-muted">
                        {lead.treatment || "General enquiry"}
                      </p>
                    </div>
                    <p className="shrink-0 text-[12.5px] text-muted">
                      {lead.createdAt
                        ? new Date(lead.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                          })
                        : ""}
                    </p>
                  </li>
                ))}
              </ul>
              <Link
                href="/admin/leads"
                className="mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-brand hover:text-brand-dark"
              >
                View all enquiries
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </>
          )}
        </section>
      </div>
    </>
  );
}

function StatCard({ label, value, href, highlight }) {
  return (
    <Link
      href={href}
      className={`rounded-[12px] border p-4 transition-colors ${
        highlight && value > 0
          ? "border-brand/40 bg-brand-50 hover:border-brand"
          : "border-line bg-white hover:border-brand"
      }`}
    >
      <p className="text-[26px] font-bold leading-none text-navy">{value}</p>
      <p className="mt-1.5 text-[12.5px] text-muted">{label}</p>
    </Link>
  );
}
