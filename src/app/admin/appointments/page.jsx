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
{/* The top bar already names this screen. A calendar needs its height far
          more than it needs a heading repeating that word, so only the list —
          where the subtitle explains a real rule — keeps one. */}
      {isList ? (
        <PageTitle
          title="Appointment requests"
          subtitle="Slots reserved through the booking wizard, and treatment-page requests still waiting for a time."
        />
      ) : null}

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
