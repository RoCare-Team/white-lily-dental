"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, Plus, Trash2 } from "lucide-react";

import {
  areaClass,
  fieldClass,
  GhostButton,
  KIND_ICONS,
  Labelled,
  labelClass,
  Modal,
  PrimaryButton,
} from "@/components/admin/clinicalShared";
import { lineTotal, RECORD_LABELS, rowsTotal, rupees } from "@/lib/records";

/**
 * The one editor for every kind of clinical record.
 *
 * Each kind is described by a little bit of data below — its plain fields and,
 * where it is a list of things, the columns of that list — rather than by a
 * form component of its own. Adding "Lab order" to the menu was three lines
 * here, and that is the point.
 */

/** Plain single-value fields, in the order they are asked for. */
const FIELDS = {
  vitals: [
    { name: "bp", label: "Blood pressure", placeholder: "120/80" },
    { name: "pulse", label: "Pulse", placeholder: "72 / min" },
    { name: "temperature", label: "Temperature", placeholder: "98.4 °F" },
    { name: "weight", label: "Weight", placeholder: "68 kg" },
    { name: "height", label: "Height", placeholder: "172 cm" },
    { name: "notes", label: "Notes", area: true, full: true },
  ],
  note: [
    { name: "complaint", label: "Chief complaint", full: true, area: true, rows: 2 },
    { name: "observation", label: "Observations", full: true, area: true, rows: 2 },
    { name: "diagnosis", label: "Diagnosis", full: true, area: true, rows: 2 },
    { name: "notes", label: "Treatment notes", full: true, area: true, rows: 3 },
  ],
  "lab-order": [
    { name: "lab", label: "Laboratory", placeholder: "Name of the lab" },
    { name: "work", label: "Work sent", placeholder: "Crown, bridge, denture…" },
    { name: "sentOn", label: "Sent on", type: "date" },
    { name: "expectedOn", label: "Expected back", type: "date" },
    { name: "notes", label: "Notes", area: true, full: true, rows: 2 },
  ],
  file: [
    { name: "label", label: "Title", placeholder: "OPG, intra-oral photo…", full: true },
    { name: "notes", label: "Notes", area: true, full: true, rows: 2 },
  ],
};

/** Kinds that are a list of lines, and what those lines hold. */
const COLUMNS = {
  prescription: {
    grid: "minmax(130px,1.6fr) minmax(80px,0.8fr) minmax(90px,1fr) minmax(80px,0.8fr) minmax(120px,1.4fr) 32px",
    cells: [
      { name: "medicine", label: "Medicine", placeholder: "Amoxicillin 500mg" },
      { name: "dosage", label: "Dosage", placeholder: "1 tab" },
      { name: "frequency", label: "Frequency", placeholder: "1-0-1" },
      { name: "duration", label: "Duration", placeholder: "5 days" },
      { name: "instructions", label: "Instructions", placeholder: "After food" },
    ],
  },
  "treatment-plan": {
    grid: "minmax(150px,2fr) 74px minmax(90px,1fr) minmax(90px,1fr) 78px 32px",
    cells: [
      { name: "procedure", label: "Procedure", list: "wl-procedures" },
      { name: "tooth", label: "Tooth", placeholder: "36" },
      { name: "cost", label: "Cost", money: true },
      { name: "discount", label: "Discount", money: true },
    ],
    total: true,
  },
  procedures: {
    grid: "minmax(150px,2fr) 74px minmax(140px,1.6fr) minmax(90px,1fr) 32px",
    cells: [
      { name: "procedure", label: "Procedure", list: "wl-procedures" },
      { name: "tooth", label: "Tooth", placeholder: "36" },
      { name: "notes", label: "Notes" },
      { name: "cost", label: "Cost", money: true },
    ],
  },
};

function blankRow(kind) {
  return Object.fromEntries(COLUMNS[kind].cells.map((cell) => [cell.name, ""]));
}

function blankData(kind) {
  if (COLUMNS[kind]) return { items: [blankRow(kind)] };
  return Object.fromEntries((FIELDS[kind] ?? []).map((field) => [field.name, ""]));
}

