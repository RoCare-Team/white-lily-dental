/**
 * A colour per doctor.
 *
 * Assigned by the doctor's position in the admin list rather than hashed from
 * the name: a hash is stable but collides, and two doctors sharing a colour
 * defeats the whole point of colouring the diary by who is in it. Position is
 * stable too — the list is hand-ordered in the admin panel and rarely changes.
 */

/** Dark enough to read as text on a tint of itself, distinct from each other. */
export const DOCTOR_PALETTE = [
  "#1668c7", // blue
  "#0f8478", // teal
  "#9a5c07", // amber
  "#7b4fd0", // violet
  "#b0426d", // magenta
  "#2f7d32", // green
  "#c2544f", // red
  "#0e6a8f", // cyan
  "#6b6f18", // olive
  "#8a4b1f", // rust
];

/** Used when an appointment records no doctor at all. */
export const NO_DOCTOR_COLOUR = "#7c8fa3";

/** `[{ name }]` in admin order → `{ "Dr. Asha Rao": "#1668c7", … }` */
export function buildDoctorColours(doctors = []) {
  const map = {};
  let index = 0;
  for (const doctor of doctors) {
    const name = doctor?.name;
    if (!name || map[name]) continue;
    map[name] = DOCTOR_PALETTE[index % DOCTOR_PALETTE.length];
    index += 1;
  }
  return map;
}

/** Safe lookup: an unknown or missing doctor gets the neutral grey. */
export function colourFor(colours, name) {
  return (name && colours?.[name]) || NO_DOCTOR_COLOUR;
}
