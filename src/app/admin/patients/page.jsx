import { UserRound } from "lucide-react";

export const dynamic = "force-dynamic";

/** Nothing chosen yet — the rail beside this is where the choosing happens. */
export default function AdminPatientsPage() {
  return (
    <div className="flex min-h-[380px] flex-col items-center justify-center gap-3 rounded-[14px] border border-dashed border-line bg-white px-6 py-16 text-center">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#f0f4f9]">
        <UserRound className="h-6 w-6 text-muted" aria-hidden="true" />
      </span>
      <p className="text-[16px] font-bold tracking-tight text-navy">
        Choose a patient
      </p>
      <p className="max-w-[380px] text-[13.5px] leading-relaxed text-muted">
        Pick someone from the list to see every appointment and message they have
        sent. Everyone who books or enquires through the website appears there.
      </p>
    </div>
  );
}
