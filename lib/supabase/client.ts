import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      /* Changed: Added auth options to ensure proper session persistence per user request */
      auth: {
        /* Changed: Enable session persistence to localStorage per user request */
        persistSession: true,
        /* Changed: Enable automatic token refresh per user request */
        autoRefreshToken: true,
        /* Changed: Detect session from URL for OAuth/email confirmation flows per user request */
        detectSessionInUrl: true,
      },
    }
  )
}
