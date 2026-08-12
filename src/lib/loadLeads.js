import { getLeads } from "@/lib/mongodb";
import {
  buildLeadFilter,
  buildLeadSort,
  LEADS_PAGE_SIZE,
  serializeLead,
} from "@/lib/leads";

/**
 * One page of leads plus the counts the filter chips need.
 *
 * Shared by the enquiries and appointments screens — they differ only by the
 * `kind` they ask for.
 */
export async function loadLeadPage(searchParams, kind) {
  const params = new URLSearchParams();
  params.set("kind", kind);
  if (searchParams.status) params.set("status", searchParams.status);
  if (searchParams.q) params.set("q", searchParams.q);
  if (searchParams.when) params.set("when", searchParams.when);

  const page = Math.max(1, Number(searchParams.page) || 1);
  const filter = buildLeadFilter(params);
  const sort = buildLeadSort(params);

  // Status counts must ignore the status filter itself, or selecting one would
  // zero out all the others.
  const countParams = new URLSearchParams(params);
  countParams.delete("status");
  const countFilter = buildLeadFilter(countParams);

  const leads = await getLeads();
  const [docs, total, statusCounts] = await Promise.all([
    leads
      .find(filter)
      .sort(sort)
      .skip((page - 1) * LEADS_PAGE_SIZE)
      .limit(LEADS_PAGE_SIZE)
      .toArray(),
    leads.countDocuments(filter),
    leads
      .aggregate([
        { $match: countFilter },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ])
      .toArray(),
  ]);

  return {
    leads: docs.map(serializeLead),
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / LEADS_PAGE_SIZE)),
    counts: Object.fromEntries(statusCounts.map((s) => [s._id ?? "new", s.count])),
  };
}
