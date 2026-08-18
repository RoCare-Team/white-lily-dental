import AdminShell from "@/components/admin/AdminShell";
import { getAdminSession } from "@/lib/adminSession";
import { getLeads } from "@/lib/mongodb";
import { todayKey } from "@/lib/leads";

export const metadata = {
  title: { default: "Admin", template: "%s · White Lily Admin" },
  robots: { index: false, follow: false },
};

/**
 * The numbers on the sidebar badges. A failure here must never take the whole
 * panel down — the badges just don't show.
 */
async function loadBadges() {
  try {
    const leads = await getLeads();

    // Unread, not "new" — the badge clears the moment staff open the lead,
    // the way an inbox does. Changing the status is a separate decision.
    // Unopened and not yet finished: a completed lead has moved to Clients,
    // so it must leave the badge too.
    const unread = { seenAt: { $exists: false }, status: { $ne: "complete" } };

    const [appointments, contact, packages] = await Promise.all([
      // Slots still to come, plus treatment-page requests with no time chosen.
      // A badge counting past appointments would point at an empty list.
      leads.countDocuments({
        ...unread,
        $or: [
          { slotDate: { $gte: todayKey() } },
          { slotDate: { $exists: false }, source: "service-enquiry" },
        ],
      }),
      leads.countDocuments({
        ...unread,
        slotDate: { $exists: false },
        source: { $nin: ["plan-enquiry", "service-enquiry"] },
      }),
      leads.countDocuments({ ...unread, source: "plan-enquiry" }),
    ]);

    return { appointments, contact, packages };
  } catch (error) {
    console.error("Sidebar badges unavailable:", error.message);
    return {};
  }
}

export default async function AdminLayout({ children }) {
  const [session, badges] = await Promise.all([getAdminSession(), loadBadges()]);

  return (
    <AdminShell email={session?.email ?? ""} badges={badges}>
      {children}
    </AdminShell>
  );
}
