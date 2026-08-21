import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/adminSession";
import { listPatients } from "@/lib/patients";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * The patients rail. It lives in a layout, which cannot read search params, so
 * the list is fetched from here instead — that also means switching tabs or
 * typing a name never re-renders the record open beside it.
 */
export async function GET(request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { searchParams } = new URL(request.url);

  try {
    const patients = await listPatients({
      q: searchParams.get("q") ?? "",
      tab: searchParams.get("tab") ?? "recent",
    });
    return NextResponse.json({ patients });
  } catch (error) {
    console.error("Failed to list patients:", error);
    return NextResponse.json({ error: "Could not load patients." }, { status: 500 });
  }
}
