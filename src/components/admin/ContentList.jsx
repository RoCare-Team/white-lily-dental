"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  ImageIcon,
  Loader2,
  Pencil,
  Plus,
  Search,
} from "lucide-react";

import PageTitle from "@/components/admin/PageTitle";

/**
 * Listing screen for one content type: search, reorder, open for editing, add.
 * Order is what the website renders in, so it is saved as soon as it changes.
 */
export default function ContentList({ typeKey, schema, items }) {
  const router = useRouter();

  const [rows, setRows] = useState(items);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // The server sends a fresh list on every navigation — adopt it during
  // render instead of after paint, so the old rows never flash.
  const [lastItems, setLastItems] = useState(items);
  if (lastItems !== items) {
    setLastItems(items);
    setRows(items);
  }

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

  const term = query.trim().toLowerCase();
  const visible = term
    ? rows.filter((row) =>
        [row[schema.titleField], row[schema.subtitleField]]
          .join(" ")
          .toLowerCase()
          .includes(term)
      )
    : rows;

  // Reordering swaps neighbours in the full list, so it only makes sense
  // while every row is on screen.
  const canReorder = schema.ordered && !term;

  return (
    <>
      <PageTitle title={schema.label} subtitle={schema.description}>
        <Link
          href={`/admin/content/${typeKey}/new`}
          className="inline-flex h-10 items-center gap-2 rounded-[10px] bg-deep px-4 text-[14px] font-semibold text-white transition-colors hover:bg-deep-600"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add {schema.singular.toLowerCase()}
        </Link>
      </PageTitle>

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
        <div className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-3">
          <div className="relative min-w-[200px] flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Search ${schema.label.toLowerCase()}`}
              aria-label={`Search ${schema.label}`}
              className="h-9 w-full rounded-[9px] border border-line bg-[#fafbfc] pl-9 pr-3 text-[13.5px] text-navy outline-none transition-colors placeholder:text-muted/60 focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/15"
            />
          </div>

          <p className="shrink-0 text-[12.5px] text-muted">
            {visible.length} of {rows.length}
          </p>

          {busy ? (
            <span className="inline-flex shrink-0 items-center gap-1.5 text-[12.5px] text-muted">
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              Saving order
            </span>
          ) : null}
        </div>

        {visible.length === 0 ? (
          <div className="flex flex-col items-center gap-2.5 px-6 py-16 text-center">
            <FileText className="h-8 w-8 text-muted/50" aria-hidden="true" />
            <p className="text-[15px] font-semibold text-navy">
              {term ? "Nothing matches that search" : "Nothing here yet"}
            </p>
            <p className="max-w-[400px] text-[13.5px] leading-relaxed text-muted">
              {term
                ? "Try a different word, or clear the search box."
                : `The website is still showing its built-in ${schema.label.toLowerCase()}. Import the content from the dashboard, or add the first one here.`}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-line/70">
            {visible.map((row) => {
              const index = rows.indexOf(row);
              const image = schema.imageField ? row[schema.imageField] : null;

              return (
                <li
                  key={row._id}
                  className="group relative flex cursor-pointer items-center gap-3 px-4 py-2.5 transition-colors hover:bg-[#fafbfc]"
                >
                  <span className="w-6 shrink-0 text-[12.5px] tabular-nums text-muted/70">
                    {index + 1}
                  </span>

                  {schema.imageField ? (
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[8px] border border-line bg-[#f6f8fb]">
                      {image ? (
                        // Sources are arbitrary and admin-only — next/image cannot
                        // pre-configure hosts the editor might paste.
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={image} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <ImageIcon className="h-4 w-4 text-muted/50" aria-hidden="true" />
                      )}
                    </span>
                  ) : null}

                  <Link
                    href={`/admin/content/${typeKey}/${row._id}`}
                    className="min-w-0 flex-1 py-1 outline-none after:absolute after:inset-0 after:content-[''] focus-visible:ring-2 focus-visible:ring-brand/40"
                  >
                    <span className="block truncate text-[14px] font-semibold text-navy group-hover:text-brand">
                      {row[schema.titleField] || "Untitled"}
                    </span>
                    {schema.subtitleField ? (
                      <span className="mt-0.5 block truncate text-[12.5px] text-muted">
                        {row[schema.subtitleField] || "—"}
                      </span>
                    ) : null}
                  </Link>

                  <div className="relative z-10 flex shrink-0 items-center gap-1">
                    {canReorder ? (
                      <>
                        <IconButton
                          onClick={() => move(index, -1)}
                          disabled={busy || index === 0}
                          title="Move up"
                          icon={ChevronUp}
                        />
                        <IconButton
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
              );
            })}
          </ul>
        )}
      </div>

      {schema.ordered ? (
        <p className="mt-3 text-[12.5px] text-muted">
          The order here is the order visitors see on the website.
          {term ? " Clear the search to reorder." : ""}
        </p>
      ) : null}
    </>
  );
}

function IconButton({ onClick, disabled, title, icon: Icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-brand-50 hover:text-brand disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-muted"
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      <span className="sr-only">{title}</span>
    </button>
  );
}
