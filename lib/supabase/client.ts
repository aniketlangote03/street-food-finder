"use client";

import { createClient as createSupabaseBrowserClient } from "@supabase/supabase-js";

let client: any = null;

/**
 * Supabase Browser Client (for Client Components only)
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or ANON KEY");
  }

  // Reuse client on hot reload
  if (client) return client;

  client = createSupabaseBrowserClient(supabaseUrl, supabaseAnonKey);
  return client;
}
