import { type ClassValue, clsx } from "clsx";
import OpenAI from "openai";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function get_openai_client() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export function toTitleCase(str: string) {
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}
