"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

/**
 * Catches a crash anywhere inside the admin panel. Without this, React unmounts
 * the whole tree and the browser is left on a blank "Application error" page
 * with the reason only in the console — which is no help to whoever is using
 * the panel. Here the message stays on screen, next to a way to retry.
 */
export default function AdminError({ error, reset }) {
  useEffect(() => {
    console.error("Admin panel error:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-[620px] py-10">
      <div className="rounded-[14px] border border-coral/30 bg-white p-6">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-coral-50 text-coral-dark">
          <AlertCircle className="h-5 w-5" aria-hidden="true" />
        </span>

        <h1 className="mt-4 text-[18px] font-bold tracking-tight text-navy">
          Something went wrong on this screen
        </h1>
        <p className="mt-1.5 text-[14px] leading-relaxed text-muted">
          Nothing has been lost — your leads and content are untouched. Try again,
          and if it keeps happening send the message below to your developer.
        </p>

        <pre className="mt-4 overflow-x-auto rounded-[10px] bg-[#f6f8fb] p-3.5 text-[12.5px] leading-relaxed text-navy">
          {error?.message || "Unknown error"}
          {error?.digest ? `\n\nDigest: ${error.digest}` : ""}
        </pre>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-10 items-center gap-2 rounded-[10px] bg-deep px-5 text-[14px] font-semibold text-white transition-colors hover:bg-deep-600"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Try again
          </button>
          <a
            href="/admin"
            className="inline-flex h-10 items-center rounded-[10px] border border-line px-4 text-[14px] font-semibold text-muted transition-colors hover:border-brand hover:text-brand"
          >
            Back to dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
