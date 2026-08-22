"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { colors as c } from "@/lib/theme";
import {
  MAX_UPLOAD_SIZE_MB,
  MAX_VIDEO_DURATION_SECONDS,
  SUPPORTED_VIDEO_MIME_TYPES,
} from "@/lib/config";
import type { CaptionSegment } from "@/lib/transcription/types";

type Stage = "idle" | "checking" | "uploading" | "transcribing" | "done" | "error";

export default function UploadPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stage, setStage] = useState<Stage>("idle");
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [segments, setSegments] = useState<CaptionSegment[]>([]);
  const [activeCaption, setActiveCaption] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [providerUsed, setProviderUsed] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth
      .getUser()
      .then(({ data: { user } }) => {
        if (!user) {
          router.push("/login?next=/upload");
          return;
        }
        setCheckingAuth(false);
      })
      .catch(() => {
        // Never leave the page stuck on a blank screen if this call fails.
        router.push("/login?next=/upload");
      });
  }, [router]);

  async function handleFile(file: File) {
    setError(null);

    if (!SUPPORTED_VIDEO_MIME_TYPES.includes(file.type)) {
      setError("Please choose an MP4, MOV or WebM video.");
      return;
    }
    if (file.size > MAX_UPLOAD_SIZE_MB * 1024 * 1024) {
      setError(`That file is too large — the limit is ${MAX_UPLOAD_SIZE_MB}MB for now.`);
      return;
    }

    setStage("checking");
    const objectUrl = URL.createObjectURL(file);
    const duration: number = await new Promise((resolve) => {
      const probe = document.createElement("video");
      probe.preload = "metadata";
      probe.onloadedmetadata = () => resolve(probe.duration);
      probe.src = objectUrl;
    });

    if (duration > MAX_VIDEO_DURATION_SECONDS) {
      setError(
        `That video is ${Math.round(duration)}s long — Captionlift supports up to ${MAX_VIDEO_DURATION_SECONDS}s for now.`
      );
      setStage("idle");
      URL.revokeObjectURL(objectUrl);
      return;
    }

    setPreviewUrl(objectUrl);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login?next=/upload");
      return;
    }

    // Step 1: create the job row first — its id becomes part of the storage path,
    // and this is where the free-video limit actually gets enforced.
    const createRes = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        originalFilename: file.name,
        durationSeconds: Math.round(duration),
      }),
    });
    const createJson = await createRes.json();
    if (!createRes.ok) {
      setError(createJson.error ?? "Could not start this job.");
      setStage("error");
      return;
    }
    const jobId = createJson.jobId as string;

    // Step 2: upload the file straight to Storage from the browser.
    setStage("uploading");
    const ext = file.name.split(".").pop() || "mp4";
    const storagePath = `${user.id}/${jobId}/original.${ext}`;
    const { error: uploadError } = await supabase.storage.from("videos").upload(storagePath, file);
    if (uploadError) {
      setError(`Upload failed: ${uploadError.message}`);
      setStage("error");
      return;
    }

    // Step 3: ask the server to extract audio and transcribe it.
    setStage("transcribing");
    const transcribeRes = await fetch(`/api/jobs/${jobId}/transcribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ storagePath }),
    });
    const transcribeJson = await transcribeRes.json();
    if (!transcribeRes.ok) {
      setError(transcribeJson.error ?? "Transcription failed.");
      setStage("error");
      return;
    }

    setSegments(transcribeJson.captions ?? []);
    setProviderUsed(transcribeJson.provider ?? null);
    setStage("done");
  }

  function onTimeUpdate() {
    const t = videoRef.current?.currentTime ?? 0;
    const active = segments.find((seg) => t >= seg.start && t < seg.end);
    setActiveCaption(active?.text.toUpperCase() ?? "");
  }

  if (checkingAuth) {
    return <main className="min-h-screen" style={{ background: c.black }} />;
  }

  return (
    <main className="min-h-screen px-6 py-16" style={{ background: c.black }}>
      <div className="max-w-lg mx-auto">
        <Link
          href="/account"
          className="text-sm inline-block mb-8"
          style={{ color: c.whiteSoft, fontFamily: "var(--font-body)" }}
        >
          ← Back to account
        </Link>
        <h1 className="text-3xl mb-8" style={{ fontFamily: "var(--font-display)", color: c.white }}>
          Upload a video
        </h1>

        {stage === "idle" && (
          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="block w-full rounded-3xl p-10 text-center cursor-pointer"
              style={{ border: `2px dashed ${c.lineSoft}`, background: c.blackSoft }}
            >
              <p className="text-sm mb-2" style={{ color: c.white, fontFamily: "var(--font-body)" }}>
                Click to choose a video
              </p>
              <p className="text-xs" style={{ color: c.inkSoft, fontFamily: "var(--font-body)" }}>
                MP4, MOV or WebM · up to {MAX_VIDEO_DURATION_SECONDS}s
              </p>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/quicktime,video/webm"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </div>
        )}

        {(stage === "checking" || stage === "uploading" || stage === "transcribing") && (
          <div className="text-center py-16">
            <p className="text-sm" style={{ color: c.whiteSoft, fontFamily: "var(--font-body)" }}>
              {stage === "checking" && "Checking your video…"}
              {stage === "uploading" && "Uploading…"}
              {stage === "transcribing" && "Extracting audio and transcribing…"}
            </p>
          </div>
        )}

        {error && (
          <p className="text-sm mt-4" style={{ color: c.coral, fontFamily: "var(--font-body)" }}>
            {error}
          </p>
        )}

        {previewUrl && (stage === "done" || stage === "transcribing") && (
          <div className="relative rounded-2xl overflow-hidden mt-6" style={{ border: `1px solid ${c.lineSoft}` }}>
            <video
              ref={videoRef}
              src={previewUrl}
              controls
              playsInline
              onTimeUpdate={onTimeUpdate}
              className="w-full block"
            />
            {activeCaption && (
              <div className="absolute bottom-6 left-0 right-0 flex justify-center px-4 pointer-events-none">
                <span
                  className="px-3 py-1 rounded-md font-extrabold text-sm text-center"
                  style={{ background: c.yellow, color: c.ink, fontFamily: "var(--font-body)" }}
                >
                  {activeCaption}
                </span>
              </div>
            )}
          </div>
        )}

        {stage === "done" && (
          <div className="mt-4">
            {providerUsed === "mock" && (
              <p className="text-xs mb-2" style={{ color: c.yellow, fontFamily: "var(--font-mono)" }}>
                DEV MODE — showing placeholder captions, no transcription API key set yet.
              </p>
            )}
            <p className="text-xs" style={{ color: c.inkSoft, fontFamily: "var(--font-body)" }}>
              {segments.length} caption lines generated. Downloading a video with captions burned in is the next step.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
