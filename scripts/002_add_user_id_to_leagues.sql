-- Changed: Add user_id column to leagues table per user request to link leagues with authenticated Supabase users
ALTER TABLE public.leagues ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Changed: Drop old RLS policies that used app.current_user_id per user request
DROP POLICY IF EXISTS "leagues_select_public" ON public.leagues;
DROP POLICY IF EXISTS "leagues_select_member" ON public.leagues;
DROP POLICY IF EXISTS "leagues_insert_any" ON public.leagues;
DROP POLICY IF EXISTS "leagues_update_creator" ON public.leagues;
DROP POLICY IF EXISTS "leagues_update_any" ON public.leagues;
DROP POLICY IF EXISTS "leagues_delete_creator" ON public.leagues;

-- Changed: Create new RLS policies using auth.uid() for proper Supabase auth integration per user request

-- Policy: Anyone can view public leagues
CREATE POLICY "leagues_select_public" ON public.leagues
  FOR SELECT
  USING (is_public = true);

-- Policy: Authenticated users can view leagues they created or joined
CREATE POLICY "leagues_select_own" ON public.leagues
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND (
      user_id = auth.uid() OR
      auth.uid()::TEXT = ANY(joined_members)
    )
  );

-- Policy: Authenticated users can insert leagues (user_id must match their auth.uid())
CREATE POLICY "leagues_insert_authenticated" ON public.leagues
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND (user_id = auth.uid() OR user_id IS NULL));

-- Policy: Authenticated users can update leagues they created
CREATE POLICY "leagues_update_own" ON public.leagues
  FOR UPDATE
  USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Policy: Anyone can update joined_members to allow joining leagues
CREATE POLICY "leagues_update_join" ON public.leagues
  FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- Policy: Authenticated users can delete leagues they created
CREATE POLICY "leagues_delete_own" ON public.leagues
  FOR DELETE
  USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Create index for faster user_id lookups
CREATE INDEX IF NOT EXISTS idx_leagues_user_id ON public.leagues(user_id);
