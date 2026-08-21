"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Clock, List } from "lucide-react";

import {
  formatSlotTime,
  LeadDrawer,
  STATUS_STYLES,
} from "@/components/admin/leadShared";
import { layoutDay, minutesOf, ROW_HEIGHT, ROW_MINUTES } from "@/lib/calendar";

/**
 * Appointment blocks. Each status gets its own fill and a heavier left edge,
 * so a glance down a column reads as a state of play, not just a list of names.
 */
const BLOCK_STYLES = {
  new: "bg-brand-50 border-l-brand text-brand-dark",
  contacted: "bg-amber-100 border-l-amber-500 text-amber-900",
  booked: "bg-teal-50 border-l-teal text-teal",
  complete: "bg-slate-100 border-l-slate-400 text-muted",
  closed: "bg-slate-100 border-l-slate-400 text-muted",
};

/**
 * A colour per doctor, taken by position so it stays the same from one visit to
 * the next. Only used for the dot beside a name — the appointment blocks stay
 * coloured by status, which is what the receptionist is actually acting on.
 */
const DOCTOR_DOTS = ["#1668c7", "#0f8478", "#9a5c07", "#7b4fd0", "#c2544f"];

/** Matches the sentinel loadCalendar uses for appointments with no doctor. */
const UNASSIGNED = "__none__";

const DOT_SEP = " · ";

const SPAN_OPTIONS = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

/** "14:00" worth of minutes → "2 PM"; half hours stay blank in the gutter. */
function hourLabel(minutes) {
  const h = Math.floor(minutes / 60);
  const period = h < 12 ? "AM" : "PM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour} ${period}`;
}

