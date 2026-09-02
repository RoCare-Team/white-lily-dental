"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CalendarOff,
  ChevronLeft,
  ChevronRight,
  Clock,
  List,
  UserPlus,
  X,
} from "lucide-react";

import {
  formatSlotTime,
  LeadDrawer,
  STATUS_STYLES,
} from "@/components/admin/leadShared";
import { colourFor } from "@/lib/doctorColours";
import AdminToolbar from "@/components/admin/toolbarSlot";
import NewPatientForm from "@/components/admin/NewPatientForm";
import { layoutDay, minutesOf, ROW_HEIGHT, ROW_MINUTES } from "@/lib/calendar";
import { UNASSIGNED } from "@/lib/leads";

/**
 * An appointment block wears its doctor's colour: a wash of it behind, the full
 * strength on the left edge and in the text. Reading a column then answers
 * "whose day is this?" before you have read a single name. Status is carried by
 * weight instead — a finished appointment fades back, since it needs nothing.
 */
function blockStyle(lead, colours) {
  const colour = colourFor(colours, lead.doctor);
  const done = lead.status === "complete" || lead.status === "closed";
  return {
    backgroundColor: `${colour}${done ? "0f" : "1f"}`,
    borderLeftColor: colour,
    color: colour,
    opacity: done ? 0.7 : 1,
  };
}

const DOT_SEP = " · ";

const SPAN_OPTIONS = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

