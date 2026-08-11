import { cookies } from "next/headers";

import { SESSION_COOKIE, verifySession } from "@/lib/auth";

/** Reads the signed session from the request cookies. Server-side only. */
export async function getAdminSession() {
  const store = await cookies();
  return verifySession(store.get(SESSION_COOKIE)?.value);
}

/**
 * Guard for admin route handlers. Returns null when authorised, or a 401
 * Response to return straight from the handler.
 */
export async function requireAdmin() {
  const session = await getAdminSession();
  if (session) return null;
  return Response.json({ error: "Not signed in." }, { status: 401 });
}
