"use client";

import { useId, useState } from "react";
import { Table2 } from "lucide-react";

/**
 * Dashboard charts, drawn as inline SVG — no charting dependency.
 *
 * The three series colours are the site's own brand tokens (brand blue,
 * coral-dark, teal), validated as a categorical set against the white card
 * surface: worst colour-blind separation ΔE 9.4 (target ≥ 8) and every hue
 * above 3:1 contrast. Do not re-tint them by eye.
 */
const SERIES = [
  { key: "appointments", label: "Appointments", color: "#1668c7" },
  { key: "enquiries", label: "Enquiries", color: "#d95653" },
  { key: "plans", label: "Package requests", color: "#12a594" },
];

const INK = { primary: "#0a2540", muted: "#5c6f85", grid: "#e5eaf1" };

/**
 * A tick step that keeps all four gridlines on whole numbers — the axis carries
 * the values that are not directly labelled, so half-labelled ticks are no use.
 */
function tickStep(peak) {
  const target = Math.max(4, peak) / 4;
  const magnitude = Math.pow(10, Math.floor(Math.log10(target)));
  for (const multiple of [1, 2, 2.5, 5, 10]) {
    const step = multiple * magnitude;
    if (step >= target && Number.isInteger(step)) return step;
  }
  return Math.ceil(target);
}

export default function DashboardCharts({ months, treatments }) {
  return (
    <div className="mt-6 grid gap-5 lg:grid-cols-5">
      <Card
        className="lg:col-span-3"
        title="Activity by month"
        subtitle="When requests came in, over the last 12 months."
      >
        <MonthlyChart months={months} />
      </Card>

      <Card
        className="lg:col-span-2"
        title="Most requested treatments"
        subtitle="Across every enquiry and booking."
      >
        <TreatmentChart treatments={treatments} />
      </Card>
    </div>
  );
}

