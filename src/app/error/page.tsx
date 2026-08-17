import Link from "next/link";
import { colors as c } from "@/lib/theme";

export default function ErrorPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 text-center" style={{ background: c.black }}>
      <div>
        <h1 className="text-2xl mb-4" style={{ fontFamily: "var(--font-display)", color: c.white }}>
          Something went wrong
        </h1>
        <p className="text-sm mb-6" style={{ color: c.whiteSoft, fontFamily: "var(--font-body)" }}>
          That confirmation link may have expired or already been used.
        </p>
        <Link href="/login" style={{ color: c.yellow, fontFamily: "var(--font-body)" }}>
          Back to log in
        </Link>
      </div>
    </main>
  );
}
