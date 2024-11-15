export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";

import { NextResponse } from "next/server";
import { search } from "./utils";

export async function POST(request: NextRequest) {
  const { query, match_threshold, match_count } = await request.json();
  const response = await search(query, match_threshold, match_count);
  return NextResponse.json(response);
}
