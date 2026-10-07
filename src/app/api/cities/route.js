import { NextResponse } from "next/server";

import { listCities } from "@/lib/locationPages";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Public: every clinic area, with a link to its page index. */
export async function GET() {
  try {
    const cities = await listCities();
    return NextResponse.json({ success: true, city_count: cities.length, cities });
  } catch (error) {
    console.error("Failed to list cities:", error);
    return NextResponse.json(
      { success: false, error: "Could not load cities." },
      { status: 500 }
    );
  }
}
