/**
 * Date arithmetic for the appointments calendar.
 *
 * Every range is worked out on the server and handed to the client as plain
 * `YYYY-MM-DD` strings — the same shape slots are stored in. Nothing here
 * builds a Date from a stored key on the client, because the browser's
 * timezone would shift the day and put an appointment in the wrong column.
 */

import { DEFAULT_CLOSE, DEFAULT_OPEN, isValidTime, toDateKey } from "@/lib/slots";

export const SPANS = ["day", "week", "month"];

/** Height of one half-hour row, in pixels. Shared by the grid and its blocks. */
export const ROW_HEIGHT = 46;
export const ROW_MINUTES = 30;

export function parseDateKey(key) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(key ?? ""))) return null;
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

/** Monday, because a dental week runs Monday to Sunday on the rota. */
function startOfWeek(date) {
  const day = date.getDay();
  return addDays(date, day === 0 ? -6 : 1 - day);
}

export function minutesOf(time) {
  const [h, m] = String(time ?? "").split(":").map(Number);
  return Number.isFinite(h) && Number.isFinite(m) ? h * 60 + m : null;
}

/**
 * The days one screenful of calendar covers, plus the label above it.
 * `span` is day / week / month; `anchor` is any date inside the range.
 */
export function buildRange(span, anchorKey, todayKey) {
  const anchor = parseDateKey(anchorKey) ?? parseDateKey(todayKey) ?? new Date();
  const view = SPANS.includes(span) ? span : "week";

  let first;
  let count;

  if (view === "day") {
    first = anchor;
    count = 1;
  } else if (view === "month") {
    first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
    count = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0).getDate();
  } else {
    first = startOfWeek(anchor);
    count = 7;
  }

  const days = [];
  for (let i = 0; i < count; i += 1) {
    const date = addDays(first, i);
    days.push({
      key: toDateKey(date),
      weekday: date.toLocaleDateString("en-IN", { weekday: "short" }),
      dayNumber: date.getDate(),
      month: date.toLocaleDateString("en-IN", { month: "short" }),
      isWeekend: date.getDay() === 0,
    });
  }

  const last = addDays(first, count - 1);

  return {
    view,
    days,
    from: toDateKey(first),
    to: toDateKey(last),
    label: rangeLabel(view, first, last),
    // Where the arrows go. A month step lands on the 1st, so a short month
    // can never skip a whole month on the way past.
    previous: toDateKey(
      view === "month"
        ? new Date(first.getFullYear(), first.getMonth() - 1, 1)
        : addDays(first, -count)
    ),
    next: toDateKey(
      view === "month"
        ? new Date(first.getFullYear(), first.getMonth() + 1, 1)
        : addDays(first, count)
    ),
  };
}

function rangeLabel(view, first, last) {
  const opts = { day: "numeric", month: "short", year: "numeric" };

  if (view === "day") {
    return first.toLocaleDateString("en-IN", { weekday: "long", ...opts });
  }

  if (view === "month") {
    return first.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  }

  const sameMonth =
    first.getMonth() === last.getMonth() && first.getFullYear() === last.getFullYear();

  return sameMonth
    ? `${first.getDate()} – ${last.toLocaleDateString("en-IN", opts)}`
    : `${first.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} – ${last.toLocaleDateString("en-IN", opts)}`;
}

/**
 * The hours the grid has to cover: the earliest any clinic opens to the latest
 * any closes, so no appointment can fall outside the visible rows.
 */
export function gridHours(clinics = []) {
  let open = Infinity;
  let close = -Infinity;

  for (const clinic of clinics) {
    const o = minutesOf(isValidTime(clinic?.openTime) ? clinic.openTime : DEFAULT_OPEN);
    const c = minutesOf(isValidTime(clinic?.closeTime) ? clinic.closeTime : DEFAULT_CLOSE);
    if (o !== null) open = Math.min(open, o);
    if (c !== null) close = Math.max(close, c);
  }

  if (!Number.isFinite(open) || !Number.isFinite(close) || close <= open) {
    open = minutesOf(DEFAULT_OPEN);
    close = minutesOf(DEFAULT_CLOSE);
  }

  // Round out to whole hours so the gutter reads 11 AM, 12 PM, 1 PM…
  const start = Math.floor(open / 60) * 60;
  const end = Math.ceil(close / 60) * 60;

  const rows = [];
  for (let t = start; t < end; t += ROW_MINUTES) {
    rows.push({ minutes: t, isHour: t % 60 === 0 });
  }

  return { start, end, rows };
}

/**
 * Side-by-side placement for appointments that share a time. Each is given a
 * lane so two clinics booked at 12:00 sit next to each other instead of on top
 * of one another.
 */
export function layoutDay(appointments) {
  const sorted = [...appointments].sort(
    (a, b) => (minutesOf(a.slotTime) ?? 0) - (minutesOf(b.slotTime) ?? 0)
  );

  const placed = [];
  let cluster = [];
  let clusterEnd = -Infinity;

  const flush = () => {
    for (const item of cluster) item.lanes = cluster.length;
    placed.push(...cluster);
    cluster = [];
    clusterEnd = -Infinity;
  };

  for (const lead of sorted) {
    const start = minutesOf(lead.slotTime) ?? 0;
    if (start >= clusterEnd) flush();

    cluster.push({ lead, start, lane: cluster.length, lanes: 1 });
    clusterEnd = Math.max(clusterEnd, start + ROW_MINUTES);
  }
  flush();

  return placed;
}
