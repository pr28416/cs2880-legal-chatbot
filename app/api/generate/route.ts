import { NextRequest } from "next/server";
import { generate } from "./utils";

export async function POST(request: NextRequest) {
    const { query, sections } = await request.json();
    const stream = await generate(query, sections);
    return stream;
}
