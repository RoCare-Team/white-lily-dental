import { requireAdmin } from "@/lib/adminSession";
import { getLeads } from "@/lib/mongodb";
import { buildLeadFilter } from "@/lib/leads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COLUMNS = [
  ["Date", (l) => (l.createdAt ? new Date(l.createdAt).toISOString() : "")],
  ["Name", (l) => l.name],
  ["Phone", (l) => l.phone],
  ["Email", (l) => l.email],
  ["Clinic", (l) => l.clinic],
  ["Treatment", (l) => l.treatment],
  ["Preferred date", (l) => l.preferredDate],
  ["Message", (l) => l.message],
  ["Source", (l) => l.source],
  ["Status", (l) => l.status],
  ["Notes", (l) => l.notes],
];

/**
 * Quotes a CSV cell. The leading apostrophe on =, +, -, @ stops Excel treating
 * a submitted value as a formula.
 */
function cell(value) {
  const text = String(value ?? "");
  const safe = /^[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
}

export async function GET(request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { searchParams } = new URL(request.url);

  try {
    const leads = await getLeads();
    const docs = await leads
      .find(buildLeadFilter(searchParams))
      .sort({ createdAt: -1 })
      .limit(5000)
      .toArray();

    const rows = [
      COLUMNS.map(([header]) => cell(header)).join(","),
      ...docs.map((doc) => COLUMNS.map(([, get]) => cell(get(doc))).join(",")),
    ];

    // BOM so Excel opens the file as UTF-8.
    return new Response(`﻿${rows.join("\r\n")}`, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="white-lily-leads.csv"',
      },
    });
  } catch (error) {
    console.error("Failed to export leads:", error);
    return Response.json({ error: "Could not export leads." }, { status: 500 });
  }
}
