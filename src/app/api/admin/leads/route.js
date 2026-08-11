import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/adminSession";
import { getLeads } from "@/lib/mongodb";
import { buildLeadFilter, LEADS_PAGE_SIZE, serializeLead } from "@/lib/leads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PAGE_SIZE = LEADS_PAGE_SIZE;

export async function GET(request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const filter = buildLeadFilter(searchParams);

  try {
    const leads = await getLeads();
    const [docs, total, statusCounts] = await Promise.all([
      leads
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE)
        .toArray(),
      leads.countDocuments(filter),
      leads.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]).toArray(),
    ]);

    return NextResponse.json({
      leads: docs.map(serializeLead),
      total,
      page,
      pageSize: PAGE_SIZE,
      pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
      counts: Object.fromEntries(statusCounts.map((s) => [s._id ?? "new", s.count])),
    });
  } catch (error) {
    console.error("Failed to load leads:", error);
    return NextResponse.json({ error: "Could not load leads." }, { status: 500 });
  }
}