export default function RecordEditor({
  phone,
  kind,
  record = null,
  target = {},
  treatments = [],
  onClose,
  onSaved,
}) {
  const [data, setData] = useState(() => {
    if (!record) return blankData(kind);
    // An existing list record with every row deleted still needs one to type in.
    if (COLUMNS[kind]) {
      return { items: record.data.items?.length ? record.data.items : [blankRow(kind)] };
    }
    return { ...blankData(kind), ...record.data };
  });

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState(record?.data?.url ?? "");
  const filePicker = useRef(null);

  const columns = COLUMNS[kind];
  const Icon = KIND_ICONS[kind];

  const setField = (name) => (event) => {
    setData((current) => ({ ...current, [name]: event.target.value }));
    setError("");
  };

  const setCell = (index, name) => (event) => {
    const value = event.target.value;
    setData((current) => ({
      ...current,
      items: current.items.map((row, i) => (i === index ? { ...row, [name]: value } : row)),
    }));
    setError("");
  };

  const addRow = () =>
    setData((current) => ({ ...current, items: [...current.items, blankRow(kind)] }));

  const removeRow = (index) =>
    setData((current) => {
      const items = current.items.filter((_, i) => i !== index);
      return { ...current, items: items.length ? items : [blankRow(kind)] };
    });

  const upload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const response = await fetch("/api/admin/upload", { method: "POST", body: form });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(result.error ?? "Could not upload that file.");
        return;
      }
      setFileUrl(result.url);
      setData((current) => ({ ...current, label: current.label || result.name || "" }));
    } catch {
      setError("Network error while uploading.");
    } finally {
      setUploading(false);
      if (filePicker.current) filePicker.current.value = "";
    }
  };

  const save = async () => {
    setBusy(true);
    setError("");

    const payload = kind === "file" ? { ...data, url: fileUrl } : data;

    try {
      const response = await fetch(
        record
          ? `/api/admin/patients/${phone}/records/${record.id}`
          : `/api/admin/patients/${phone}/records`,
        {
          method: record ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(record ? { data: payload } : { ...target, kind, data: payload }),
        }
      );
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(result.error ?? "Could not save this record.");
        return;
      }
      onSaved(result);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      title={RECORD_LABELS[kind]}
      subtitle={record ? "Editing a saved record" : "New record on this visit"}
      icon={Icon}
      busy={busy}
      error={error}
      onClose={onClose}
      width={columns ? "max-w-[840px]" : "max-w-[640px]"}
      footer={
        <>
          <GhostButton onClick={onClose} disabled={busy}>
            Cancel
          </GhostButton>
          <PrimaryButton onClick={save} busy={busy}>
            Save
          </PrimaryButton>
        </>
      }
    >
      {/* Procedure names the clinic already offers, for the lists that want one. */}
      <datalist id="wl-procedures">
        {treatments.map((name) => (
          <option key={name} value={name} />
        ))}
      </datalist>

      {columns ? (
        <>
          <div
            className="hidden gap-2 pb-1.5 sm:grid"
            style={{ gridTemplateColumns: columns.grid }}
          >
            {columns.cells.map((cell) => (
              <span key={cell.name} className={`${labelClass} mb-0`}>
                {cell.label}
              </span>
            ))}
            <span />
          </div>

          <div className="flex flex-col gap-2">
            {data.items.map((row, index) => (
              <div
                key={index}
                className="grid gap-2 rounded-[10px] border border-line p-2 sm:rounded-none sm:border-0 sm:p-0"
                style={{ gridTemplateColumns: columns.grid }}
              >
                {columns.cells.map((cell) => (
                  <label key={cell.name} className="block min-w-0">
                    <span className={`${labelClass} sm:hidden`}>{cell.label}</span>
                    <input
                      value={row[cell.name] ?? ""}
                      onChange={setCell(index, cell.name)}
                      list={cell.list}
                      inputMode={cell.money ? "decimal" : undefined}
                      placeholder={cell.money ? "0" : cell.placeholder}
                      className={`${fieldClass} ${cell.money ? "text-right tabular-nums" : ""}`}
                    />
                  </label>
                ))}

                <button
                  type="button"
                  onClick={() => removeRow(index)}
                  title="Remove this line"
                  className="mt-auto inline-flex h-10 w-8 items-center justify-center rounded-[8px] text-muted transition-colors hover:bg-coral-50 hover:text-coral-dark"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Remove</span>
                </button>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={addRow}
              className="inline-flex h-9 items-center gap-1.5 rounded-[9px] border border-dashed border-line px-3 text-[12.5px] font-semibold text-brand transition-colors hover:border-brand hover:bg-brand-50"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add line
            </button>

            {columns.total ? (
              <p className="text-[13.5px] font-bold text-navy">
                Total {rupees(rowsTotal(data.items))}
                <span className="ml-2 text-[12px] font-medium text-muted">
                  {data.items.filter((row) => lineTotal(row) > 0).length} priced
                </span>
              </p>
            ) : null}
          </div>
        </>
      ) : (
        <div className="grid gap-3.5 sm:grid-cols-2">
          {(FIELDS[kind] ?? []).map((field) => (
            <Labelled
              key={field.name}
              label={field.label}
              className={field.full ? "sm:col-span-2" : ""}
            >
              {field.area ? (
                <textarea
                  value={data[field.name] ?? ""}
                  onChange={setField(field.name)}
                  rows={field.rows ?? 2}
                  className={areaClass}
                />
              ) : (
                <input
                  value={data[field.name] ?? ""}
                  onChange={setField(field.name)}
                  type={field.type ?? "text"}
                  placeholder={field.placeholder}
                  className={fieldClass}
                />
              )}
            </Labelled>
          ))}

          {kind === "file" ? (
            <div className="sm:col-span-2">
              <p className={labelClass}>File</p>
              <div className="flex flex-wrap items-center gap-3">
                {fileUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={fileUrl}
                    alt=""
                    className="h-24 w-auto max-w-[200px] rounded-[9px] border border-line object-cover"
                  />
                ) : null}

                <button
                  type="button"
                  onClick={() => filePicker.current?.click()}
                  disabled={uploading}
                  className="inline-flex h-10 items-center gap-2 rounded-[9px] border border-dashed border-line px-4 text-[13px] font-semibold text-brand transition-colors hover:border-brand hover:bg-brand-50 disabled:opacity-60"
                >
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <ImagePlus className="h-4 w-4" aria-hidden="true" />
                  )}
                  {fileUrl ? "Replace file" : "Choose a file"}
                </button>

                <input
                  ref={filePicker}
                  type="file"
                  accept="image/*"
                  onChange={upload}
                  className="hidden"
                />
              </div>
              <p className="mt-1.5 text-[12px] text-muted">
                X-rays and photos, up to 5 MB. JPG, PNG, WebP, AVIF, GIF or SVG.
              </p>
            </div>
          ) : null}
        </div>
      )}
    </Modal>
  );
}
