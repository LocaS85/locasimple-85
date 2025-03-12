
import { createClient } from '@supabase/supabase-js';

// Environment variables from config
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config/environment';

// Create Supabase client with the provided keys
const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// Log connection status (for development)
console.log('Supabase client initialized with URL:', SUPABASE_URL.substring(0, 15) + '...');

export default supabase;
