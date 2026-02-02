-- ============================================
-- ADD USERNAME COLUMN TO PROFILES TABLE
-- Copy and paste this entire script into:
-- Supabase Dashboard → SQL Editor → New Query
-- Then click "Run"
-- ============================================

-- Step 1: Add username column if it doesn't exist
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;

-- Step 2: Create unique index on username
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- Step 3: Update RLS policies to allow username access
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Step 4: Recreate insert policy
CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Step 5: Create policy for reading by username (for login lookup)
DROP POLICY IF EXISTS "Anyone can lookup username" ON public.profiles;

CREATE POLICY "Anyone can lookup username"
  ON public.profiles
  FOR SELECT
  USING (true);  -- Allow anyone to see username for login purposes

-- ============================================
-- VERIFY SETUP
-- ============================================
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'profiles' ORDER BY column_name;

-- SELECT * FROM pg_policies WHERE tablename = 'profiles' ORDER BY policyname;
