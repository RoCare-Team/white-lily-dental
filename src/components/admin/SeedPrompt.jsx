"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Database, Loader2 } from "lucide-react";

/**
 * Shown once, while the database is still empty. Copies the content that is
 * currently hard-coded on the website into MongoDB so it becomes editable.
 */
export default function SeedPrompt() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const seed = async () => {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/seed", { method: "POST" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error ?? "Import failed.");
        return;
      }
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-6 rounded-[14px] border border-brand/30 bg-brand-50 p-5">
      <div className="flex items-start gap-3">
        <Database className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
        <div className="min-w-0">
          <h2 className="text-[16px] font-bold text-navy">
            Import the website content
          </h2>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-navy/80">
            Your site is currently showing content that is built into the code.
            Import it once and every page becomes editable from this panel. The
            website looks exactly the same afterwards — nothing changes for
            visitors until you edit something.
          </p>

          {error ? (
            <p role="alert" className="mt-3 text-[13.5px] font-medium text-coral-dark">
              {error}
            </p>
          ) : null}

          <button
            type="button"
            onClick={seed}
            disabled={busy}
            className="mt-4 inline-flex h-10 items-center gap-2 rounded-[10px] bg-deep px-5 text-[14px] font-semibold text-white transition-colors hover:bg-deep-600 disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
            {busy ? "Importing…" : "Import content"}
          </button>
        </div>
      </div>
    </div>
  );
}
