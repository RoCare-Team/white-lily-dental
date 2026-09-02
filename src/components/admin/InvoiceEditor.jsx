"use client";

import { useState } from "react";
import { Plus, Receipt, Trash2 } from "lucide-react";

import {
  fieldClass,
  GhostButton,
  labelClass,
  Modal,
  PrimaryButton,
} from "@/components/admin/clinicalShared";
import {
  invoiceTotals,
  lineTotal,
  money,
  PAYMENT_MODES,
  rupees,
} from "@/lib/records";

/**
 * One bill: what was done, what it costs, and what has been paid against it.
 *
 * Totals are shown as they will be stored — the same function the server bills
 * with — so the number on the screen and the number in the database can never
 * be two different numbers.
 */

const BLANK_ITEM = { name: "", cost: "", discount: "" };

export default function InvoiceEditor({
  phone,
  invoice = null,
  target = {},
  treatments = [],
  patientName,
  onClose,
  onSaved,
  onDeleted,
}) {
  const [items, setItems] = useState(() =>
    invoice?.items?.length
      ? invoice.items.map((item) => ({
          name: item.name,
          cost: String(item.cost || ""),
          discount: item.discount ? String(item.discount) : "",
        }))
      : [{ ...BLANK_ITEM }]
  );
  const [payments, setPayments] = useState(() => invoice?.payments ?? []);
  const [notes, setNotes] = useState(invoice?.notes ?? "");

  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState(PAYMENT_MODES[0]);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const totals = invoiceTotals({ items, payments });

  const setCell = (index, name) => (event) => {
    const value = event.target.value;
    setItems((current) =>
      current.map((item, i) => (i === index ? { ...item, [name]: value } : item))
    );
    setError("");
  };

  const removeItem = (index) =>
    setItems((current) => {
      const next = current.filter((_, i) => i !== index);
      return next.length ? next : [{ ...BLANK_ITEM }];
    });

  const takePayment = () => {
    const value = money(amount);
    if (!value) {
      setError("Enter the amount received.");
      return;
    }
    setPayments((current) => [
      ...current,
      { amount: value, mode, at: new Date().toISOString(), note: "" },
    ]);
    setAmount("");
    setError("");
  };

  const save = async () => {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(
        invoice
          ? `/api/admin/patients/${phone}/invoices/${invoice.id}`
          : `/api/admin/patients/${phone}/invoices`,
        {
          method: invoice ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...target, items, payments, notes }),
        }
      );
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(result.error ?? "Could not save this bill.");
        return;
      }
      onSaved(result);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!confirm("Delete this bill? The payments recorded on it go with it.")) return;

    setBusy(true);
    try {
      const response = await fetch(
        `/api/admin/patients/${phone}/invoices/${invoice.id}`,
        { method: "DELETE" }
      );
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(result.error ?? "Could not delete this bill.");
        return;
      }
      onDeleted();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      title={invoice ? `Invoice ${invoice.number}` : "New bill"}
      subtitle={patientName}
      icon={Receipt}
      busy={busy}
      error={error}
      onClose={onClose}
      width="max-w-[860px]"
      footer={
        <>
          {invoice ? (
            <button
              type="button"
              onClick={remove}
              disabled={busy}
              className="mr-auto inline-flex h-9 items-center gap-2 rounded-[9px] px-3 text-[13px] font-semibold text-coral-dark transition-colors hover:bg-coral-50 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Delete
            </button>
          ) : null}
          <GhostButton onClick={onClose} disabled={busy}>
            Cancel
          </GhostButton>
          <PrimaryButton onClick={save} busy={busy}>
            {invoice ? "Save bill" : "Create bill"}
          </PrimaryButton>
        </>
      }
    >
      <datalist id="wl-billables">
        {treatments.map((name) => (
          <option key={name} value={name} />
        ))}
      </datalist>

      {/* ------------------------------------------------------------ items */}
      <div
        className="hidden gap-2 pb-1.5 sm:grid"
        style={{ gridTemplateColumns: "minmax(160px,2.4fr) 110px 110px 96px 32px" }}
      >
        <span className={`${labelClass} mb-0`}>Item</span>
        <span className={`${labelClass} mb-0 text-right`}>Cost</span>
        <span className={`${labelClass} mb-0 text-right`}>Discount</span>
        <span className={`${labelClass} mb-0 text-right`}>Total</span>
        <span />
      </div>

      <div className="flex flex-col gap-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="grid gap-2 rounded-[10px] border border-line p-2 sm:rounded-none sm:border-0 sm:p-0"
            style={{ gridTemplateColumns: "minmax(160px,2.4fr) 110px 110px 96px 32px" }}
          >
            <label className="block min-w-0">
              <span className={`${labelClass} sm:hidden`}>Item</span>
              <input
                value={item.name}
                onChange={setCell(index, "name")}
                list="wl-billables"
                placeholder="Procedure or product"
                className={fieldClass}
              />
            </label>

            <label className="block min-w-0">
              <span className={`${labelClass} sm:hidden`}>Cost</span>
              <input
                value={item.cost}
                onChange={setCell(index, "cost")}
                inputMode="decimal"
                placeholder="0"
                className={`${fieldClass} text-right tabular-nums`}
              />
            </label>

            <label className="block min-w-0">
              <span className={`${labelClass} sm:hidden`}>Discount</span>
              <input
                value={item.discount}
                onChange={setCell(index, "discount")}
                inputMode="decimal"
                placeholder="0"
                className={`${fieldClass} text-right tabular-nums`}
              />
            </label>

            <p className="flex h-10 items-center justify-end text-[13.5px] font-semibold tabular-nums text-navy">
              {rupees(lineTotal(item))}
            </p>

            <button
              type="button"
              onClick={() => removeItem(index)}
              title="Remove this line"
              className="mt-auto inline-flex h-10 w-8 items-center justify-center rounded-[8px] text-muted transition-colors hover:bg-coral-50 hover:text-coral-dark"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Remove</span>
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setItems((current) => [...current, { ...BLANK_ITEM }])}
        className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-[9px] border border-dashed border-line px-3 text-[12.5px] font-semibold text-brand transition-colors hover:border-brand hover:bg-brand-50"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Add item
      </button>

      {/* ----------------------------------------------------------- totals */}
      <dl className="mt-4 ml-auto w-full max-w-[300px] rounded-[11px] border border-line bg-[#fafbfc] px-3.5 py-3 text-[13px]">
        <Line term="Subtotal" value={rupees(totals.gross)} />
        <Line term="Discount" value={`− ${rupees(totals.discount)}`} />
        <Line term="Total" value={rupees(totals.total)} strong />
        <Line term="Paid" value={rupees(totals.paid)} />
        <Line
          term="Balance"
          value={rupees(totals.balance)}
          strong
          tone={totals.balance > 0 ? "text-coral-dark" : "text-teal"}
        />
      </dl>

      {/* --------------------------------------------------------- payments */}
      <div className="mt-5 rounded-[12px] border border-line">
        <p className="border-b border-line px-3.5 py-2.5 text-[13px] font-bold text-navy">
          Payment
        </p>

        {payments.length ? (
          <ul className="divide-y divide-line/70">
            {payments.map((payment, index) => (
              <li
                key={index}
                className="flex items-center justify-between gap-3 px-3.5 py-2 text-[13px]"
              >
                <span className="text-muted">
                  {payment.mode}
                  {payment.at ? (
                    <span className="ml-2 text-[12px]">
                      {new Date(payment.at).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  ) : null}
                </span>
                <span className="flex items-center gap-2">
                  <span className="font-semibold tabular-nums text-navy">
                    {rupees(payment.amount)}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setPayments((current) => current.filter((_, i) => i !== index))
                    }
                    title="Remove this payment"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-[7px] text-muted transition-colors hover:bg-coral-50 hover:text-coral-dark"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    <span className="sr-only">Remove payment</span>
                  </button>
                </span>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="flex flex-wrap items-end gap-2 px-3.5 py-3">
          <label className="min-w-0 flex-1">
            <span className={labelClass}>Amount received</span>
            <input
              value={amount}
              onChange={(event) => {
                setAmount(event.target.value);
                setError("");
              }}
              inputMode="decimal"
              placeholder="0"
              className={`${fieldClass} tabular-nums`}
            />
          </label>

          <label className="min-w-0 flex-1">
            <span className={labelClass}>Mode</span>
            <select
              value={mode}
              onChange={(event) => setMode(event.target.value)}
              className={fieldClass}
            >
              {PAYMENT_MODES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={takePayment}
            className="inline-flex h-10 items-center rounded-[9px] bg-teal px-4 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            Accept payment
          </button>
        </div>

        <p className="border-t border-line px-3.5 py-2 text-[12px] text-muted">
          Payments are added to the bill here and saved with it.
        </p>
      </div>

      <label className="mt-4 block">
        <span className={labelClass}>Note on the bill</span>
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={2}
          placeholder="Anything that should appear against this bill."
          className="w-full resize-y rounded-[9px] border border-line bg-white px-3 py-2 text-[13.5px] leading-relaxed text-navy outline-none transition-colors placeholder:text-muted/60 focus:border-brand focus:ring-2 focus:ring-brand/15"
        />
      </label>
    </Modal>
  );
}

function Line({ term, value, strong, tone = "text-navy" }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <dt className={strong ? "font-semibold text-navy" : "text-muted"}>{term}</dt>
      <dd className={`tabular-nums ${strong ? `font-bold ${tone}` : "text-navy"}`}>
        {value}
      </dd>
    </div>
  );
}
