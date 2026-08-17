"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { colors as c } from "@/lib/theme";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/account");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6" style={{ background: c.black }}>
      <div className="w-full max-w-sm">
        <Link href="/" className="text-sm inline-block mb-8" style={{ color: c.whiteSoft, fontFamily: "var(--font-body)" }}>
          ← Back to Captionly
        </Link>
        <h1 className="text-3xl mb-8" style={{ fontFamily: "var(--font-display)", color: c.white }}>
          Log in
        </h1>
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
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>
        <p className="text-sm mt-6" style={{ color: c.inkSoft, fontFamily: "var(--font-body)" }}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" style={{ color: c.yellow }}>
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
