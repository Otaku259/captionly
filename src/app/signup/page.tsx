"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { colors as c } from "@/lib/theme";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 text-center" style={{ background: c.black }}>
        <div className="max-w-sm">
          <h1 className="text-2xl mb-4" style={{ fontFamily: "var(--font-display)", color: c.white }}>
            Check your email
          </h1>
          <p className="text-sm" style={{ color: c.whiteSoft, fontFamily: "var(--font-body)" }}>
            We&apos;ve sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6" style={{ background: c.black }}>
      <div className="w-full max-w-sm">
        <Link href="/" className="text-sm inline-block mb-8" style={{ color: c.whiteSoft, fontFamily: "var(--font-body)" }}>
          ← Back to Captionlift
        </Link>
        <h1 className="text-3xl mb-2" style={{ fontFamily: "var(--font-display)", color: c.white }}>
          Create your account
        </h1>
        <p className="text-sm mb-8" style={{ color: c.inkSoft, fontFamily: "var(--font-body)" }}>
          Your first video is free — no card required.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm block mb-1" style={{ color: c.whiteSoft, fontFamily: "var(--font-body)" }}>
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: c.blackSoft, border: `1px solid ${c.lineSoft}`, color: c.white, fontFamily: "var(--font-body)" }}
            />
          </div>
          <div>
            <label className="text-sm block mb-1" style={{ color: c.whiteSoft, fontFamily: "var(--font-body)" }}>
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: c.blackSoft, border: `1px solid ${c.lineSoft}`, color: c.white, fontFamily: "var(--font-body)" }}
            />
          </div>
          {error && (
            <p className="text-sm" style={{ color: c.coral, fontFamily: "var(--font-body)" }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-full font-semibold mt-2"
            style={{ background: c.yellow, color: c.ink, fontFamily: "var(--font-body)", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Creating account…" : "Sign up"}
          </button>
        </form>
        <p className="text-sm mt-6" style={{ color: c.inkSoft, fontFamily: "var(--font-body)" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: c.yellow }}>
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
