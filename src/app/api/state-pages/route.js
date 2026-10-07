import { NextResponse } from "next/server";

import { pagesForCity } from "@/lib/locationPages";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Public: every treatment page for one clinic area, with its keywords. */
export async function GET(request) {
  const city = new URL(request.url).searchParams.get("city")?.trim();

  if (!city) {
    return NextResponse.json(
      { success: false, error: "The city parameter is required, e.g. ?city=sector-69." },
      { status: 400 }
    );
  }

  try {
    const result = await pagesForCity(city);
    if (!result) {
      return NextResponse.json(
        { success: false, error: `Unknown city "${city}". See /api/cities.` },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Failed to load state pages:", error);
    return NextResponse.json(
      { success: false, error: "Could not load pages." },
      { status: 500 }
    );
  }
}
