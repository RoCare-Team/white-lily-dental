"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Loader2, Search, UserRound } from "lucide-react";

const TABS = [
  { value: "today", label: "Today" },
  { value: "recent", label: "Recent" },
  { value: "all", label: "All" },
];

/**
 * The list of patients, kept beside the record so moving between people never
 * means going back first. It sits in a layout, so it fetches its own data —
 * layouts get no search params, and re-rendering it would reload the record.
 */
export default function PatientsRail() {
  const pathname = usePathname();
  const selected = pathname.startsWith("/admin/patients/")
    ? decodeURIComponent(pathname.slice("/admin/patients/".length))
    : "";

  const [tab, setTab] = useState("recent");
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState([]);
  const [state, setState] = useState("loading");

  useEffect(() => {
    const controller = new AbortController();
    // Debounced, so typing a name does not fire a query per keystroke.
    const timer = setTimeout(async () => {
      setState("loading");
      try {
        const params = new URLSearchParams({ tab });
        if (search.trim()) params.set("q", search.trim());

        const response = await fetch(`/api/admin/patients?${params}`, {
          signal: controller.signal,
        });
        const data = await response.json();

        if (!response.ok) throw new Error(data.error);
        setPatients(data.patients ?? []);
        setState("ready");
      } catch (error) {
        if (error.name !== "AbortError") setState("error");
      }
    }, search ? 350 : 0);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [tab, search]);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[14px] border border-line bg-white">
      <div className="shrink-0 border-b border-line px-3 pb-2.5 pt-3">
        <div className="flex gap-1">
          {TABS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setTab(option.value)}
              aria-pressed={tab === option.value}
              className={`h-7 flex-1 rounded-[7px] text-[12.5px] font-semibold transition-colors ${
                tab === option.value
                  ? "bg-deep text-white"
                  : "text-muted hover:bg-[#f0f4f9] hover:text-navy"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="relative mt-2.5">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search patients"
            aria-label="Search patients"
            className="h-9 w-full rounded-[8px] border border-line bg-[#fafbfc] pl-8.5 pr-3 text-[13px] text-navy outline-none transition-colors placeholder:text-muted/60 focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/15"
            style={{ paddingLeft: 32 }}
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {state === "loading" && patients.length === 0 ? (
          <p className="flex items-center justify-center gap-2 px-4 py-10 text-[13px] text-muted">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Loading
          </p>
        ) : state === "error" ? (
          <p className="px-4 py-10 text-center text-[13px] leading-relaxed text-muted">
            Could not load the patient list.
          </p>
        ) : patients.length === 0 ? (
          <p className="flex flex-col items-center gap-2 px-4 py-10 text-center text-[13px] leading-relaxed text-muted">
            <UserRound className="h-6 w-6 text-muted/50" aria-hidden="true" />
            {search ? "Nobody matches that search." : "No patients in this view."}
          </p>
        ) : (
          <ul>
            {patients.map((patient) => {
              const active = patient.id === selected;
              return (
                <li key={patient.id}>
                  <Link
                    href={`/admin/patients/${patient.id}`}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-2.5 border-l-[3px] px-3 py-2.5 outline-none transition-colors ${
                      active
                        ? "border-l-brand bg-brand-50"
                        : "border-l-transparent hover:bg-[#f6f8fb] focus-visible:bg-[#f6f8fb]"
                    }`}
                  >
                    <span
                      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${
                        active ? "bg-brand text-white" : "bg-[#f0f4f9] text-navy"
                      }`}
                    >
                      {(patient.name || "?").charAt(0).toUpperCase()}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span
                        className={`block truncate text-[13.5px] ${
                          active ? "font-bold text-brand" : "font-semibold text-navy"
                        }`}
                      >
                        {patient.name}
                      </span>
                      <span className="block truncate text-[12px] text-muted">
                        {patient.phone}
                      </span>
                    </span>

                    {patient.nextSlot ? (
                      <span
                        title="Has an upcoming appointment"
                        className="h-2 w-2 shrink-0 rounded-full bg-teal"
                      />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <p className="shrink-0 border-t border-line px-3 py-2 text-[11.5px] text-muted">
        {patients.length} {patients.length === 1 ? "patient" : "patients"}
      </p>
    </div>
  );
}