/** 810 → "1:30 PM". Every row is labelled, so no block has to be counted to. */
function rowLabel(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const period = h < 12 ? "AM" : "PM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

/** 810 → "13:30". The shape a slot is stored in, from a click on the grid. */
function timeValue(minutes) {
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(
    minutes % 60
  ).padStart(2, "0")}`;
}

/** The tint down today's column — warm, so it reads as "now" beside the blues. */
const TODAY_TINT = "#fff6f0";

export default function AppointmentCalendar({
  data,
  siteName = "White Lily Dental",
  nowMinutes,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [active, setActive] = useState(null);
  // The element the panel should open beside — Practo's behaviour, and the
  // reason a block click does not throw you to the middle of the screen.
  const [anchorEl, setAnchorEl] = useState(null);
  const [pending, setPending] = useState("");

  /* The "Add patient" form. Null when closed; otherwise the details the form
     should open with — the day and half hour that were clicked, and whatever
     clinic the calendar is already filtered to. */
  const [adding, setAdding] = useState(null);

  const openLead = (lead, event) => {
    // The blocks sit inside a day column that opens the add form when clicked.
    event?.stopPropagation();
    setAnchorEl(event?.currentTarget ?? null);
    setActive(lead);
  };

  const closeLead = () => {
    setActive(null);
    setAnchorEl(null);
  };

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
    doctorColours,
    treatments = [],
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

  /** Everything the add form needs, in the shape it wants. */
  const addDefaults = (extra = {}) => ({
    clinicId,
    doctor: doctorName && doctorName !== UNASSIGNED ? doctorName : "",
    ...extra,
  });

  // The "No doctor chosen" row is a filter, not a person to book with.
  const bookableDoctors = doctors
    .filter((doctor) => doctor.name && doctor.name !== UNASSIGNED)
    .map((doctor) => ({
      name: doctor.name,
      colour: colourFor(doctorColours, doctor.name),
    }));

  const isMonth = range.view === "month";
  const visible = Object.values(byDay).reduce((total, list) => total + list.length, 0);
  const filtered = Boolean(doctorName || clinicId);

  return (
    <>
      {/* The controls live in the top bar, beside the screen's name, so the
          diary starts at the top of the page instead of below a second bar. */}
      <AdminToolbar>
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

        <p className="mr-1 whitespace-nowrap text-[15px] font-bold tracking-tight text-navy">
          {range.label}
          <span className="ml-2 text-[12.5px] font-medium text-muted">
            {visible} {visible === 1 ? "appointment" : "appointments"}
          </span>
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
          onClick={() => setAdding(addDefaults())}
          className="inline-flex h-9 shrink-0 items-center gap-2 rounded-[9px] bg-brand px-3.5 text-[13px] font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          <UserPlus className="h-4 w-4" aria-hidden="true" />
          Add patient
        </button>

        <button
          type="button"
          onClick={() => pushQuery({ view: "list" })}
          className="inline-flex h-9 shrink-0 items-center gap-2 rounded-[9px] border border-line bg-white px-3.5 text-[13px] font-semibold text-muted transition-colors hover:border-brand hover:text-brand"
        >
          <List className="h-4 w-4" aria-hidden="true" />
          List view
        </button>
      </AdminToolbar>

{/* ------------------------------------------------------- body */}
      <div className="overflow-hidden border-b border-line bg-white xl:grid xl:grid-cols-[214px_minmax(0,1fr)_236px]">

        {/* who and where — divided from the diary by a rule, not a gap */}
        <aside className="border-b border-line p-2.5 xl:border-b-0 xl:border-r">
          <p className="px-2 pb-1.5 pt-1 text-[10.5px] font-bold uppercase tracking-[0.08em] text-muted">
            Doctors
          </p>
          <FilterRow
            label="All doctors"
            count={doctorTotal}
            active={!doctorName}
            onClick={() => pushQuery({ doctor: "" })}
          />
          {doctors.map((doctor) => (
            <FilterRow
              key={doctor.name}
              label={doctor.label ?? doctor.name}
              title={doctor.specialty || undefined}
              count={doctor.count}
              dot={colourFor(doctorColours, doctor.name)}
              active={doctorName === doctor.name}
              onClick={() => pushQuery({ doctor: doctor.name })}
            />
          ))}

          <p className="mt-3 border-t border-line px-2 pb-1.5 pt-3 text-[10.5px] font-bold uppercase tracking-[0.08em] text-muted">
            Clinics
          </p>
          <FilterRow
            label="All clinics"
            count={clinicTotal}
            active={!clinicId}
            onClick={() => pushQuery({ clinic: "" })}
          />
          {clinics.map((clinic) => (
            <FilterRow
              key={clinic.id}
              label={clinic.name}
              count={clinic.count}
              active={clinicId === clinic.id}
              onClick={() => pushQuery({ clinic: clinic.id })}
            />
          ))}

          {/* An empty grid is confusing until you remember a filter is on. */}
          {filtered ? (
            <button
              type="button"
              onClick={() => pushQuery({ doctor: "", clinic: "" })}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-[8px] border border-line px-2 py-2 text-[12.5px] font-semibold text-muted transition-colors hover:border-brand hover:text-brand"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              Clear filters
            </button>
          ) : null}
        </aside>

        {/* the calendar itself */}
        <div className="flex min-w-0 flex-col border-b border-line xl:border-b-0">
          {awaiting.length ? (
            <div className="border-b border-line px-3 py-2.5">
              <p className="text-[10.5px] font-bold uppercase tracking-[0.08em] text-muted">
                Awaiting a time · {awaiting.length}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {awaiting.map((lead) => (
                  <button
                    key={lead.id}
                    type="button"
                    onClick={(event) => openLead(lead, event)}
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
              colours={doctorColours}
              empty={visible === 0}
              filtered={filtered}
              today={today}
              onOpen={openLead}
              onAdd={(key) => setAdding(addDefaults({ date: key }))}
              onDay={(key) => pushQuery({ span: "day", date: key })}
            />
          ) : (
            <TimeGrid
              range={range}
              hours={hours}
              byDay={byDay}
              colours={doctorColours}
              empty={visible === 0}
              filtered={filtered}
              today={today}
              now={now}
              scroller={scroller}
              onOpen={openLead}
              onAdd={(key, time) => setAdding(addDefaults({ date: key, time }))}
            />
          )}
        </div>

        {/* today at a glance */}
        <aside className="xl:border-l xl:border-line">
          <div className="border-b border-line px-4 py-3">
            <p className="text-[14px] font-bold tracking-tight text-navy">
              Today&rsquo;s schedule
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 border-b border-line p-3">
            <Tally
              label="Today"
              value={todaySchedule.length}
              className="bg-navy text-white"
            />
            <Tally
              label="New"
              value={todaySchedule.filter((l) => l.status === "new").length}
              className="bg-brand-100 text-brand-dark"
            />
            <Tally
              label="Done"
              value={todaySchedule.filter((l) => l.status === "complete").length}
              className="bg-teal-50 text-teal"
            />
          </div>

          {todaySchedule.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-[13.5px] leading-relaxed text-muted">
                Nothing booked for today.
              </p>
              <button
                type="button"
                onClick={() => setAdding(addDefaults({ date: today }))}
                className="mt-3 inline-flex h-9 items-center gap-2 rounded-[9px] border border-line bg-white px-3.5 text-[13px] font-semibold text-brand transition-colors hover:border-brand hover:bg-brand-50"
              >
                <UserPlus className="h-4 w-4" aria-hidden="true" />
                Add a patient
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-line/70">
              {todaySchedule.map((lead) => (
                <li key={lead.id}>
                  <button
                    type="button"
                    onClick={(event) => openLead(lead, event)}
                    className="flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-brand-50/50"
                  >
                    <span className="flex w-[50px] shrink-0 items-center gap-1.5 pt-0.5">
                      <span
                        aria-hidden="true"
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: colourFor(doctorColours, lead.doctor) }}
                      />
                      <span className="text-[12px] font-semibold tabular-nums text-muted">
                        {formatSlotTime(lead.slotTime)}
                      </span>
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

      <NewPatientForm
        open={Boolean(adding)}
        defaults={adding ?? {}}
        clinics={clinics}
        doctors={bookableDoctors}
        treatments={treatments}
        onClose={() => setAdding(null)}
        onSaved={() => {
          // The grid redraws behind the form, which stays up just long enough
          // to say what happened before it closes itself.
          router.refresh();
          setTimeout(() => setAdding(null), 1200);
        }}
      />

      {active ? (
        <LeadDrawer
          lead={active}
          anchorEl={anchorEl}
          siteName={siteName}
          busy={pending === active.id}
          onClose={closeLead}
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

function TimeGrid({
  range,
  hours,
  byDay,
  colours,
  empty,
  filtered,
  today,
  now,
  scroller,
  onOpen,
  onAdd,
}) {
  /* A click on bare grid is a booking at that half hour — the way every diary
     works. Only the column itself answers; the blocks on top of it stop their
     own clicks, and the rules and the now-line let them through. */
  const addAt = (dayKey) => (event) => {
    if (event.target !== event.currentTarget) return;
    const top = event.currentTarget.getBoundingClientRect().top;
    const row = Math.floor((event.clientY - top) / ROW_HEIGHT);
    const minutes = Math.min(
      hours.end - ROW_MINUTES,
      Math.max(hours.start, hours.start + row * ROW_MINUTES)
    );
    onAdd(dayKey, timeValue(minutes));
  };

  const columns = `68px repeat(${range.days.length}, minmax(0, 1fr))`;
  const bodyHeight = hours.rows.length * ROW_HEIGHT;
  const showNow = now >= hours.start && now <= hours.end;

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      {empty ? <EmptyDiary filtered={filtered} /> : null}

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
                isToday ? "bg-navy" : ""
              }`}
            >
              <p
                className={`text-[10.5px] font-bold uppercase tracking-[0.06em] ${
                  isToday ? "text-white/70" : "text-muted"
                }`}
              >
                {day.weekday}
              </p>
              <p
                className={`text-[15px] font-bold tabular-nums ${
                  isToday ? "text-white" : "text-navy"
                }`}
              >
                {day.dayNumber}
                <span
                  className={`ml-1 text-[11.5px] font-semibold ${
                    isToday ? "text-white/60" : "text-muted"
                  }`}
                >
                  {day.month}
                </span>
              </p>
            </div>
          );
        })}
      </div>

      <div
        ref={scroller}
        className="overflow-y-auto overflow-x-auto"
        style={{
          // Fills what is left of the window rather than a guessed fraction of
          // it, so a laptop shows a full clinic day without scrolling.
          // The top bar and the day headings are all that sit above it now.
          maxHeight: "calc(100dvh - 132px)",
          minHeight: 380,
          scrollbarWidth: "thin",
        }}
      >
        <div
          className="grid min-w-[560px]"
          style={{ gridTemplateColumns: columns }}
        >
          {/* hour gutter */}
          <div className="relative bg-[#fafbfc]" style={{ height: bodyHeight }}>
            {hours.rows.map((row) => (
              <span
                key={row.minutes}
                className={`absolute right-2 -translate-y-1/2 tabular-nums ${
                  row.isHour
                    ? "text-[11px] font-semibold text-navy"
                    : "text-[10px] font-medium text-muted/70"
                }`}
                style={{ top: ((row.minutes - hours.start) / ROW_MINUTES) * ROW_HEIGHT }}
              >
                {rowLabel(row.minutes)}
              </span>
            ))}

            {/* The marker Practo puts in the gutter: a wedge pointing at now. */}
            {showNow ? (
              <span
                aria-hidden="true"
                className="absolute right-0 -translate-y-1/2 border-y-[5px] border-r-[6px] border-y-transparent border-r-coral"
                style={{ top: ((now - hours.start) / ROW_MINUTES) * ROW_HEIGHT }}
              />
            ) : null}
          </div>

          {range.days.map((day) => {
            const placed = layoutDay(byDay[day.key] ?? []);
            const isToday = day.key === today;
            return (
              <div
                key={day.key}
                onClick={addAt(day.key)}
                title="Click an empty slot to add a patient"
                className="relative cursor-copy border-l border-line"
                style={{
                  height: bodyHeight,
                  backgroundColor: isToday
                    ? TODAY_TINT
                    : day.isWeekend
                      ? "#fbfcfd"
                      : undefined,
                }}
              >
                {/* half-hour rules, drawn once instead of one node per row */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(to bottom, var(--wl-line, #e6ecf3) 0 1px, transparent 1px " +
                      ROW_HEIGHT +
                      "px)",
                  }}
                />

                {isToday && showNow ? (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 z-10 border-t-2 border-coral"
                    style={{ top: ((now - hours.start) / ROW_MINUTES) * ROW_HEIGHT }}
                  >
                    <span className="absolute -left-1 -top-[5px] h-2 w-2 rounded-full bg-coral" />
                  </div>
                ) : null}

                {placed.map(({ lead, start, lane, lanes }) => (
                  <button
                    key={lead.id}
                    type="button"
                    onClick={(event) => onOpen(lead, event)}
                    title={`${formatSlotTime(lead.slotTime)} · ${lead.name}${
                      lead.treatment ? ` · ${lead.treatment}` : ""
                    }`}
                    className="absolute overflow-hidden rounded-[7px] border-l-[3px] px-1.5 py-1 text-left transition-shadow hover:z-20 hover:shadow-md"
                    style={{
                      ...blockStyle(lead, colours),
                      top: ((start - hours.start) / ROW_MINUTES) * ROW_HEIGHT + 1,
                      height: ROW_HEIGHT - 3,
                      left: `calc(${(lane / lanes) * 100}% + 1px)`,
                      width: `calc(${100 / lanes}% - 2px)`,
                    }}
                  >
                    <span className="block truncate text-[12px] font-bold leading-[1.25]">
                      {lead.name}
                    </span>
                    <span className="block truncate text-[10.5px] leading-[1.25] opacity-80">
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

function MonthGrid({ range, byDay, colours, empty, filtered, today, onOpen, onAdd, onDay }) {
  // Blank cells so the 1st sits under its real weekday.
  const firstWeekday = (() => {
    const day = range.days[0];
    const names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const index = names.indexOf(day.weekday);
    return index < 0 ? 0 : index;
  })();

  return (
    <div className="relative overflow-hidden">
      {empty ? <EmptyDiary filtered={filtered} /> : null}

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
              className="group/day relative min-h-[112px] border-b border-l border-line p-1.5 last:border-b-0"
            >
              {/* Reveals itself on hover, so a month of empty squares is not a
                  month of buttons. */}
              <button
                type="button"
                title={`Add a patient on ${day.dayNumber} ${day.month}`}
                onClick={() => onAdd(day.key)}
                className="absolute right-1.5 top-1.5 inline-flex h-6 w-6 items-center justify-center rounded-[7px] text-muted opacity-0 transition-opacity hover:bg-brand-50 hover:text-brand focus-visible:opacity-100 group-hover/day:opacity-100"
              >
                <UserPlus className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="sr-only">Add a patient</span>
              </button>

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
                    onClick={(event) => onOpen(lead, event)}
                    className="truncate rounded-[5px] border-l-[3px] px-1.5 py-0.5 text-left text-[11px] font-medium"
                    style={blockStyle(lead, colours)}
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

/**
 * Sits over an empty grid. Without it a filtered week reads as a broken screen
 * rather than a quiet one, and the reason is three panels away.
 */
function EmptyDiary({ filtered }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-1/2 z-10 flex -translate-y-1/2 flex-col items-center gap-2 px-6 text-center">
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#f0f4f9]">
        <CalendarOff className="h-5 w-5 text-muted" aria-hidden="true" />
      </span>
      <p className="text-[14.5px] font-semibold text-navy">
        {filtered ? "Nothing matches these filters" : "Nothing booked"}
      </p>
      <p className="max-w-[320px] text-[13px] leading-relaxed text-muted">
        {filtered
          ? "Clear the doctor or clinic filter, or try another week."
          : "Appointments booked through the website appear here. Click any empty slot to add a patient yourself."}
      </p>
    </div>
  );
}

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

/**
 * A row in the doctors or clinics card.
 *
 * A doctor's row is washed in that doctor's own colour — the same colour their
 * appointments wear on the grid — so the card reads as a key to the calendar
 * rather than a plain list. Rows without a colour (the "All" rows, and the
 * clinics) keep the panel's own selected blue.
 */
function FilterRow({ label, count, dot, title, active, onClick }) {
  const tinted = dot
    ? {
        // Two alpha steps of one hue: a whisper when idle, clearly filled when
        // chosen. Both stay light enough for the colour itself to be the text.
        backgroundColor: `${dot}${active ? "2b" : "12"}`,
        color: dot,
        boxShadow: active ? `inset 3px 0 0 ${dot}` : undefined,
      }
    : undefined;

  return (
    <button
      type="button"
      onClick={onClick}
      title={title ?? label}
      aria-pressed={active}
      style={tinted}
      className={`mb-1 flex w-full items-center gap-2 rounded-[8px] px-2 py-[7px] text-left text-[13px] transition-[filter,background-color] last:mb-0 hover:brightness-[0.96] ${
        dot
          ? active
            ? "font-semibold"
            : "font-medium"
          : active
            ? "bg-brand-50 font-semibold text-brand"
            : "font-medium text-navy hover:bg-[#f6f8fb]"
      }`}
    >
      {dot ? (
        <span
          aria-hidden="true"
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: dot }}
        />
      ) : (
        <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0" />
      )}
      <span className="min-w-0 flex-1 truncate">{label}</span>
      <span
        className={`shrink-0 text-[12px] tabular-nums ${
          dot ? "opacity-70" : active ? "text-brand" : "text-muted"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function Tally({ label, value, className }) {
  return (
    <div className={`rounded-[9px] px-2 py-2 text-center ${className}`}>
      <p className="text-[9.5px] font-bold uppercase tracking-[0.07em] opacity-70">
        {label}
      </p>
      <p className="text-[18px] font-bold leading-tight tabular-nums">{value}</p>
    </div>
  );
}

