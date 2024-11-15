import { Database } from "./schema";

type Section = Database["public"]["Tables"]["sections"]["Row"];

export type Message = {
  role: "user" | "assistant";
  content: string;
  sources: Section[];
};
