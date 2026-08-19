import "server-only";
import { execFile } from "child_process";
import { promisify } from "util";
import ffmpegPath from "ffmpeg-static";

const execFileAsync = promisify(execFile);

/**
 * Extracts audio from `inputVideoPath` into `outputAudioPath` as mono,
 * 16kHz, low-bitrate AAC — small enough to stay well under transcription
 * API upload limits, and the exact format Whisper-style models want anyway.
 */
export async function extractAudio(inputVideoPath: string, outputAudioPath: string): Promise<void> {
  if (!ffmpegPath) {
    throw new Error("ffmpeg-static did not resolve to a binary path");
  }

  await execFileAsync(ffmpegPath as string, [
    "-y",
    "-i", inputVideoPath,
    "-vn", // drop video stream entirely
    "-ac", "1", // mono
    "-ar", "16000", // 16kHz, what Whisper-family models expect
    "-b:a", "64k",
    outputAudioPath,
  ]);
}
