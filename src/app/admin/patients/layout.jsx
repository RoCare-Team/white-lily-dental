import PatientsRail from "@/components/admin/PatientsRail";

export const metadata = { title: "Patients" };

/**
 * Two panes, the way a receptionist works: the list of people stays put on the
 * left while one person's file fills the rest. Moving between patients never
 * means going back to a separate list screen.
 */
export default function PatientsLayout({ children }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[264px_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-[88px] lg:h-[calc(100dvh-124px)]">
        <PatientsRail />
      </aside>

      <div className="min-w-0">{children}</div>
    </div>
  );
}
