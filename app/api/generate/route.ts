export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { generate } from "./utils";

export async function POST(request: NextRequest) {
    const { query, sections } = await request.json();
    const response = await generate(query, sections);

    async function* makeIterator() {
        for await (const chunk of response) {
            yield chunk.choices[0].delta.content ?? "";
        }
    }

    return new NextResponse(iteratorToStream(makeIterator()));
}

function iteratorToStream(iterator: AsyncGenerator<unknown>) {
    return new ReadableStream({
        async pull(controller) {
            const { value, done } = await iterator.next();

            if (done) {
                controller.close();
            } else {
                controller.enqueue(value);
            }
        },
    });
}
