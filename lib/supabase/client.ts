import { createBrowserClient } from '@supabase/ssr'

/* Changed: Added fallback values to prevent crash when env vars are not yet loaded per user request */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export function createClient() {
  /* Changed: Check if env vars are available before creating client per user request */
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and Anon Key are required. Please check your environment variables.')
  }
  
  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey,
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
