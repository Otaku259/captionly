export interface CaptionSegment {
  start: number; // seconds
  end: number; // seconds
  text: string;
}

export interface TranscriptionProvider {
  name: string;
  /** Transcribes an audio file (already extracted from the video) into timestamped segments. */
  transcribe(audioFilePath: string): Promise<CaptionSegment[]>;
}
