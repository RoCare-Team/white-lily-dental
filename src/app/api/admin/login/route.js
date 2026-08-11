import { NextResponse } from "next/server";

import {
  SESSION_COOKIE,
  checkCredentials,
  createSession,
  sessionCookieOptions,
} from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  const limited = rateLimit(`login:${clientIp(request)}`, {
    limit: 8,
    windowMs: 15 * 60 * 1000,
  });

  if (!limited.ok) {
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${limited.retryAfter}s.` },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  let valid;
  try {
    valid = checkCredentials(body?.email, body?.password);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Admin login is not configured on the server." },
      { status: 500 }
    );
  }

  if (!valid) {
    return NextResponse.json(
      { error: "Incorrect email or password." },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(
    SESSION_COOKIE,
    await createSession(process.env.ADMIN_EMAIL.trim().toLowerCase()),
    sessionCookieOptions
  );
  return response;
}
