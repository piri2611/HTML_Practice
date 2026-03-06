/**
 * Database configuration and connection setup
 */
import { createClient } from '@supabase/supabase-js';

// Get credentials from environment variables
const SUPABASE_URL = (import.meta as any).env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

// early environment validation
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // log a helpful message for developers and continue with a dummy client
  console.warn(
    'Supabase credentials are missing. Features depending on the database will not work.\n' +
      'Create a `.env` file in the project root and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (see DEPLOYMENT.md).'
  );
}

/**
 * Supabase client instance
 * This is the main database connection used throughout the backend
 */
// build either a real or a dummy client depending on configuration
const realSupabase = SUPABASE_URL && SUPABASE_ANON_KEY
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// dummy proxy that throws a helpful error for any accessed property
const dummySupabase = new Proxy(
  {},
  {
    get() {
      throw new Error(
        'Supabase client is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
      );
    },
  }
);

export const supabase = (realSupabase || dummySupabase) as any;

/**
 * Database configuration object
 */
export const dbConfig = {
  url: SUPABASE_URL,
  isConfigured: Boolean(SUPABASE_URL && SUPABASE_ANON_KEY),
};
