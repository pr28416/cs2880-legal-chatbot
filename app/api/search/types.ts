import { Database } from "@/lib/types/schema";

type Section = Database["public"]["Tables"]["sections"]["Row"];

export type EmbeddingRPCResponse = {
    id: string;
    similarity_score: number;
};

export type SearchResponse = {
    sections: Section[];
    search_metadata: EmbeddingRPCResponse[];
};
