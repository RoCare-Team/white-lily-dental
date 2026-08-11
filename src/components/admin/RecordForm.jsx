"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, Check, Loader2, Save, Trash2 } from "lucide-react";

import FieldRenderer from "@/components/admin/FieldRenderer";

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

  return (
    <form onSubmit={save}>
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-muted hover:text-brand"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        {schema.label}
      </Link>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight text-navy">
            {mode === "singleton"
              ? schema.label
              : recordId
                ? `Edit ${schema.singular.toLowerCase()}`
                : `New ${schema.singular.toLowerCase()}`}
          </h1>
          {schema.description ? (
            <p className="mt-1.5 text-[14px] text-muted">{schema.description}</p>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          {recordId && mode === "collection" ? (
            <button
              type="button"
              onClick={remove}
              disabled={busy}
              className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-line px-4 text-[13.5px] font-semibold text-muted transition-colors hover:border-coral hover:text-coral-dark disabled:opacity-60"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Delete
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
            {busy ? "Saving…" : saved && !dirty ? "Saved" : "Save changes"}
          </button>
        </div>
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

      {saved && !dirty ? (
        <p
          role="status"
          className="mt-5 flex items-start gap-2 rounded-[11px] border border-teal/30 bg-teal-50 p-3.5 text-[13.5px] leading-relaxed text-navy"
        >
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" aria-hidden="true" />
          Saved — the website has been updated.
        </p>
      ) : null}

      <div className="mt-6 space-y-6 rounded-[14px] border border-line bg-white p-5 sm:p-6">
        {schema.fields.map((field) => (
          <FieldRenderer
            key={field.name}
            field={field}
            value={value[field.name]}
            onChange={(next) => setField(field.name, next)}
          />
        ))}
      </div>

      <div className="mt-5 flex justify-end">
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
          {busy ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
