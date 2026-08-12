/**
 * Appointment slots.
 *
 * A slot is one clinic, on one date, at one time. Slots are generated from the
 * clinic's opening hours rather than stored, so changing a clinic's hours in
 * the admin panel immediately changes what patients can book. Only *taken*
 * slots live in the database.
 */

export const DEFAULT_OPEN = "11:00";
export const DEFAULT_CLOSE = "19:30";
export const DEFAULT_SLOT_MINUTES = 30;

/** How far ahead patients may book. */
export const BOOKING_DAYS_AHEAD = 30;

/** Minutes of notice required — no booking a slot that is minutes away. */
const MIN_NOTICE_MINUTES = 60;

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isValidTime(value) {
  return TIME_RE.test(String(value ?? ""));
}

export function isValidDate(value) {
  return DATE_RE.test(String(value ?? ""));
}

function toMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function toTime(minutes) {
  const h = String(Math.floor(minutes / 60)).padStart(2, "0");
  const m = String(minutes % 60).padStart(2, "0");
  return `${h}:${m}`;
}

/** "14:30" → "2:30 PM" */
export function formatTime(time) {
  const [h, m] = time.split(":").map(Number);
  const period = h < 12 ? "AM" : "PM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

/** A YYYY-MM-DD string for a Date, in local time (not UTC). */
export function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** The dates patients may pick between, inclusive. */
export function bookingWindow(now = new Date()) {
  const last = new Date(now);
  last.setDate(last.getDate() + BOOKING_DAYS_AHEAD);
  return { min: toDateKey(now), max: toDateKey(last) };
}

/** Every slot a clinic runs on a given day, before availability is considered. */
export function generateSlots(clinic) {
  const open = isValidTime(clinic?.openTime) ? clinic.openTime : DEFAULT_OPEN;
  const close = isValidTime(clinic?.closeTime) ? clinic.closeTime : DEFAULT_CLOSE;
  const step = Number(clinic?.slotMinutes) > 0
    ? Number(clinic.slotMinutes)
    : DEFAULT_SLOT_MINUTES;

  const start = toMinutes(open);
  const end = toMinutes(close);
  if (end <= start) return [];

  const slots = [];
  // `< end` so a slot never starts at closing time.
  for (let t = start; t < end; t += step) slots.push(toTime(t));
  return slots;
}

/**
 * Slots a patient can actually pick: the clinic's slots for that date, minus
 * the ones already taken, minus anything too soon to be worth offering.
 */
export function availableSlots(clinic, dateKey, takenTimes = [], now = new Date()) {
  if (!isValidDate(dateKey)) return [];

  const window = bookingWindow(now);
  if (dateKey < window.min || dateKey > window.max) return [];

  const taken = new Set(takenTimes);
  const isToday = dateKey === toDateKey(now);
  const cutoff = now.getHours() * 60 + now.getMinutes() + MIN_NOTICE_MINUTES;

  return generateSlots(clinic).filter((time) => {
    if (taken.has(time)) return false;
    if (isToday && toMinutes(time) < cutoff) return false;
    return true;
  });
}
