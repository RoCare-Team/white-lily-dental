import { formatTime } from "@/lib/slots";

/**
 * Booking confirmations over WhatsApp (whatsapp.limbu.ai campaigns).
 *
 * Two templates go out for every booked slot: one to the clinic owner so the
 * desk knows a patient is coming, one to the patient confirming the time.
 * A failed message is logged and swallowed — the slot is already saved, and a
 * patient must never be told "booking failed" because WhatsApp was slow.
 */

const API_BASE = "https://whatsapp.limbu.ai/api/campaigns";
const OWNER_CAMPAIGN = "new_appointment_owner_confirm";
const PATIENT_CAMPAIGN = "appointment_confirmation";
const DEFAULT_OWNER_NUMBER = "917742170517";
const TIMEOUT_MS = 8000;

/** "98765 43210" → "919876543210". Numbers already carrying a code are kept. */
function toWhatsAppNumber(phone) {
  const digits = String(phone ?? "").replace(/\D/g, "").replace(/^0+/, "");
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

/** Empty template params are rejected by WhatsApp, so blanks become a dash. */
function param(value) {
  const text = String(value ?? "").trim();
  return text || "-";
}

function formatDate(dateKey) {
  const [y, m, d] = String(dateKey).split("-").map(Number);
  if (!y || !m || !d) return dateKey;
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

async function sendCampaign(campaign, messages) {
  const apiKey = process.env.WHATSAPP_API_KEY;
  if (!apiKey) {
    console.warn(`WhatsApp: WHATSAPP_API_KEY is not set, skipped "${campaign}".`);
    return;
  }

  const response = await fetch(`${API_BASE}/${campaign}/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey, messages }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`WhatsApp "${campaign}" failed (${response.status}): ${text.slice(0, 300)}`);
  }
}

/**
 * Send the owner and patient confirmations for one booking.
 * Never throws.
 */
export async function sendBookingConfirmations({
  name,
  phone,
  clinic,
  doctor,
  slotDate,
  slotTime,
}) {
  const [firstName] = String(name ?? "").trim().split(/\s+/);
  const patientNumber = toWhatsAppNumber(phone);
  const ownerNumber = toWhatsAppNumber(
    process.env.WHATSAPP_OWNER_NUMBER || DEFAULT_OWNER_NUMBER
  );

  const date = slotDate ? formatDate(slotDate) : "";
  const time = slotTime ? formatTime(slotTime) : "";
  const doctorName = doctor || "Any available doctor";

  const results = await Promise.allSettled([
    // Owner: {{1}} patient name, {{2}} phone, {{3}} date, {{4}} time,
    // {{5}} clinic, {{6}} doctor.
    sendCampaign(OWNER_CAMPAIGN, [
      {
        destination: ownerNumber,
        templateParams: [name, phone, date, time, clinic, doctorName].map(param),
      },
    ]),
    // Patient: "Hi {{1}}" + Date {{2}}, Time {{3}}, Clinic {{4}}, Doctor {{5}}.
    patientNumber
      ? sendCampaign(PATIENT_CAMPAIGN, [
          {
            destination: patientNumber,
            templateParams: [firstName, date, time, clinic, doctorName].map(param),
          },
        ])
      : Promise.resolve(),
  ]);

  for (const result of results) {
    if (result.status === "rejected") {
      console.error("WhatsApp confirmation not sent:", result.reason);
    }
  }
}
