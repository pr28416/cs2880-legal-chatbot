export const dynamic = "force-dynamic";

import createSupabaseClient from "@/supabase/utils";
import { Database } from "@/lib/types/schema";
import { get_openai_client } from "@/lib/utils";
import { PostgrestError } from "@supabase/supabase-js";
import { EmbeddingRPCResponse, SearchResponse } from "./types";

type Section = Database["public"]["Tables"]["sections"]["Row"];

export async function search(
    query: string,
    match_threshold: number = 0.5,
    match_count: number = 10,
): Promise<SearchResponse> {
    const client = createSupabaseClient();
    const openai = get_openai_client();
    const embeddings_response = await openai.embeddings.create({
        input: query,
        model: "text-embedding-3-small",
    });
    const embedded_query = embeddings_response.data[0].embedding;
    const { data: search_metadata, error }: {
        data: EmbeddingRPCResponse[] | null;
        error: PostgrestError | null;
    } = await client.rpc("match_sections", {
        query_embedding: embedded_query,
        match_threshold,
        match_count,
    }).returns<EmbeddingRPCResponse[]>();

    if (error) {
        throw error;
    }

    const section_ids = search_metadata?.map((d) => d.id);
    const { data: sections, error: sections_error } = await client
        .from("sections")
        .select("*")
        .in("id", section_ids ?? [])
        .returns<Section[]>();

    if (sections_error) {
        throw sections_error;
    }

    return {
        sections,
        search_metadata: search_metadata ?? [],
    };
}
