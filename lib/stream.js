import "server-only";

import { StreamClient } from "@stream-io/node-sdk";

// The SDK's default request timeout is 3000ms, which is too short for the
// call getOrCreate/upsert round-trips from regions far from Stream's edge
// (it intermittently aborts with "The request was aborted due to the 3000ms
// timeout"). 15s is far below Next's own limits but comfortable for Stream.
const STREAM_TIMEOUT_MS = 15_000;

// Shared call settings so a call created at booking time and a call
// re-provisioned from the call page (see ensureCall) behave identically.
export const CALL_SETTINGS_OVERRIDE = {
  recording: { mode: "available", quality: "1080p" },
  screensharing: { enabled: true },
  // starts when the first participant joins, stops when all leave
  transcription: { mode: "auto-on" },
};

// Single place that reads the Stream credentials. The env var names must match
// .env exactly: NEXT_PUBLIC_STREAM_API_KEY + STREAM_API_SECRET.
export function getStreamClient() {
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
  const apiSecret = process.env.STREAM_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error(
      "Stream is not configured. Add NEXT_PUBLIC_STREAM_API_KEY and STREAM_API_SECRET to .env"
    );
  }

  return new StreamClient(apiKey, apiSecret, {
    timeout: STREAM_TIMEOUT_MS,
  });
}
