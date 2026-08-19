import { readFile } from "fs/promises";
import type { CaptionSegment, TranscriptionProvider } from "./types";

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/audio/transcriptions";
const MODEL = "whisper-large-v3-turbo";

// Groups Whisper's raw per-word timestamps into short, screen-sized caption
// chunks instead of returning one segment per single word.
const MAX_WORDS_PER_CHUNK = 6;
const MAX_CHUNK_SECONDS = 3.5;

interface GroqWord {
  word: string;
  start: number;
  end: number;
}

function chunkWords(words: GroqWord[]): CaptionSegment[] {
  const segments: CaptionSegment[] = [];
  let current: GroqWord[] = [];

  for (const word of words) {
    current.push(word);
    const duration = current[current.length - 1].end - current[0].start;
    if (current.length >= MAX_WORDS_PER_CHUNK || duration >= MAX_CHUNK_SECONDS) {
      segments.push(toSegment(current));
      current = [];
    }
  }
  if (current.length > 0) {
    segments.push(toSegment(current));
  }
  return segments;
}

function toSegment(words: GroqWord[]): CaptionSegment {
  return {
    start: words[0].start,
    end: words[words.length - 1].end,
    text: words.map((w) => w.word.trim()).join(" ").trim(),
  };
}

export const groqProvider: TranscriptionProvider = {
  name: "groq",
  async transcribe(audioFilePath: string): Promise<CaptionSegment[]> {
    const apiKey = process.env.AI_TRANSCRIPTION_API_KEY;
    if (!apiKey) {
      throw new Error("AI_TRANSCRIPTION_API_KEY is not set");
    }

    const fileBuffer = await readFile(audioFilePath);
    const form = new FormData();
    form.append("file", new Blob([new Uint8Array(fileBuffer)]), "audio.m4a");
    form.append("model", MODEL);
    form.append("response_format", "verbose_json");
    form.append("timestamp_granularities[]", "word");

    const response = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq transcription failed (${response.status}): ${errorText}`);
    }

    const data = (await response.json()) as { words?: GroqWord[]; text?: string };

    if (!data.words || data.words.length === 0) {
      // No speech detected, or the provider didn't return word timestamps.
      return data.text ? [{ start: 0, end: 0, text: data.text }] : [];
    }

    return chunkWords(data.words);
  },
};
