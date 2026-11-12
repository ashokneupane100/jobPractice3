import "server-only";

import { GoogleGenerativeAI } from "@google/generative-ai";

// Google retired the `gemini-2.5-*` / `gemini-2.0-*` models for new API keys
// ("This model is no longer available to new users"), so the old hardcoded
// names fail with a 404. These current models work on the same key, and
// GEMINI_MODEL can override the first choice without a code change.
export const DEFAULT_GEMINI_MODEL =
  process.env.GEMINI_MODEL || "gemini-3.5-flash";

// Tried in order. Free-tier models occasionally answer 429/503 (quota or
// "high demand"), so a second model keeps the feature working.
const FALLBACK_MODELS = [
  DEFAULT_GEMINI_MODEL,
  "gemini-3.1-flash-lite",
  "gemini-flash-lite-latest",
];

let client;

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set. Add it to .env");
  }
  client ??= new GoogleGenerativeAI(apiKey);
  return client;
}

// Errors worth retrying on another model: retired model, quota, overload.
function isModelAvailabilityError(error) {
  const message = String(error?.message ?? "");
  return /\[(404|429|500|502|503)\]|not found|no longer available|high demand|quota|overloaded|timed? ?out|ECONN|ETIMEDOUT/i.test(
    message,
  );
}

export async function generateGeminiText(prompt) {
  const models = [...new Set(FALLBACK_MODELS.filter(Boolean))];
  let lastError;

  for (const modelName of models) {
    try {
      const model = getClient().getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      lastError = error;
      if (!isModelAvailabilityError(error)) throw error;
      console.warn(
        `[gemini] model "${modelName}" unavailable, trying next: ${String(
          error?.message ?? error,
        ).slice(0, 140)}`,
      );
    }
  }

  throw new Error(
    `Gemini is temporarily unavailable. Please try again in a moment.`,
  );
}

// Gemini sometimes wraps JSON in ```json fences or adds a sentence before or
// after the payload, which breaks a bare JSON.parse.
export function parseGeminiJson(text) {
  const cleaned = String(text ?? "")
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.search(/[[{]/);
    const end = Math.max(cleaned.lastIndexOf("]"), cleaned.lastIndexOf("}"));

    if (start !== -1 && end > start) {
      try {
        return JSON.parse(cleaned.slice(start, end + 1));
      } catch {
        // fall through to the friendly error below
      }
    }

    throw new Error("The AI returned an unexpected response. Please try again.");
  }
}
