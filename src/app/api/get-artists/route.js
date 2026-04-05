import * as db from "../../../../src/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const artists = await db.getArtists();
    return NextResponse.json({ artists });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 },
    );
  }
}
