import { NextResponse } from "next/server";

import { getLeads } from "@/lib/mongodb";
import { parseLead } from "@/lib/leads";
import { clientIp, rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Public endpoint — the website's enquiry forms POST here. */
export async function POST(request) {
  const limited = rateLimit(`leads:${clientIp(request)}`, {
    limit: 5,
    windowMs: 10 * 60 * 1000,
  });

  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a few minutes." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot: a hidden field only a bot would fill. Accept it silently so the
  // bot sees success and does not retry with a different strategy.
  if (typeof body?.company === "string" && body.company.trim()) {
    return NextResponse.json({ ok: true });
  }

  const parsed = parseLead(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const leads = await getLeads();
    await leads.insertOne({
      ...parsed.lead,
      meta: {
        ip: clientIp(request),
        userAgent: request.headers.get("user-agent")?.slice(0, 300) ?? "",
        referer: request.headers.get("referer")?.slice(0, 300) ?? "",
      },
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Failed to save lead:", error);
    return NextResponse.json(
      { error: "Could not save your request. Please call or use WhatsApp." },
      { status: 500 }
    );
  }
}
