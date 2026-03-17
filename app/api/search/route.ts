import { NextRequest, NextResponse } from "next/server";
import { searchTokens } from "@/lib/api/coingecko";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const query = request.nextUrl.searchParams.get("q");

  if (!query || query.trim().length < 2) {
    return NextResponse.json([]);
  }

  try {
    const results = await searchTokens(query.trim());
    return NextResponse.json(results.slice(0, 8));
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
