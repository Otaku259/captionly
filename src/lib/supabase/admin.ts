import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Uses the service_role key, which bypasses Row Level Security entirely.
 * NEVER import this file from a Client Component, and never send this
 * client (or its key) to the browser. It exists only so trusted
 * server-side code — API routes — can do the things RLS deliberately
 * blocks the browser from doing: changing plan, usage counts, and job
 * status/results.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
