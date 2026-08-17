"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ImageIcon,
  Loader2,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";

import { getIcon, ICON_NAMES } from "@/lib/icons";

const input =
  "h-10 w-full rounded-[9px] border border-line bg-white px-3 text-[14px] text-navy outline-none transition-colors placeholder:text-muted/60 focus:border-brand focus:ring-2 focus:ring-brand/15";

const textarea =
  "w-full rounded-[9px] border border-line bg-white px-3 py-2.5 text-[14px] leading-relaxed text-navy outline-none transition-colors placeholder:text-muted/60 focus:border-brand focus:ring-2 focus:ring-brand/15";

const label = "block text-[13px] font-semibold text-navy";

/** Renders one schema field. Recurses for groups and repeaters. */
export default function FieldRenderer({ field, value, onChange, id }) {
  const fieldId = id ?? field.name;

  if (field.type === "group") {
    return (
      <fieldset className="rounded-[11px] border border-line bg-[#fafbfc] p-4">
        <legend className="px-1.5 text-[13px] font-semibold text-navy">
          {field.label}
        </legend>
        <div className="mt-2 grid gap-4 sm:grid-cols-2">
          {field.fields.map((sub) => (
            <FieldRenderer
              key={sub.name}
              field={sub}
              id={`${fieldId}-${sub.name}`}
              value={value?.[sub.name]}
              onChange={(next) => onChange({ ...(value ?? {}), [sub.name]: next })}
            />
          ))}
        </div>
      </fieldset>
    );
  }

  if (field.type === "repeater") {
    return (
      <RepeaterField field={field} value={value} onChange={onChange} id={fieldId} />
    );
  }

  if (field.type === "list" || field.type === "paragraphs") {
    return (
      <StringListField field={field} value={value} onChange={onChange} id={fieldId} />
    );
  }

  return (
    <div>
      <label className={label} htmlFor={fieldId}>
        {field.label}
        {field.required ? <span className="text-coral"> *</span> : null}
      </label>

      <div className="mt-1.5">
        <ScalarInput field={field} value={value} onChange={onChange} id={fieldId} />
      </div>

      {field.help ? (
        <p className="mt-1.5 text-[12px] leading-relaxed text-muted">{field.help}</p>
      ) : null}
    </div>
  );
}

