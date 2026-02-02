/**
 * Database configuration and connection setup
 */
import { createClient } from '@supabase/supabase-js';

// Get credentials from environment variables
const SUPABASE_URL = (import.meta as any).env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Supabase credentials not configured. Some features may not work.');
}

/**
 * Supabase client instance
 * This is the main database connection used throughout the backend
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Database configuration object
 */
export const dbConfig = {
  url: SUPABASE_URL,
  isConfigured: Boolean(SUPABASE_URL && SUPABASE_ANON_KEY),
};
