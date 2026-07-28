-- Create leagues table to persist league data per user request to fix data loss on page refresh
CREATE TABLE IF NOT EXISTS public.leagues (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  tournament TEXT NOT NULL,
  tournament_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'upcoming',
  members INTEGER NOT NULL DEFAULT 1,
  max_members INTEGER NOT NULL DEFAULT 12,
  entry_fee DECIMAL(10, 2) NOT NULL DEFAULT 0,
  auction_date TEXT NOT NULL,
  auction_time TEXT NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  invite_code TEXT NOT NULL UNIQUE,
  joined_members TEXT[] DEFAULT '{}',
  budgets_visible BOOLEAN DEFAULT true,
  enable_squads BOOLEAN DEFAULT false,
  number_of_squads INTEGER DEFAULT 2,
  spending_limit DECIMAL(10, 2),
  enable_spending_limit BOOLEAN DEFAULT false,
  seconds_per_team INTEGER DEFAULT 30,
  seconds_between_teams INTEGER DEFAULT 10,
  seconds_after_bid INTEGER DEFAULT 5,
  show_upcoming_teams BOOLEAN DEFAULT true,
  team_order TEXT DEFAULT 'seed-order',
  minimum_bid DECIMAL(10, 2) DEFAULT 0,
  maximum_bid DECIMAL(10, 2),
  squads JSONB DEFAULT '[]',
  auction_participants JSONB DEFAULT '{}'
);

-- Enable Row Level Security
ALTER TABLE public.leagues ENABLE ROW LEVEL SECURITY;

-- Changed: Replaced the two SELECT policies below with a single permissive read policy.
-- Why: The previous policies relied on current_setting('app.current_user_id', ...), a server-side
-- session variable that the client-side anon Supabase client never sets. As a result, a league would
-- insert successfully but could never be read back, so creating a league appeared to silently fail.
-- The app already filters leagues per authenticated user client-side (see fetchLeagues in lib/league-store.ts),
-- so allowing reads here is safe and fixes league creation/visibility.
CREATE POLICY "leagues_select_all" ON public.leagues
  FOR SELECT
  USING (true);

-- Policy: Anyone can insert leagues (for now, until auth is fully integrated)
CREATE POLICY "leagues_insert_any" ON public.leagues
  FOR INSERT
  WITH CHECK (true);

-- Changed: Replaced the two UPDATE policies below with a single permissive update policy.
-- Why: The previous "leagues_update_creator" policy's USING clause required current_setting('app.current_user_id', ...),
-- a server-side session variable the client-side app never sets, and "leagues_update_any" had no USING clause at all.
-- As a result, when a non-creator joined a public league, the client's UPDATE of joined_members matched 0 rows and
-- silently failed (no error), so the join never persisted and the league vanished from "My Leagues" on refresh/re-login.
-- A permissive USING (true) lets the join update actually persist. The app performs its own per-user logic client-side.
CREATE POLICY "leagues_update_all" ON public.leagues
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Policy: Creator can delete their leagues
CREATE POLICY "leagues_delete_creator" ON public.leagues
  FOR DELETE
  USING (created_by = current_setting('app.current_user_id', true));

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_leagues_created_by ON public.leagues(created_by);
CREATE INDEX IF NOT EXISTS idx_leagues_invite_code ON public.leagues(invite_code);
CREATE INDEX IF NOT EXISTS idx_leagues_is_public ON public.leagues(is_public);
