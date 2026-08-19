import { NextRequest, NextResponse } from "next/server";
import { mkdtemp, rm, writeFile } from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { extractAudio } from "@/lib/video/extract-audio";
import { getTranscriptionProvider } from "@/lib/transcription";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: jobId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const storagePath = body?.storagePath as string | undefined;
  if (!storagePath) {
    return NextResponse.json({ error: "Missing storagePath." }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: job, error: jobFetchError } = await admin
    .from("video_jobs")
    .select("id, user_id")
    .eq("id", jobId)
    .single();

  // Ownership check — a user can only ever transcribe their own job.
  if (jobFetchError || !job || job.user_id !== user.id) {
    return NextResponse.json({ error: "Job not found." }, { status: 404 });
  }

  await admin
    .from("video_jobs")
    .update({ status: "transcribing", storage_path: storagePath })
    .eq("id", jobId);

  let tempDir: string | null = null;

  try {
    const { data: fileData, error: downloadError } = await admin.storage
      .from("videos")
      .download(storagePath);

    if (downloadError || !fileData) {
      throw new Error(downloadError?.message ?? "Could not download the uploaded file.");
    }

    tempDir = await mkdtemp(path.join(tmpdir(), "captionlift-"));
    const videoPath = path.join(tempDir, "input");
    const audioPath = path.join(tempDir, "audio.m4a");

    await writeFile(videoPath, Buffer.from(await fileData.arrayBuffer()));
    await extractAudio(videoPath, audioPath);

    const provider = getTranscriptionProvider();
    const captions = await provider.transcribe(audioPath);

    await admin
      .from("video_jobs")
      .update({
        status: "complete",
        completed_at: new Date().toISOString(),
        captions,
      })
      .eq("id", jobId);

    // Only spend the user's free video on a real, successful transcription —
    // never on a mock-mode test run, and never on a failed attempt.
    const { data: profile } = await admin
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single();

    if (profile?.plan === "free" && provider.name !== "mock") {
      await admin.rpc("increment_free_jobs_used", { p_user_id: user.id });
    }

    return NextResponse.json({ jobId, captions, provider: provider.name });
  } catch (err) {
    await admin
      .from("video_jobs")
      .update({
        status: "failed",
        error_message: err instanceof Error ? err.message : "Transcription failed.",
      })
      .eq("id", jobId);

    return NextResponse.json({ error: "Transcription failed. Please try again." }, { status: 500 });
  } finally {
    if (tempDir) {
      await rm(tempDir, { recursive: true, force: true }).catch(() => {});
    }
  }
}
