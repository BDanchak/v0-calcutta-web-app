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

-- Policy: Anyone can view public leagues
CREATE POLICY "leagues_select_public" ON public.leagues
  FOR SELECT
  USING (is_public = true);

-- Policy: Members can view leagues they've joined
CREATE POLICY "leagues_select_member" ON public.leagues
  FOR SELECT
  USING (created_by = current_setting('app.current_user_id', true) OR current_setting('app.current_user_id', true) = ANY(joined_members));

-- Policy: Anyone can insert leagues (for now, until auth is fully integrated)
CREATE POLICY "leagues_insert_any" ON public.leagues
  FOR INSERT
  WITH CHECK (true);

-- Policy: Creator can update their leagues
CREATE POLICY "leagues_update_creator" ON public.leagues
  FOR UPDATE
  USING (created_by = current_setting('app.current_user_id', true));

-- Policy: Anyone can update leagues (for joining) - simplified for now
CREATE POLICY "leagues_update_any" ON public.leagues
  FOR UPDATE
  WITH CHECK (true);

-- Policy: Creator can delete their leagues
CREATE POLICY "leagues_delete_creator" ON public.leagues
  FOR DELETE
  USING (created_by = current_setting('app.current_user_id', true));

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_leagues_created_by ON public.leagues(created_by);
CREATE INDEX IF NOT EXISTS idx_leagues_invite_code ON public.leagues(invite_code);
CREATE INDEX IF NOT EXISTS idx_leagues_is_public ON public.leagues(is_public);
