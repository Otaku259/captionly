import type { CaptionSegment, TranscriptionProvider } from "./types";

// Deliberately fake, deliberately obvious — this must never be mistaken
// for a real transcription result in production.
export const mockProvider: TranscriptionProvider = {
  name: "mock",
  async transcribe(): Promise<CaptionSegment[]> {
    return [
      { start: 0, end: 1.5, text: "[DEV MODE — no transcription API key set]" },
      { start: 1.5, end: 3.5, text: "this is placeholder caption text" },
      { start: 3.5, end: 5.5, text: "set AI_TRANSCRIPTION_API_KEY for real captions" },
    ];
  },
};