export default function AppointmentCalendar({
  data,
  siteName = "White Lily Dental",
  nowMinutes,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [active, setActive] = useState(null);
  const [pending, setPending] = useState("");

  // The red "now" line. Seeded from the server so the first paint matches, then
  // kept honest by a timer — a receptionist has this screen open all day.
  const [now, setNow] = useState(nowMinutes);
  useEffect(() => {
    const tick = setInterval(() => {
      const d = new Date();
      setNow(d.getHours() * 60 + d.getMinutes());
    }, 60000);
    return () => clearInterval(tick);
  }, []);

  const {
    range,
    hours,
    byDay,
    awaiting,
    todaySchedule,
    clinics,
    clinicId,
    clinicTotal,
    doctors,
    doctorName,
    doctorTotal,
    today,
  } = data;

  /* Open the grid at the first appointment rather than at opening time, so a
     clinic that starts late does not look empty. */
  const scroller = useRef(null);
  const firstBlockTop = useMemo(() => {
    const times = Object.values(byDay)
      .flat()
      .map((lead) => minutesOf(lead.slotTime))
      .filter((m) => m !== null);
    if (!times.length) return 0;
    return ((Math.min(...times) - hours.start) / ROW_MINUTES) * ROW_HEIGHT;
  }, [byDay, hours.start]);

  useEffect(() => {
    if (scroller.current) {
      scroller.current.scrollTop = Math.max(0, firstBlockTop - ROW_HEIGHT);
    }
  }, [firstBlockTop]);

  const pushQuery = (changes) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    router.push(`/admin/appointments${params.size ? `?${params}` : ""}`);
  };

  const patchLead = async (id, changes) => {
    setPending(id);
    try {
      const response = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        alert(result.error ?? "Could not update this appointment.");
        return false;
      }

      setActive((current) => (current?.id === id ? result.lead : current));
      router.refresh();
      return true;
    } catch {
      alert("Network error. Please try again.");
      return false;
    } finally {
      setPending("");
    }
  };

  const isMonth = range.view === "month";

  return (
    <>
      {/* ------------------------------------------------------- toolbar */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1">
          <ArrowButton
            title="Previous"
            icon={ChevronLeft}
            onClick={() => pushQuery({ date: range.previous })}
          />
          <ArrowButton
            title="Next"
            icon={ChevronRight}
            onClick={() => pushQuery({ date: range.next })}
          />
        </div>

        <p className="min-w-0 flex-1 truncate text-[15.5px] font-bold tracking-tight text-navy">
          {range.label}
        </p>

        <button
          type="button"
          onClick={() => pushQuery({ date: "" })}
          className="inline-flex h-9 shrink-0 items-center rounded-[9px] border border-line bg-white px-3.5 text-[13px] font-semibold text-navy transition-colors hover:border-brand hover:text-brand"
        >
          Today
        </button>

        <div className="flex shrink-0 overflow-hidden rounded-[9px] border border-line bg-white">
          {SPAN_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => pushQuery({ span: option.value })}
              aria-pressed={range.view === option.value}
              className={`h-9 px-3.5 text-[13px] font-semibold transition-colors ${
                range.view === option.value
                  ? "bg-deep text-white"
                  : "text-muted hover:bg-brand-50 hover:text-brand"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => pushQuery({ view: "list" })}
          className="inline-flex h-9 shrink-0 items-center gap-2 rounded-[9px] border border-line bg-white px-3.5 text-[13px] font-semibold text-muted transition-colors hover:border-brand hover:text-brand"
        >
          <List className="h-4 w-4" aria-hidden="true" />
          List view
        </button>
      </div>

{/* Filters as chip rows, not a left rail — every pixel a column would have
          taken is a pixel the seven day columns need. */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <FilterChip
          label="All doctors"
          count={doctorTotal}
          active={!doctorName}
          onClick={() => pushQuery({ doctor: "" })}
        />
        {doctors.map((doctor, index) => (
          <FilterChip
            key={doctor.name}
            label={doctor.label ?? doctor.name}
            title={doctor.specialty || undefined}
            count={doctor.count}
            dot={doctor.name === UNASSIGNED ? "#8fa2b5" : DOCTOR_DOTS[index % DOCTOR_DOTS.length]}
            active={doctorName === doctor.name}
            onClick={() => pushQuery({ doctor: doctor.name })}
          />
        ))}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <FilterChip
          label="All clinics"
          count={clinicTotal}
          active={!clinicId}
          onClick={() => pushQuery({ clinic: "" })}
        />
        {clinics.map((clinic) => (
          <FilterChip
            key={clinic.id}
            label={clinic.name}
            count={clinic.count}
            active={clinicId === clinic.id}
            onClick={() => pushQuery({ clinic: clinic.id })}
          />
        ))}
      </div>

      {/* ------------------------------------------------------- body */}
      <div className="mt-4 grid gap-4 2xl:grid-cols-[minmax(0,1fr)_286px]">

        {/* the calendar itself */}
        <div className="min-w-0">
          {awaiting.length ? (
            <div className="mb-3 rounded-[13px] border border-dashed border-line bg-white p-3">
              <p className="text-[10.5px] font-bold uppercase tracking-[0.08em] text-muted">
                Awaiting a time · {awaiting.length}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {awaiting.map((lead) => (
                  <button
                    key={lead.id}
                    type="button"
                    onClick={() => setActive(lead)}
                    className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-line bg-[#fafbfc] px-3 py-1.5 text-[12.5px] text-navy transition-colors hover:border-brand hover:text-brand"
                  >
                    <Clock className="h-3.5 w-3.5 shrink-0 text-muted" aria-hidden="true" />
                    <span className="truncate font-semibold">{lead.name}</span>
                    <span className="truncate text-muted">{lead.treatment || "—"}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {isMonth ? (
            <MonthGrid
              range={range}
              byDay={byDay}
              today={today}
              onOpen={setActive}
              onDay={(key) => pushQuery({ span: "day", date: key })}
            />
          ) : (
            <TimeGrid
              range={range}
              hours={hours}
              byDay={byDay}
              today={today}
              now={now}
              scroller={scroller}
              onOpen={setActive}
            />
          )}
        </div>

        {/* today at a glance */}
        <aside className="rounded-[13px] border border-line bg-white">
          <div className="border-b border-line px-4 py-3">
            <p className="text-[14px] font-bold tracking-tight text-navy">
              Today&rsquo;s schedule
            </p>
          </div>

          <div className="grid grid-cols-3 divide-x divide-line border-b border-line text-center">
            <Tally label="Today" value={todaySchedule.length} tone="text-navy" />
            <Tally
              label="New"
              value={todaySchedule.filter((l) => l.status === "new").length}
              tone="text-brand"
            />
            <Tally
              label="Done"
              value={todaySchedule.filter((l) => l.status === "complete").length}
              tone="text-teal"
            />
          </div>

          {todaySchedule.length === 0 ? (
            <p className="px-4 py-8 text-center text-[13.5px] leading-relaxed text-muted">
              Nothing booked for today.
            </p>
          ) : (
            <ul className="divide-y divide-line/70">
              {todaySchedule.map((lead) => (
                <li key={lead.id}>
                  <button
                    type="button"
                    onClick={() => setActive(lead)}
                    className="flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-brand-50/50"
                  >
                    <span className="w-[52px] shrink-0 pt-0.5 text-[12px] font-semibold tabular-nums text-muted">
                      {formatSlotTime(lead.slotTime)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] font-semibold text-navy">
                        {lead.name}
                      </span>
                      <span className="block truncate text-[12.5px] text-muted">
                        {lead.treatment || "Reason not given"}
                      </span>
                      {lead.doctor ? (
                        <span className="block truncate text-[12px] text-muted">
                          {lead.doctor}
                        </span>
                      ) : null}
                      <span
                        className={`mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${
                          STATUS_STYLES[lead.status] ?? STATUS_STYLES.new
                        }`}
                      >
                        {lead.status}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>

      {active ? (
        <LeadDrawer
          lead={active}
          siteName={siteName}
          busy={pending === active.id}
          onClose={() => setActive(null)}
          onStatus={(status) => patchLead(active.id, { status })}
          onSaveNotes={(notes) => patchLead(active.id, { notes })}
          onCancelBooking={() => {
            if (
              !confirm(
                "Cancel this appointment? The slot goes back on sale immediately and another patient can book it."
              )
            )
              return;
            patchLead(active.id, { status: "cancelled" });
          }}
          onRestoreBooking={() => patchLead(active.id, { status: "new" })}
        />
      ) : null}
    </>
  );
}

/* ------------------------------------------------------------------ grid */

function TimeGrid({ range, hours, byDay, today, now, scroller, onOpen }) {
  const columns = `56px repeat(${range.days.length}, minmax(0, 1fr))`;
  const bodyHeight = hours.rows.length * ROW_HEIGHT;
  const showNow = now >= hours.start && now <= hours.end;

  return (
    <div className="overflow-hidden rounded-[13px] border border-line bg-white">
      {/* day headings, kept out of the scroller so they stay put */}
      <div
        className="grid border-b border-line bg-[#fafbfc]"
        style={{ gridTemplateColumns: columns }}
      >
        <span />
        {range.days.map((day) => {
          const isToday = day.key === today;
          return (
            <div
              key={day.key}
              className={`border-l border-line px-2 py-2.5 text-center ${
                isToday ? "bg-brand-50" : ""
              }`}
            >
              <p
                className={`text-[10.5px] font-bold uppercase tracking-[0.06em] ${
                  isToday ? "text-brand" : "text-muted"
                }`}
              >
                {day.weekday}
              </p>
              <p
                className={`text-[15px] font-bold tabular-nums ${
                  isToday ? "text-brand" : "text-navy"
                }`}
              >
                {day.dayNumber}
                <span className="ml-1 text-[11.5px] font-semibold text-muted">
                  {day.month}
                </span>
              </p>
            </div>
          );
        })}
      </div>

      <div ref={scroller} className="max-h-[62vh] overflow-y-auto overflow-x-auto">
        <div
          className="grid min-w-[560px]"
          style={{ gridTemplateColumns: columns }}
        >
          {/* hour gutter */}
          <div className="relative" style={{ height: bodyHeight }}>
            {hours.rows.map((row) =>
              row.isHour ? (
                <span
                  key={row.minutes}
                  className="absolute right-2 -translate-y-1/2 text-[11px] font-medium tabular-nums text-muted"
                  style={{ top: ((row.minutes - hours.start) / ROW_MINUTES) * ROW_HEIGHT }}
                >
                  {hourLabel(row.minutes)}
                </span>
              ) : null
            )}
          </div>

          {range.days.map((day) => {
            const placed = layoutDay(byDay[day.key] ?? []);
            return (
              <div
                key={day.key}
                className={`relative border-l border-line ${
                  day.isWeekend ? "bg-[#fbfcfd]" : ""
                }`}
                style={{ height: bodyHeight }}
              >
                {/* half-hour rules, drawn once instead of one node per row */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(to bottom, var(--wl-line, #e6ecf3) 0 1px, transparent 1px " +
                      ROW_HEIGHT +
                      "px)",
                  }}
                />

                {day.key === today && showNow ? (
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 z-10 border-t-2 border-coral"
                    style={{ top: ((now - hours.start) / ROW_MINUTES) * ROW_HEIGHT }}
                  >
                    <span className="absolute -left-1 -top-[5px] h-2 w-2 rounded-full bg-coral" />
                  </div>
                ) : null}

                {placed.map(({ lead, start, lane, lanes }) => (
                  <button
                    key={lead.id}
                    type="button"
                    onClick={() => onOpen(lead)}
                    title={`${formatSlotTime(lead.slotTime)} · ${lead.name}${
                      lead.treatment ? ` · ${lead.treatment}` : ""
                    }`}
                    className={`absolute overflow-hidden rounded-[7px] border-l-[3px] px-1.5 py-1 text-left transition-shadow hover:z-20 hover:shadow-md ${
                      BLOCK_STYLES[lead.status] ?? BLOCK_STYLES.new
                    }`}
                    style={{
                      top: ((start - hours.start) / ROW_MINUTES) * ROW_HEIGHT + 1,
                      height: ROW_HEIGHT - 3,
                      left: `calc(${(lane / lanes) * 100}% + 2px)`,
                      width: `calc(${100 / lanes}% - 4px)`,
                    }}
                  >
                    <span className="block truncate text-[12px] font-semibold leading-tight">
                      {lead.name}
                    </span>
                    <span className="block truncate text-[11px] leading-tight opacity-80">
                      {formatSlotTime(lead.slotTime)}
                      {lead.doctor ? DOT_SEP + lead.doctor : ""}
                    </span>
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- month */

function MonthGrid({ range, byDay, today, onOpen, onDay }) {
  // Blank cells so the 1st sits under its real weekday.
  const firstWeekday = (() => {
    const day = range.days[0];
    const names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const index = names.indexOf(day.weekday);
    return index < 0 ? 0 : index;
  })();

  return (
    <div className="overflow-hidden rounded-[13px] border border-line bg-white">
      <div className="grid grid-cols-7 border-b border-line bg-[#fafbfc]">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((name) => (
          <p
            key={name}
            className="border-l border-line py-2 text-center text-[10.5px] font-bold uppercase tracking-[0.06em] text-muted first:border-l-0"
          >
            {name}
          </p>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {Array.from({ length: firstWeekday }, (_, i) => (
          <div key={`pad-${i}`} className="min-h-[112px] border-b border-l border-line bg-[#fbfcfd]" />
        ))}

        {range.days.map((day) => {
          const rows = byDay[day.key] ?? [];
          const isToday = day.key === today;

          return (
            <div
              key={day.key}
              className="min-h-[112px] border-b border-l border-line p-1.5"
            >
              <button
                type="button"
                onClick={() => onDay(day.key)}
                className={`mb-1 inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-[12px] font-bold tabular-nums transition-colors ${
                  isToday
                    ? "bg-brand text-white"
                    : "text-navy hover:bg-brand-50 hover:text-brand"
                }`}
              >
                {day.dayNumber}
              </button>

              <div className="flex flex-col gap-1">
                {rows.slice(0, 3).map((lead) => (
                  <button
                    key={lead.id}
                    type="button"
                    onClick={() => onOpen(lead)}
                    className={`truncate rounded-[5px] border-l-[3px] px-1.5 py-0.5 text-left text-[11px] font-medium ${
                      BLOCK_STYLES[lead.status] ?? BLOCK_STYLES.new
                    }`}
                  >
                    {formatSlotTime(lead.slotTime)} {lead.name}
                  </button>
                ))}

                {rows.length > 3 ? (
                  <button
                    type="button"
                    onClick={() => onDay(day.key)}
                    className="px-1.5 text-left text-[11px] font-semibold text-brand hover:underline"
                  >
                    +{rows.length - 3} more
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- bits */

function ArrowButton({ title, icon: Icon, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="inline-flex h-9 w-9 items-center justify-center rounded-[9px] border border-line bg-white text-muted transition-colors hover:border-brand hover:text-brand"
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      <span className="sr-only">{title}</span>
    </button>
  );
}

function FilterChip({ label, count, dot, title, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-pressed={active}
      className={`inline-flex h-9 items-center gap-2 rounded-full border px-4 text-[13.5px] font-semibold transition-colors ${
        active
          ? "border-deep bg-deep text-white"
          : "border-line bg-white text-navy hover:border-brand hover:text-brand"
      }`}
    >
      {dot ? (
        <span
          aria-hidden="true"
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: dot }}
        />
      ) : null}
      {label}
      <span className={active ? "tabular-nums text-white/70" : "tabular-nums text-muted"}>
        {count}
      </span>
    </button>
  );
}

function Tally({ label, value, tone }) {
  return (
    <div className="px-2 py-2.5">
      <p className="text-[10px] font-bold uppercase tracking-[0.07em] text-muted">
        {label}
      </p>
      <p className={`text-[18px] font-bold tabular-nums ${tone}`}>{value}</p>
    </div>
  );
}

