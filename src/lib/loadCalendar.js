import { getClinics, getDoctors } from "@/lib/content";
import { getLeads } from "@/lib/mongodb";
import { SLOT_HOLDING_STATUSES, serializeLead, todayKey } from "@/lib/leads";
import { buildRange, gridHours } from "@/lib/calendar";
import { buildDoctorColours } from "@/lib/doctorColours";

/** Marks leads with no doctor recorded, so they stay reachable in the filter. */
export const UNASSIGNED = "__none__";

/**
 * Everything the appointments calendar draws.
 *
 * Only appointments that still hold their slot are shown — the same list the
 * booking form treats as taken. A cancelled booking has given its time back,
 * so drawing it would claim the clinic is busy when it is free.
 */
export async function loadCalendar(params = {}) {
  const today = todayKey();
  const range = buildRange(params.span, params.date, today);

  const clinicId = params.clinic || "";
  const doctorName = params.doctor || "";

  const [clinics, doctors, leads] = await Promise.all([
    getClinics(),
    getDoctors(),
    getLeads(),
  ]);

  const held = { status: { $in: SLOT_HOLDING_STATUSES } };
  const dated = { ...held, slotDate: { $gte: range.from, $lte: range.to } };

  const byClinic = clinicId ? { clinicId } : {};
  const byDoctor = doctorName
    ? doctorName === UNASSIGNED
      ? { $or: [{ doctor: "" }, { doctor: { $exists: false } }] }
      : { doctor: doctorName }
    : {};

  const [booked, awaiting, todayRows, clinicFacet, doctorFacet] = await Promise.all([
    leads
      .find({ ...dated, ...byClinic, ...byDoctor })
      .sort({ slotDate: 1, slotTime: 1 })
      .toArray(),

    // Treatment-page requests with no time chosen. They cannot sit on the grid,
    // so they get their own strip above it rather than being left off entirely.
    leads
      .find({ ...held, ...byDoctor, slotDate: { $exists: false }, source: "service-enquiry" })
      .sort({ createdAt: -1 })
      .limit(40)
      .toArray(),

    leads
      .find({ ...held, ...byClinic, ...byDoctor, slotDate: today })
      .sort({ slotTime: 1 })
      .toArray(),

    // Each filter's own counts ignore itself but respect the other one, so the
    // numbers always describe what clicking that chip would actually show.
    leads
      .aggregate([
        { $match: { ...dated, ...byDoctor } },
        { $group: { _id: "$clinicId", count: { $sum: 1 } } },
      ])
      .toArray(),

    leads
      .aggregate([
        { $match: { ...dated, ...byClinic } },
        { $group: { _id: { $ifNull: ["$doctor", ""] }, count: { $sum: 1 } } },
      ])
      .toArray(),
  ]);

  const clinicCounts = Object.fromEntries(
    clinicFacet.map((row) => [row._id ?? "", row.count])
  );
  const doctorCounts = Object.fromEntries(
    doctorFacet.map((row) => [row._id || UNASSIGNED, row.count])
  );

  const sum = (counts) => Object.values(counts).reduce((a, b) => a + b, 0);

  // One bucket per visible day, pre-seeded so an empty day is still a column.
  const byDay = Object.fromEntries(range.days.map((day) => [day.key, []]));
  for (const doc of booked) {
    if (byDay[doc.slotDate]) byDay[doc.slotDate].push(serializeLead(doc));
  }

  const doctorRows = doctors.map((doctor) => ({
    name: doctor.name ?? "",
    specialty: doctor.specialty ?? "",
    count: doctorCounts[doctor.name] ?? 0,
  }));

  // Only offered when something is actually sitting in it.
  if (doctorCounts[UNASSIGNED]) {
    doctorRows.push({
      name: UNASSIGNED,
      label: "No doctor chosen",
      specialty: "",
      count: doctorCounts[UNASSIGNED],
    });
  }

  return {
    today,
    range,
    hours: gridHours(clinics),

    clinicId,
    clinics: clinics.map((clinic) => ({
      id: clinic.id ?? "",
      name: clinic.shortName || clinic.name || clinic.id || "Clinic",
      count: clinicCounts[clinic.id ?? ""] ?? 0,
    })),
    clinicTotal: sum(clinicCounts),

    doctorName,
    doctors: doctorRows,
    // Built here rather than in the browser: the admin order is the thing that
    // decides the colours, and only the server knows it.
    doctorColours: buildDoctorColours(doctors),
    doctorTotal: sum(doctorCounts),

    byDay,
    awaiting: awaiting.map(serializeLead),
    todaySchedule: todayRows.map(serializeLead),
  };
}