function ScalarInput({ field, value, onChange, id }) {
  switch (field.type) {
    case "textarea":
      return (
        <textarea
          id={id}
          rows={field.rows ?? 4}
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
          className={textarea}
        />
      );

    case "number":
      return (
        <input
          id={id}
          type="number"
          min={field.min}
          max={field.max}
          value={value ?? 0}
          onChange={(event) => onChange(Number(event.target.value))}
          className={input}
        />
      );

    case "boolean":
      return (
        <label className="inline-flex cursor-pointer items-center gap-2.5 text-[14px] text-navy">
          <input
            id={id}
            type="checkbox"
            checked={Boolean(value)}
            onChange={(event) => onChange(event.target.checked)}
            className="h-4 w-4 rounded border-line text-brand focus:ring-brand/30"
          />
          Yes
        </label>
      );

    case "select":
      return (
        <select
          id={id}
          value={value ?? field.default ?? field.options[0]}
          onChange={(event) => onChange(event.target.value)}
          className={input}
        >
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );

    case "date":
    case "time":
      return (
        <input
          id={id}
          type={field.type}
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
          className={input}
        />
      );

    case "colour":
      return (
        <div className="flex gap-2">
          <input
            type="color"
            aria-label={`${field.label} colour picker`}
            value={/^#[0-9a-fA-F]{6}$/.test(value ?? "") ? value : "#1668c7"}
            onChange={(event) => onChange(event.target.value)}
            className="h-10 w-12 shrink-0 cursor-pointer rounded-[9px] border border-line bg-white p-1"
          />
          <input
            id={id}
            type="text"
            value={value ?? ""}
            placeholder="#1668c7"
            onChange={(event) => onChange(event.target.value)}
            className={input}
          />
        </div>
      );

    case "icon":
      return <IconPicker value={value} onChange={onChange} id={id} />;

    case "image":
      return <ImageField value={value} onChange={onChange} id={id} />;

    default:
      return (
        <input
          id={id}
          type="text"
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
          className={input}
        />
      );
  }
}

function IconPicker({ value, onChange, id }) {
  const Preview = getIcon(value);
  return (
    <div className="flex items-center gap-2.5">
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[9px] bg-brand-50 text-brand">
        {/* getIcon returns a module-level lucide component — nothing is
            created per render, but the rule cannot see through the lookup. */}
        {/* eslint-disable-next-line react-hooks/static-components */}
        <Preview className="h-5 w-5" aria-hidden="true" />
      </span>
      <select
        id={id}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value || null)}
        className={input}
      >
        <option value="">No icon</option>
        {ICON_NAMES.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}

function ImageField({ value, onChange, id }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const upload = async (event) => {
    const file = event.target.files?.[0];
    // Let the same file be picked again after an error.
    event.target.value = "";
    if (!file) return;

    setBusy(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error ?? "Upload failed.");
        return;
      }
      onChange(data.url);
    } catch {
      setError("Network error while uploading.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="flex gap-3">
        <span className="flex h-[72px] w-[96px] shrink-0 items-center justify-center overflow-hidden rounded-[9px] border border-line bg-[#fafbfc]">
          {value ? (
            // A plain <img>: sources are arbitrary and change at runtime, which
            // next/image cannot pre-configure. This is admin-only, not the site.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="h-5 w-5 text-muted/60" aria-hidden="true" />
          )}
        </span>

        <div className="min-w-0 flex-1 space-y-2">
          <input
            id={id}
            type="text"
            value={value ?? ""}
            placeholder="Paste an image URL, or upload a file"
            onChange={(event) => onChange(event.target.value)}
            className={input}
          />

          <div className="flex items-center gap-2">
            <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-[9px] border border-line bg-white px-3 text-[13px] font-semibold text-navy transition-colors hover:border-brand hover:text-brand">
              {busy ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <Upload className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {busy ? "Uploading…" : "Upload"}
              <input
                type="file"
                accept="image/*"
                onChange={upload}
                disabled={busy}
                className="sr-only"
              />
            </label>

            {value ? (
              <button
                type="button"
                onClick={() => onChange("")}
                className="text-[13px] font-medium text-muted hover:text-coral-dark"
              >
                Remove
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {error ? (
        <p role="alert" className="mt-2 text-[12.5px] font-medium text-coral-dark">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function StringListField({ field, value, onChange, id }) {
  const rows = Array.isArray(value) ? value : [];
  const isLong = field.type === "paragraphs";

  const update = (index, next) =>
    onChange(rows.map((row, i) => (i === index ? next : row)));

  const move = (index, delta) => {
    const target = index + delta;
    if (target < 0 || target >= rows.length) return;
    const next = [...rows];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div>
      <p className={label}>{field.label}</p>

      <div className="mt-1.5 space-y-2">
        {rows.map((row, index) => (
          <div key={index} className="flex items-start gap-2">
            {isLong ? (
              <textarea
                id={index === 0 ? id : undefined}
                rows={3}
                value={row}
                onChange={(event) => update(index, event.target.value)}
                className={textarea}
                aria-label={`${field.label} ${index + 1}`}
              />
            ) : (
              <input
                id={index === 0 ? id : undefined}
                type="text"
                value={row}
                onChange={(event) => update(index, event.target.value)}
                className={input}
                aria-label={`${field.label} ${index + 1}`}
              />
            )}

            <div className="flex shrink-0 gap-1 pt-0.5">
              <RowButton
                onClick={() => move(index, -1)}
                disabled={index === 0}
                title="Move up"
                icon={ChevronUp}
              />
              <RowButton
                onClick={() => move(index, 1)}
                disabled={index === rows.length - 1}
                title="Move down"
                icon={ChevronDown}
              />
              <RowButton
                onClick={() => onChange(rows.filter((_, i) => i !== index))}
                title="Remove"
                icon={Trash2}
                danger
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onChange([...rows, ""])}
        className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand hover:text-brand-dark"
      >
        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
        Add {field.label.toLowerCase().replace(/s$/, "")}
      </button>

      {field.help ? (
        <p className="mt-1.5 text-[12px] leading-relaxed text-muted">{field.help}</p>
      ) : null}
    </div>
  );
}

function RepeaterField({ field, value, onChange, id }) {
  const rows = Array.isArray(value) ? value : [];
  const [open, setOpen] = useState(() => new Set());

  const toggle = (index) =>
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });

  const blank = () =>
    Object.fromEntries(
      field.fields.map((sub) => [
        sub.name,
        sub.default ??
          (["list", "paragraphs", "repeater"].includes(sub.type)
            ? []
            : sub.type === "boolean"
              ? false
              : sub.type === "number"
                ? 0
                : ""),
      ])
    );

  const update = (index, next) =>
    onChange(rows.map((row, i) => (i === index ? next : row)));

  const move = (index, delta) => {
    const target = index + delta;
    if (target < 0 || target >= rows.length) return;
    const next = [...rows];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
    // Keep the panel that was open following its row.
    setOpen((current) => {
      const set = new Set(current);
      const wasOpen = set.has(index);
      const targetOpen = set.has(target);
      set.delete(index);
      set.delete(target);
      if (wasOpen) set.add(target);
      if (targetOpen) set.add(index);
      return set;
    });
  };

  const remove = (index) => {
    if (!confirm("Remove this item?")) return;
    onChange(rows.filter((_, i) => i !== index));
    setOpen(new Set());
  };

  return (
    <div id={id}>
      <div className="flex items-center justify-between gap-3">
        <p className={label}>{field.label}</p>
        <span className="text-[12px] text-muted">
          {rows.length} item{rows.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="mt-2 space-y-2">
        {rows.map((row, index) => {
          const isOpen = open.has(index);
          const heading =
            String(row?.[field.itemLabel] ?? "").trim() || `Item ${index + 1}`;

          return (
            <div
              key={index}
              className="overflow-hidden rounded-[11px] border border-line bg-white"
            >
              <div className="flex items-center gap-2 bg-[#fafbfc] px-2.5 py-2">
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                >
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                  ) : (
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                  )}
                  <span className="truncate text-[13.5px] font-semibold text-navy">
                    {heading}
                  </span>
                </button>

                <div className="flex shrink-0 gap-1">
                  <RowButton
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    title="Move up"
                    icon={ChevronUp}
                  />
                  <RowButton
                    onClick={() => move(index, 1)}
                    disabled={index === rows.length - 1}
                    title="Move down"
                    icon={ChevronDown}
                  />
                  <RowButton
                    onClick={() => remove(index)}
                    title="Remove"
                    icon={Trash2}
                    danger
                  />
                </div>
              </div>

              {isOpen ? (
                <div className="space-y-4 border-t border-line px-3.5 py-4">
                  {field.fields.map((sub) => (
                    <FieldRenderer
                      key={sub.name}
                      field={sub}
                      id={`${id}-${index}-${sub.name}`}
                      value={row?.[sub.name]}
                      onChange={(next) => update(index, { ...(row ?? {}), [sub.name]: next })}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => {
          onChange([...rows, blank()]);
          setOpen((current) => new Set(current).add(rows.length));
        }}
        className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand hover:text-brand-dark"
      >
        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
        Add {field.label.toLowerCase().replace(/s$/, "")}
      </button>

      {field.help ? (
        <p className="mt-1.5 text-[12px] leading-relaxed text-muted">{field.help}</p>
      ) : null}
    </div>
  );
}

function RowButton({ onClick, disabled, title, icon: Icon, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors disabled:opacity-30 ${
        danger ? "hover:bg-coral-50 hover:text-coral-dark" : "hover:bg-brand-50 hover:text-brand"
      }`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      <span className="sr-only">{title}</span>
    </button>
  );
}
