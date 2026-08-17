"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { colors as c } from "@/lib/theme";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm px-4 py-2 rounded-full"
      style={{ border: `1px solid ${c.lineSoft}`, color: c.whiteSoft, fontFamily: "var(--font-body)" }}
    >
      Log out
    </button>
  );
}
