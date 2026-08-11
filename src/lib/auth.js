/**
 * Admin session helpers.
 *
 * Uses the Web Crypto API (not node:crypto) so the same module works in both
 * the Node runtime (route handlers) and the Edge runtime (middleware).
 *
 * A session is `base64url(JSON payload).base64url(HMAC-SHA256)` — a signed
 * cookie, not encrypted. It carries no secrets, only the admin email and an
 * expiry, and the signature stops it being forged.
 */

export const SESSION_COOKIE = "wl_admin";
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

const encoder = new TextEncoder();

function requireSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "ADMIN_SESSION_SECRET is missing or too short (need 32+ characters)."
    );
  }
  return secret;
}

function toBase64Url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded.padEnd(Math.ceil(padded.length / 4) * 4, "="));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function hmacKey() {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(requireSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

async function sign(data) {
  const key = await hmacKey();
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return toBase64Url(new Uint8Array(signature));
}

/** Constant-time string compare — avoids leaking a match via timing. */
function safeEqual(a, b) {
  const aBytes = encoder.encode(a);
  const bBytes = encoder.encode(b);
  // Compare a fixed length so differing lengths still cost the same.
  const length = Math.max(aBytes.length, bBytes.length);
  let diff = aBytes.length ^ bBytes.length;
  for (let i = 0; i < length; i += 1) {
    diff |= (aBytes[i] ?? 0) ^ (bBytes[i] ?? 0);
  }
  return diff === 0;
}

/** Builds a signed session token for `email`. */
export async function createSession(email) {
  const payload = {
    email,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
  };
  const body = toBase64Url(encoder.encode(JSON.stringify(payload)));
  return `${body}.${await sign(body)}`;
}

/** Returns the payload if `token` is validly signed and unexpired, else null. */
export async function verifySession(token) {
  if (typeof token !== "string" || !token.includes(".")) return null;

  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  let expected;
  try {
    expected = await sign(body);
  } catch {
    return null;
  }
  if (!safeEqual(signature, expected)) return null;

  try {
    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(body)));
    if (!payload?.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

/** True when the submitted credentials match the configured admin. */
export function checkCredentials(email, password) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      "ADMIN_EMAIL / ADMIN_PASSWORD are not set. Add them to .env.local."
    );
  }

  // Always run both comparisons so a wrong email costs the same as a wrong password.
  const emailOk = safeEqual(
    String(email ?? "").trim().toLowerCase(),
    adminEmail.trim().toLowerCase()
  );
  const passwordOk = safeEqual(String(password ?? ""), adminPassword);
  return emailOk && passwordOk;
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_MAX_AGE,
};
