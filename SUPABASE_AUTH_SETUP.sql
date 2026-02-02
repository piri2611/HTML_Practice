-- ============================================
-- SUPABASE AUTHENTICATION SETUP
-- This file contains SQL to configure proper authentication
-- Copy and paste this entire script into:
-- Supabase Dashboard → SQL Editor → New Query
-- Then click "Run"
-- ============================================

-- NOTE: Email uniqueness is AUTOMATICALLY enforced by Supabase auth.users table
-- The auth.users table has a UNIQUE constraint on the email column

-- Step 1: Check if email uniqueness constraint exists (for reference)
-- SELECT constraint_name 
-- FROM information_schema.table_constraints 
-- WHERE table_name = 'users' AND constraint_type = 'UNIQUE';

-- Step 2: Verify profiles table has proper foreign key
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_id_fkey,
  ADD CONSTRAINT profiles_id_fkey 
    FOREIGN KEY (id) 
    REFERENCES auth.users(id) 
    ON DELETE CASCADE;

-- Step 3: Create unique index on profiles email (optional, for faster lookups)
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Step 4: Enable Row Level Security on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Step 5: Create RLS Policy - Users can view their own profile
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Step 6: Create RLS Policy - Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Step 7: Create RLS Policy - Users can insert their own profile (for signup)
CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Step 8: Verify auth configuration
-- Authentication in Supabase uses these settings:
-- 1. Email/Password auth is enabled by default
-- 2. Email confirmation can be toggled (currently DISABLED based on earlier steps)
-- 3. Each user gets a unique ID automatically
-- 4. Email uniqueness is enforced at the auth.users table level

-- Step 9: Check existing users (optional)
-- SELECT id, email, created_at FROM auth.users LIMIT 10;

-- ============================================
-- KEY POINTS FOR EMAIL VALIDATION
-- ============================================
-- 1. Supabase auth.users table automatically has UNIQUE constraint on email
-- 2. When trying to sign up with duplicate email, Supabase returns error:
--    "User already exists"
-- 3. No need to manually check email existence - Supabase handles it
-- 4. Login with email/password is validated against auth.users table
-- 5. The application receives proper error messages from Supabase

-- ============================================
-- TROUBLESHOOTING
-- ============================================
-- If you see "relation does not exist" for profiles:
-- Create the profiles table with:
-- CREATE TABLE IF NOT EXISTS public.profiles (
--   id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
--   full_name TEXT,
--   email TEXT UNIQUE,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );

-- If you need to delete all test users:
-- DELETE FROM public.profiles;
-- DELETE FROM auth.users; -- This will cascade delete profiles

-- Verify policies are in place:
-- SELECT * FROM pg_policies WHERE tablename = 'profiles';