function Card({ title, subtitle, className = "", children }) {
  return (
    <section
      className={`overflow-hidden rounded-[14px] border border-line bg-white ${className}`}
    >
      <div className="border-b border-line px-5 py-4">
        <h2 className="text-[14.5px] font-bold text-navy">{title}</h2>
        <p className="mt-0.5 text-[12.5px] text-muted">{subtitle}</p>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

/* ── Grouped columns: three series across twelve months ─────────────────── */

function MonthlyChart({ months }) {
  const [hover, setHover] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const titleId = useId();

  const W = 720;
  const H = 260;
  const PAD = { top: 12, right: 12, bottom: 30, left: 34 };
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;

  const peak = Math.max(
    1,
    ...months.flatMap((m) => SERIES.map((s) => m[s.key] ?? 0))
  );
  const step = tickStep(peak);
  const max = step * 4;
  const ticks = [0, step, step * 2, step * 3, max];

  const band = plotW / months.length;
  // 2px of surface between neighbouring bars is the separator — never a stroke.
  const GAP = 2;
  const barW = Math.min(18, (band * 0.7 - GAP * (SERIES.length - 1)) / SERIES.length);
  const groupW = barW * SERIES.length + GAP * (SERIES.length - 1);

  const y = (value) => PAD.top + plotH - (value / max) * plotH;

  const total = months.reduce(
    (sum, m) => sum + m.appointments + m.enquiries + m.plans,
    0
  );

  return (
    <div>
      <Legend />

      {total === 0 ? (
        <p className="py-10 text-center text-[13.5px] text-muted">
          Nothing yet — the chart fills in as enquiries and bookings arrive.
        </p>
      ) : (
        <div className="relative mt-4">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full"
            role="img"
            aria-labelledby={titleId}
          >
            <title id={titleId}>
              Appointments, enquiries and package requests per month for the last
              twelve months
            </title>

            {ticks.map((tick) => (
              <g key={tick}>
                <line
                  x1={PAD.left}
                  x2={W - PAD.right}
                  y1={y(tick)}
                  y2={y(tick)}
                  stroke={INK.grid}
                  strokeWidth="1"
                />
                <text
                  x={PAD.left - 8}
                  y={y(tick) + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill={INK.muted}
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {tick}
                </text>
              </g>
            ))}

            {months.map((month, i) => {
              const x0 = PAD.left + band * i;
              const start = x0 + (band - groupW) / 2;

              return (
                <g key={month.key}>
                  {/* Full-height band: a comfortable hover target, not a pinpoint bar */}
                  <rect
                    x={x0}
                    y={PAD.top}
                    width={band}
                    height={plotH}
                    fill={hover === i ? "rgba(22,104,199,0.06)" : "transparent"}
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(null)}
                  />

                  {SERIES.map((series, s) => {
                    const value = month[series.key] ?? 0;
                    if (value === 0) return null;
                    const h = plotH - (y(value) - PAD.top);
                    return (
                      <rect
                        key={series.key}
                        x={start + s * (barW + GAP)}
                        y={y(value)}
                        width={barW}
                        height={h}
                        rx="3"
                        fill={series.color}
                        pointerEvents="none"
                      />
                    );
                  })}

                  <text
                    x={x0 + band / 2}
                    y={H - 10}
                    textAnchor="middle"
                    fontSize="11"
                    fill={hover === i ? INK.primary : INK.muted}
                    pointerEvents="none"
                  >
                    {month.label}
                  </text>
                </g>
              );
            })}

            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={y(0)}
              y2={y(0)}
              stroke="#c8d2de"
              strokeWidth="1"
            />
          </svg>

          {hover !== null ? (
            <div
              className="pointer-events-none absolute top-0 z-10 min-w-[150px] rounded-[10px] border border-line bg-white p-3 shadow-lg"
              style={{
                left: `${((hover + 0.5) / months.length) * 100}%`,
                transform: `translateX(${hover > months.length / 2 ? "-110%" : "10%"})`,
              }}
            >
              <p className="text-[12.5px] font-bold text-navy">
                {months[hover].full}
              </p>
              <ul className="mt-1.5 space-y-1">
                {SERIES.map((series) => (
                  <li
                    key={series.key}
                    className="flex items-center justify-between gap-4 text-[12px]"
                  >
                    <span className="flex items-center gap-1.5 text-muted">
                      <span
                        className="inline-block h-2 w-2 rounded-full"
                        style={{ backgroundColor: series.color }}
                        aria-hidden="true"
                      />
                      {series.label}
                    </span>
                    <span className="font-semibold tabular-nums text-navy">
                      {months[hover][series.key] ?? 0}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}

      <TableToggle open={showTable} onToggle={() => setShowTable((v) => !v)}>
        <table className="w-full border-collapse text-left text-[12.5px]">
          <thead>
            <tr className="border-b border-line text-muted">
              <th className="py-1.5 pr-3 font-semibold">Month</th>
              {SERIES.map((s) => (
                <th key={s.key} className="py-1.5 pr-3 text-right font-semibold">
                  {s.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {months.map((month) => (
              <tr key={month.key} className="border-b border-line/60 last:border-0">
                <td className="py-1.5 pr-3 text-navy">{month.full}</td>
                {SERIES.map((s) => (
                  <td
                    key={s.key}
                    className="py-1.5 pr-3 text-right tabular-nums text-navy"
                  >
                    {month[s.key] ?? 0}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </TableToggle>
    </div>
  );
}

function Legend() {
  return (
    <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
      {SERIES.map((series) => (
        <li key={series.key} className="flex items-center gap-2 text-[12.5px] text-muted">
          <span
            className="inline-block h-2.5 w-2.5 rounded-sm"
            style={{ backgroundColor: series.color }}
            aria-hidden="true"
          />
          {series.label}
        </li>
      ))}
    </ul>
  );
}

/* ── Horizontal bars: one series, so one colour and no legend ───────────── */

function TreatmentChart({ treatments }) {
  const [showTable, setShowTable] = useState(false);

  if (!treatments.length) {
    return (
      <p className="py-10 text-center text-[13.5px] text-muted">
        No treatments recorded yet.
      </p>
    );
  }

  const max = Math.max(...treatments.map((t) => t.count));

  return (
    <div>
      <ul className="space-y-3">
        {treatments.map((treatment) => (
          <li key={treatment.name}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="truncate text-[13px] text-navy">{treatment.name}</span>
              <span className="shrink-0 text-[13px] font-semibold tabular-nums text-navy">
                {treatment.count}
              </span>
            </div>
            <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[#eef2f7]">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.max(4, (treatment.count / max) * 100)}%`,
                  backgroundColor: SERIES[0].color,
                }}
              />
            </div>
          </li>
        ))}
      </ul>

      <TableToggle open={showTable} onToggle={() => setShowTable((v) => !v)}>
        <table className="w-full border-collapse text-left text-[12.5px]">
          <thead>
            <tr className="border-b border-line text-muted">
              <th className="py-1.5 pr-3 font-semibold">Treatment</th>
              <th className="py-1.5 text-right font-semibold">Requests</th>
            </tr>
          </thead>
          <tbody>
            {treatments.map((t) => (
              <tr key={t.name} className="border-b border-line/60 last:border-0">
                <td className="py-1.5 pr-3 text-navy">{t.name}</td>
                <td className="py-1.5 text-right tabular-nums text-navy">{t.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableToggle>
    </div>
  );
}

/**
 * Every chart ships a table twin — the tooltip enhances the chart, it never
 * gates the numbers.
 */
function TableToggle({ open, onToggle, children }) {
  return (
    <div className="mt-5 border-t border-line pt-3">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-muted transition-colors hover:text-brand"
      >
        <Table2 className="h-3.5 w-3.5" aria-hidden="true" />
        {open ? "Hide table" : "View as table"}
      </button>

      {open ? <div className="mt-3 overflow-x-auto">{children}</div> : null}
    </div>
  );
}
