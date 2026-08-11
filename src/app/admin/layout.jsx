import AdminShell from "@/components/admin/AdminShell";
import { getAdminSession } from "@/lib/adminSession";

export const metadata = {
  title: { default: "Admin", template: "%s · White Lily Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }) {
  const session = await getAdminSession();
  return <AdminShell email={session?.email ?? ""}>{children}</AdminShell>;
}
