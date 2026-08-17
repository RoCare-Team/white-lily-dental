import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/adminSession";
import { getLeads } from "@/lib/mongodb";
import { todayKey } from "@/lib/leads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Which leads a screen is responsible for. These mirror the sidebar badge
 * queries exactly, so opening a screen clears precisely the badge it shows.
 */
function bucketFilter(kind) {
  switch (kind) {
    case "appointment":
      // The screen opens on "Upcoming", so that is what its badge counts.
      return { slotDate: { $gte: todayKey() } };
    case "plan":
      return { source: "plan-enquiry" };
    case "enquiry":
      return { slotDate: { $exists: false }, source: { $ne: "plan-enquiry" } };
    default:
      return null;
  }
}

/**
 * Marks everything on one screen as read — the behaviour of opening an inbox
 * tab. Individual rows keep their "new" dot for the current visit, because the
 * page was rendered before this ran.
 */
export async function POST(request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const filter = bucketFilter(body?.kind);
  if (!filter) {
    return NextResponse.json({ error: "Unknown screen." }, { status: 400 });
  }

  try {
    const leads = await getLeads();
    const { modifiedCount } = await leads.updateMany(
      { ...filter, seenAt: { $exists: false } },
      { $set: { seenAt: new Date() } }
    );

    return NextResponse.json({ ok: true, marked: modifiedCount });
  } catch (error) {
    console.error("Failed to mark leads as read:", error);
    return NextResponse.json({ error: "Could not update." }, { status: 500 });
  }
}
