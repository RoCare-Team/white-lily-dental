"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, Check, Loader2, Save, Trash2 } from "lucide-react";

import FieldRenderer from "@/components/admin/FieldRenderer";

/** Fields that need the full width of the form to be usable. */
const FULL_WIDTH = new Set(["textarea", "paragraphs", "list", "image"]);

/** Fields big enough to deserve a card of their own. */
const BLOCK_TYPES = new Set(["repeater", "group"]);

/**
 * The one editing screen for every content type. Fields, validation hints and
 * labels all come from the schema, so no content type needs its own form.
 */
export default function RecordForm({
  typeKey,
  schema,
  initial,
  recordId = null,
  mode = "collection",
  backHref,
}) {
  const router = useRouter();

  const [value, setValue] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);

  // Warn before losing edits to a browser refresh or a closed tab.
  useEffect(() => {
    if (!dirty) return;
    const warn = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const setField = (name, next) => {
    setValue((current) => ({ ...current, [name]: next }));
    setDirty(true);
    setSaved(false);
  };

  const endpoint = () => {
    if (mode === "singleton") return `/api/admin/singleton/${typeKey}`;
    if (recordId) return `/api/admin/content/${typeKey}/${recordId}`;
    return `/api/admin/content/${typeKey}`;
  };

  const method = () => {
    if (mode === "singleton") return "PUT";
    return recordId ? "PATCH" : "POST";
  };

  const save = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const response = await fetch(endpoint(), {
        method: method(),
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error ?? "Could not save.");
        return;
      }

      setDirty(false);
      setSaved(true);

      // A newly created record has its own URL — move there so a second save
      // updates it instead of creating a duplicate.
      if (mode === "collection" && !recordId && data.id) {
        router.replace(`/admin/content/${typeKey}/${data.id}`);
      }
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!confirm("Delete this permanently? It will disappear from the website.")) return;

    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/content/${typeKey}/${recordId}`, {
        method: "DELETE",
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error ?? "Could not delete.");
        return;
      }
      setDirty(false);
      router.push(backHref);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const simpleFields = schema.fields.filter((f) => !BLOCK_TYPES.has(f.type));
  const blockFields = schema.fields.filter((f) => BLOCK_TYPES.has(f.type));

  const heading =
    mode === "singleton"
      ? schema.label
      : recordId
        ? String(value[schema.titleField] || "").trim() ||
          `Edit ${schema.singular.toLowerCase()}`
        : `New ${schema.singular.toLowerCase()}`;

  const saveLabel = busy ? "Saving…" : saved && !dirty ? "Saved" : "Save changes";

  return (
    <form onSubmit={save}>
      {/* Sticky action bar — the form is long, so Save must always be reachable */}
      <div className="sticky top-16 z-20 -mx-4 mb-6 border-b border-line bg-[#f6f8fb]/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={backHref}
              className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-muted hover:text-brand"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              {schema.label}
            </Link>
            <h1 className="mt-0.5 truncate text-[19px] font-bold tracking-tight text-navy">
              {heading}
            </h1>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {dirty ? (
              <span className="hidden items-center gap-1.5 text-[12.5px] font-medium text-muted sm:inline-flex">
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full bg-coral"
                  aria-hidden="true"
                />
                Unsaved changes
              </span>
            ) : null}

            {recordId && mode === "collection" ? (
              <button
                type="button"
                onClick={remove}
                disabled={busy}
                className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-line bg-white px-3.5 text-[13.5px] font-semibold text-muted transition-colors hover:border-coral hover:text-coral-dark disabled:opacity-60"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            ) : null}

            <button
              type="submit"
              disabled={busy}
              className="inline-flex h-10 items-center gap-2 rounded-[10px] bg-deep px-5 text-[14px] font-semibold text-white transition-colors hover:bg-deep-600 disabled:opacity-60"
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : saved && !dirty ? (
                <Check className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Save className="h-4 w-4" aria-hidden="true" />
              )}
              {saveLabel}
            </button>
          </div>
        </div>
      </div>

      {schema.description ? (
        <p className="mb-5 text-[13.5px] text-muted">{schema.description}</p>
      ) : null}

      {error ? (
        <p
          role="alert"
          className="mb-5 flex items-start gap-2 rounded-[11px] border border-coral/40 bg-coral-50 p-3.5 text-[13.5px] leading-relaxed text-navy"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-coral-dark" aria-hidden="true" />
          {error}
        </p>
      ) : null}

      {saved && !dirty ? (
        <p
          role="status"
          className="mb-5 flex items-start gap-2 rounded-[11px] border border-teal/30 bg-teal-50 p-3.5 text-[13.5px] leading-relaxed text-navy"
        >
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" aria-hidden="true" />
          Saved — the website has been updated.
        </p>
      ) : null}

      <div className="space-y-5">
        {/* The plain fields share one card in two columns — a card per field
            turned a service into a wall of seventeen boxes. */}
        {simpleFields.length ? (
          <div className="rounded-[13px] border border-line bg-white p-4 sm:p-6">
            <div className="grid gap-5 sm:grid-cols-2">
              {simpleFields.map((field) => (
                <div
                  key={field.name}
                  className={FULL_WIDTH.has(field.type) ? "sm:col-span-2" : ""}
                >
                  <FieldRenderer
                    field={field}
                    value={value[field.name]}
                    onChange={(next) => setField(field.name, next)}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Repeaters and groups are substantial on their own, so each keeps
            its own card with its label as the heading. */}
        {blockFields.map((field) => (
          <div
            key={field.name}
            className="rounded-[13px] border border-line bg-white p-4 sm:p-6"
          >
            <FieldRenderer
              field={field}
              value={value[field.name]}
              onChange={(next) => setField(field.name, next)}
            />
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-deep px-6 text-[14.5px] font-semibold text-white transition-colors hover:bg-deep-600 disabled:opacity-60"
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Save className="h-4 w-4" aria-hidden="true" />
          )}
          {saveLabel}
        </button>
      </div>
    </form>
  );
}
