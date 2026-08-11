"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Loader2,
  Pencil,
  Plus,
} from "lucide-react";

/**
 * Listing screen for one content type: reorder, open for editing, or add.
 * Order is what the website renders in, so it is saved as soon as it changes.
 */
export default function ContentList({ typeKey, schema, items }) {
  const router = useRouter();

  const [rows, setRows] = useState(items);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setRows(items);
  }, [items]);

  const move = async (index, delta) => {
    const target = index + delta;
    if (target < 0 || target >= rows.length) return;

    const next = [...rows];
    [next[index], next[target]] = [next[target], next[index]];

    // Optimistic — the list is small and a failure restores the server order.
    setRows(next);
    setBusy(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/content/${typeKey}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: next.map((row) => row._id) }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error ?? "Could not save the new order.");
        setRows(items);
        return;
      }
      router.refresh();
    } catch {
      setError("Network error. The order was not saved.");
      setRows(items);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight text-navy">
            {schema.label}
          </h1>
          <p className="mt-1.5 text-[14px] text-muted">{schema.description}</p>
        </div>

        <Link
          href={`/admin/content/${typeKey}/new`}
          className="inline-flex h-10 items-center gap-2 rounded-[10px] bg-deep px-4 text-[14px] font-semibold text-white transition-colors hover:bg-deep-600"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add {schema.singular.toLowerCase()}
        </Link>
      </div>

      {error ? (
        <p
          role="alert"
          className="mt-5 flex items-start gap-2 rounded-[11px] border border-coral/40 bg-coral-50 p-3.5 text-[13.5px] leading-relaxed text-navy"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-coral-dark" aria-hidden="true" />
          {error}
        </p>
      ) : null}

      <div className="mt-6 overflow-hidden rounded-[14px] border border-line bg-white">
        {rows.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <FileText className="h-8 w-8 text-muted/60" aria-hidden="true" />
            <p className="text-[15px] font-semibold text-navy">Nothing here yet</p>
            <p className="max-w-[400px] text-[13.5px] leading-relaxed text-muted">
              The website is still showing its built-in {schema.label.toLowerCase()}.
              Import the content from the dashboard, or add the first one here.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-line/70">
            {rows.map((row, index) => (
              <li key={row._id} className="flex items-center gap-3 px-4 py-3">
                <span className="w-6 shrink-0 text-[13px] tabular-nums text-muted">
                  {index + 1}
                </span>

                <Link
                  href={`/admin/content/${typeKey}/${row._id}`}
                  className="group min-w-0 flex-1"
                >
                  <span className="block truncate text-[14.5px] font-semibold text-navy group-hover:text-brand">
                    {row[schema.titleField] || "Untitled"}
                  </span>
                  {schema.subtitleField ? (
                    <span className="mt-0.5 block truncate text-[13px] text-muted">
                      {row[schema.subtitleField] || "—"}
                    </span>
                  ) : null}
                </Link>

                <div className="flex shrink-0 items-center gap-1">
                  {schema.ordered ? (
                    <>
                      <OrderButton
                        onClick={() => move(index, -1)}
                        disabled={busy || index === 0}
                        title="Move up"
                        icon={ChevronUp}
                      />
                      <OrderButton
                        onClick={() => move(index, 1)}
                        disabled={busy || index === rows.length - 1}
                        title="Move down"
                        icon={ChevronDown}
                      />
                    </>
                  ) : null}

                  <Link
                    href={`/admin/content/${typeKey}/${row._id}`}
                    title="Edit"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-brand-50 hover:text-brand"
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    <span className="sr-only">Edit</span>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {busy ? (
        <p className="mt-3 flex items-center gap-2 text-[13px] text-muted">
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
          Saving order…
        </p>
      ) : null}
    </>
  );
}

function OrderButton({ onClick, disabled, title, icon: Icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-brand-50 hover:text-brand disabled:opacity-30"
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      <span className="sr-only">{title}</span>
    </button>
  );
}
