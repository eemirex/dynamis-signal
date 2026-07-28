import OpenAI from "openai";

export const AI_MODEL = "gpt-5.4-mini";

export function createAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("The AI provider is not configured.");
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL || undefined,
  });
}

export function sanitizeText(value: unknown, maxLength = 8_000) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}
