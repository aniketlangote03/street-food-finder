import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Server-side Supabase client for Next.js App Router (server components / route handlers).
 *
 * Exports:
 * - named:  export function createClient()
 * - default: export default createClient
 *
 * This uses next/headers cookies() to forward the auth cookie for RLS.
 */

export function createClient() {
  const cookieStore = cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Throwing here is better than failing silently — callers will see the error clearly.
    // In some contexts (like static generation) you might want to handle missing envs differently.
    throw new Error(
      "Missing Supabase environment variables. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set."
    );
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      // next/headers cookies returns a RequestCookies-like object in server environment
      get(name: string) {
        try {
          return cookieStore.get(name)?.value;
        } catch {
          // If cookies() isn't available for some reason, return undefined.
          return undefined;
        }
      },
      set(name: string, value: string, options: any) {
        // In the server runtime you can set cookies; when running in contexts that don't allow it
        // (e.g., some static-render steps) we swallow errors to avoid build-time crashes.
        try {
          cookieStore.set(name, value, options);
        } catch {
          // ignore when cookies can't be set (SSR/static contexts)
        }
      },
      remove(name: string, options: any) {
        try {
          // remove by setting empty value and maxAge 0
          cookieStore.set(name, "", { ...options, maxAge: 0 });
        } catch {
          // ignore in static contexts
        }
      },
    },
  });
}

// Export default too so modules that `import createClient from '@/lib/supabase/server'` keep working.
export default createClient;
