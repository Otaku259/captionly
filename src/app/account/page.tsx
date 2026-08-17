import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FREE_VIDEO_LIMIT, LIFETIME_PRICE_GBP, formatPrice } from "@/lib/config";
import { colors as c } from "@/lib/theme";
import LogoutButton from "./logout-button";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Falls back to sensible defaults if the profiles table/migration
  // hasn't been set up yet, so this page never hard-crashes.
  const { data: profile } = await supabase
    .from("profiles")
    .select("email, plan, free_jobs_used")
    .eq("id", user.id)
    .single();

  const plan = profile?.plan ?? "free";
  const freeJobsUsed = profile?.free_jobs_used ?? 0;
  const remaining = Math.max(FREE_VIDEO_LIMIT - freeJobsUsed, 0);

  return (
    <main className="min-h-screen px-6 py-16 flex justify-center" style={{ background: c.black }}>
      <div className="w-full max-w-md">
        <h1 className="text-3xl mb-8" style={{ fontFamily: "var(--font-display)", color: c.white }}>
          Your account
        </h1>
        <div className="rounded-2xl p-6 mb-6" style={{ background: c.blackSoft, border: `1px solid ${c.lineSoft}` }}>
          <p className="text-sm mb-4" style={{ color: c.whiteSoft, fontFamily: "var(--font-body)" }}>
            {profile?.email ?? user.email}
          </p>

          {plan === "lifetime" ? (
            <>
              <p className="text-lg font-semibold mb-1" style={{ color: c.yellow, fontFamily: "var(--font-body)" }}>
                Lifetime access
              </p>
              <p className="text-sm" style={{ color: c.inkSoft, fontFamily: "var(--font-body)" }}>
                Unlimited videos · Ad-free
              </p>
            </>
          ) : (
            <>
              <p className="text-lg font-semibold mb-1" style={{ color: c.white, fontFamily: "var(--font-body)" }}>
                Free plan
              </p>
              <p className="text-sm mb-4" style={{ color: c.inkSoft, fontFamily: "var(--font-body)" }}>
                {remaining} of {FREE_VIDEO_LIMIT} free video{FREE_VIDEO_LIMIT === 1 ? "" : "s"} remaining
              </p>
              {/* Not wired to PayPal yet — becomes a real checkout link in a later step. */}
              <span
                className="inline-block px-5 py-2.5 rounded-full font-semibold text-sm"
                style={{ background: c.yellow, color: c.ink, fontFamily: "var(--font-body)" }}
              >
                Upgrade — {formatPrice(LIFETIME_PRICE_GBP)} lifetime (coming soon)
              </span>
            </>
          )}
        </div>
        <LogoutButton />
      </div>
    </main>
  );
}
