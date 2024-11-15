export const dynamic = "force-dynamic";

import { Database } from "@/lib/types/schema";
import { get_openai_client } from "@/lib/utils";

type Section = Database["public"]["Tables"]["sections"]["Row"];

const generate_prompt = (query: string, sections: Section[]) => {
    return `
You are a helpful legal assistant.

The user asked: "${query}"

Here are the relevant sections:
${JSON.stringify(sections)}

Answer the user's question only based on the provided sections. Your response should be concise and precise. Your output should be in Markdown. Use correct bolding, italics, and headers where needed. Cite with article and section number as needed in the format of [(article_number.section_number)](url).
    `;
};

export async function generate(query: string, sections: Section[]) {
    const openai = get_openai_client();
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: generate_prompt(query, sections) }],
        max_tokens: 500,
        stream: true,
    });

    return response;
}
