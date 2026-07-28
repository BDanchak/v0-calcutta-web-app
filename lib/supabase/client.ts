import { createBrowserClient } from '@supabase/ssr'

/* Changed: Added fallback values to prevent crash when env vars are not yet loaded per user request */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

/* Changed: Cache a single browser client instance so multiple callers don't each create their own
   client. Multiple clients competed for the same auth lock (navigator.locks), causing
   "AbortError: Lock broken by another request with the 'steal' option." Fix per runtime error. */
let browserClient: ReturnType<typeof createBrowserClient> | undefined

export function createClient() {
  /* Changed: Check if env vars are available before creating client per user request */
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and Anon Key are required. Please check your environment variables.')
  }

  /* Changed: Return the already-created singleton instance if it exists, preventing duplicate
     auth-lock holders that triggered the "Lock broken" AbortError. */
  if (browserClient) {
    return browserClient
  }

  /* Changed: Create the client once and store it in the module-level singleton for reuse. */
  browserClient = createBrowserClient(
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
        /* Changed: Provide a no-op lock that simply runs the callback instead of using the browser's
           navigator.locks API. GoTrue's default lock acquires the lock with the "steal" option during
           token refresh, and in the multi-iframe preview environment those locks get stolen from each
           other, throwing "AbortError: Lock broken by another request with the 'steal' option."
           Running the callback directly avoids navigator.locks entirely and eliminates that error. */
        lock: async (_name: string, _acquireTimeout: number, fn: () => Promise<any>) => fn(),
      },
    }
  )

  return browserClient
}
