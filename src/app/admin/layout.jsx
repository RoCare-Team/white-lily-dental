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
    const unread = { seenAt: { $exists: false } };

    const [appointments, enquiries, packages] = await Promise.all([
      // Only appointments still to come: the screen opens on "Upcoming", so a
      // badge counting past ones would point at an empty list.
      leads.countDocuments({ ...unread, slotDate: { $gte: todayKey() } }),
      leads.countDocuments({
        ...unread,
        slotDate: { $exists: false },
        source: { $ne: "plan-enquiry" },
      }),
      leads.countDocuments({ ...unread, source: "plan-enquiry" }),
    ]);

    return { appointments, enquiries, packages };
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
