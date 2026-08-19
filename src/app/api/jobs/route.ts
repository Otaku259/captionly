import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { FREE_VIDEO_LIMIT, MAX_VIDEO_DURATION_SECONDS } from "@/lib/config";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const originalFilename = body?.originalFilename as string | undefined;
  const durationSeconds = body?.durationSeconds as number | undefined;

  if (typeof durationSeconds === "number" && durationSeconds > MAX_VIDEO_DURATION_SECONDS) {
    return NextResponse.json(
      { error: `Videos are limited to ${MAX_VIDEO_DURATION_SECONDS} seconds for now.` },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  // Server-side enforcement of the free-video limit — the only check that
  // actually matters. Nothing from the browser is trusted for this.
  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("plan, free_jobs_used")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: "Could not load your account." }, { status: 500 });
  }

  if (profile.plan === "free" && profile.free_jobs_used >= FREE_VIDEO_LIMIT) {
    return NextResponse.json(
      {
        error: "You've used your free video. Upgrade to lifetime for unlimited captions.",
        code: "LIMIT_REACHED",
      },
      { status: 403 }
    );
  }

  const { data: job, error: jobError } = await admin
    .from("video_jobs")
    .insert({
      user_id: user.id,
      original_filename: originalFilename ?? null,
      duration_seconds: durationSeconds ?? null,
      status: "uploaded",
    })
    .select("id")
    .single();

  if (jobError || !job) {
    return NextResponse.json({ error: "Could not create the video job." }, { status: 500 });
  }

  return NextResponse.json({ jobId: job.id });
}
