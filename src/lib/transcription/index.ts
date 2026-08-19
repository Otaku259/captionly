import "server-only";
import { groqProvider } from "./groq";
import { mockProvider } from "./mock";
import type { TranscriptionProvider } from "./types";

export function getTranscriptionProvider(): TranscriptionProvider {
  return process.env.AI_TRANSCRIPTION_API_KEY ? groqProvider : mockProvider;
}

export type { CaptionSegment, TranscriptionProvider } from "./types";
