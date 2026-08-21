import AppointmentCalendar from "@/components/admin/AppointmentCalendar";
import LeadsBoard from "@/components/admin/LeadsBoard";
import PageTitle from "@/components/admin/PageTitle";
import { loadCalendar } from "@/lib/loadCalendar";
import { loadLeadPage } from "@/lib/loadLeads";
import { getSettings } from "@/lib/content";

export const metadata = { title: "Calendar" };
export const dynamic = "force-dynamic";

export default async function AdminAppointmentsPage({ searchParams }) {
  const params = (await searchParams) ?? {};
  // The calendar is the day-to-day view; the list is for searching and export.
  const isList = params.view === "list";

  // Used to sign the ready-made WhatsApp reply.
  const settings = await getSettings();

  let data = null;
  let error = null;

  try {
    data = isList
      ? await loadLeadPage(params, "appointment")
      : await loadCalendar(params);
  } catch (cause) {
    console.error("Admin appointments failed to load:", cause);
    error =
      "Could not reach the database. Check MONGODB_URI and that this server's IP is allowed in Atlas → Network Access.";
  }

  // Sent as a prop rather than read in the browser, so the first paint of the
  // "now" line matches what the server rendered.
  const clock = new Date();
  const nowMinutes = clock.getHours() * 60 + clock.getMinutes();

  return (
    <>
      <PageTitle
        title="Calendar"
        subtitle={
          isList
            ? "Every appointment request: slots reserved through the booking wizard, and treatment-page requests still waiting for a time."
            : "The clinic diary. Only appointments still holding their slot are shown — a cancelled one has given its time back."
        }
      />

      {error ? (
        <p
          role="alert"
          className="mt-6 rounded-[12px] border border-coral/30 bg-coral-50 p-4 text-[14px] leading-relaxed text-navy"
        >
          {error}
        </p>
      ) : isList ? (
        <LeadsBoard
          kind="appointment"
          siteName={settings.name}
          basePath="/admin/appointments"
          initialData={data}
          initialFilters={{
            status: params.status ?? "",
            q: params.q ?? "",
            when: params.when ?? "all",
            view: "list",
          }}
        />
      ) : (
        <AppointmentCalendar
          data={data}
          siteName={settings.name}
          nowMinutes={nowMinutes}
        />
      )}
    </>
  );
}
