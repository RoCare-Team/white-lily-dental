import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarCheck, Inbox, Stethoscope, Users } from "lucide-react";

import PageTitle from "@/components/admin/PageTitle";
import SeedPrompt from "@/components/admin/SeedPrompt";
import { getDb, getLeads } from "@/lib/mongodb";
import { CONTENT_TYPES, collectionNameFor } from "@/lib/contentSchemas";
import { todayKey } from "@/lib/leads";

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
  const today = todayKey();
  const enquiryOnly = { slotDate: { $exists: false } };

  const [totalLeads, newLeads, upcoming, todayCount, recent] = await Promise.all([
    leads.countDocuments(enquiryOnly),
    leads.countDocuments({ ...enquiryOnly, status: "new" }),
    leads.countDocuments({ slotDate: { $gte: today } }),
    leads.countDocuments({ slotDate: today }),
    leads.find(enquiryOnly).sort({ createdAt: -1 }).limit(6).toArray(),
  ]);

  return {
    counts,
    totalLeads,
    newLeads,
    upcoming,
    todayCount,
    recent: recent.map((lead) => ({
      id: String(lead._id),
      name: lead.name ?? "",
      treatment: lead.treatment ?? "",
      status: lead.status ?? "new",
      createdAt: lead.createdAt ? new Date(lead.createdAt).toISOString() : null,
    })),
    seeded: Object.values(counts).some((count) => count > 0),
  };
}

const STATUS_STYLES = {
  new: "bg-brand-100 text-brand-dark",
  contacted: "bg-amber-100 text-amber-800",
  booked: "bg-teal-50 text-teal",
  closed: "bg-slate-100 text-muted",
  spam: "bg-coral-50 text-coral-dark",
};

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
        <PageTitle
          title="Overview"
          subtitle="Enquiries and website content at a glance."
        />
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
      <PageTitle
        title="Overview"
        subtitle="Enquiries and website content at a glance."
      />

      {!data.seeded ? <SeedPrompt /> : null}

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Appointments today"
          value={data.todayCount}
          href="/admin/appointments?when=today"
          icon={Stethoscope}
          tone={data.todayCount > 0 ? "teal" : "slate"}
        />
        <StatCard
          label="Upcoming appointments"
          value={data.upcoming}
          href="/admin/appointments"
          icon={CalendarCheck}
          tone="brand"
        />
        <StatCard
          label="Enquiries"
          value={data.totalLeads}
          href="/admin/leads"
          icon={Inbox}
          tone="slate"
        />
        <StatCard
          label="Awaiting reply"
          value={data.newLeads}
          href="/admin/leads?status=new"
          icon={Users}
          tone={data.newLeads > 0 ? "coral" : "slate"}
        />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-5">
        <Panel
          className="lg:col-span-3"
          title="Latest enquiries"
          subtitle="The six most recent enquiries. Booked slots are under Appointments."
          action={{ href: "/admin/leads", label: "View all" }}
        >
          {data.recent.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="No enquiries yet"
              body="Requests submitted through the website will land here."
            />
          ) : (
            <ul className="divide-y divide-line/70">
              {data.recent.map((lead) => (
                <li key={lead.id} className="flex items-center gap-3 px-5 py-3">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f0f4f9] text-[12px] font-bold text-navy">
                    {(lead.name || "?").charAt(0).toUpperCase()}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-semibold text-navy">
                      {lead.name}
                    </span>
                    <span className="block truncate text-[12.5px] text-muted">
                      {lead.treatment || "General enquiry"}
                    </span>
                  </span>
                  <span
                    className={`hidden shrink-0 rounded-full px-2.5 py-1 text-[11.5px] font-semibold capitalize sm:inline ${
                      STATUS_STYLES[lead.status] ?? STATUS_STYLES.new
                    }`}
                  >
                    {lead.status}
                  </span>
                  <span className="w-[54px] shrink-0 text-right text-[12px] text-muted">
                    {lead.createdAt
                      ? new Date(lead.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                        })
                      : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          className="lg:col-span-2"
          title="Website content"
          subtitle="Every section of the public site."
        >
          <ul className="divide-y divide-line/70">
            {Object.entries(CONTENT_TYPES).map(([key, schema]) => (
              <li key={key}>
                <Link
                  href={`/admin/content/${key}`}
                  className="group flex items-center justify-between gap-3 px-5 py-2.5"
                >
                  <span className="text-[13.5px] font-medium text-navy group-hover:text-brand">
                    {schema.label}
                  </span>
                  <span className="flex items-center gap-2 text-[13px] text-muted">
                    <span className="tabular-nums">{data.counts[key] ?? 0}</span>
                    <ArrowUpRight
                      className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}

const TONES = {
  brand: "bg-brand-50 text-brand",
  coral: "bg-coral-50 text-coral-dark",
  teal: "bg-teal-50 text-teal",
  slate: "bg-[#f0f4f9] text-muted",
};

function StatCard({ label, value, href, icon: Icon, tone }) {
  return (
    <Link
      href={href}
      className="rounded-[12px] border border-line bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-[0_10px_28px_-20px_rgba(10,37,64,0.5)]"
    >
      <span
        className={`inline-flex h-9 w-9 items-center justify-center rounded-[10px] ${TONES[tone]}`}
      >
        <Icon className="h-4.5 w-4.5" aria-hidden="true" />
      </span>
      <p className="mt-3 text-[26px] font-bold leading-none tracking-tight text-navy tabular-nums">
        {value}
      </p>
      <p className="mt-1.5 text-[12.5px] text-muted">{label}</p>
    </Link>
  );
}

function Panel({ title, subtitle, action, className = "", children }) {
  return (
    <section
      className={`overflow-hidden rounded-[14px] border border-line bg-white ${className}`}
    >
      <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
        <div>
          <h2 className="text-[14.5px] font-bold text-navy">{title}</h2>
          {subtitle ? (
            <p className="mt-0.5 text-[12.5px] text-muted">{subtitle}</p>
          ) : null}
        </div>
        {action ? (
          <Link
            href={action.href}
            className="inline-flex shrink-0 items-center gap-1.5 text-[13px] font-semibold text-brand hover:text-brand-dark"
          >
            {action.label}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function EmptyState({ icon: Icon, title, body }) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
      <Icon className="h-7 w-7 text-muted/50" aria-hidden="true" />
      <p className="text-[14px] font-semibold text-navy">{title}</p>
      <p className="max-w-[320px] text-[13px] leading-relaxed text-muted">{body}</p>
    </div>
  );
}
