
/**
 * Environment variables configuration
 */

// Mapbox configuration
export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

// Supabase configuration
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 
  'https://lnnzfcdkqdqtfmpyxsst.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxubnpmY2RrcWRxdGZtcHl4c3N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNjU0MjAsImV4cCI6MjA1Njg0MTQyMH0.9sjYQRFf0FX0Ria7DlD16tuF7fNzTXpyIc6Uh9yGoNQ';

// Log configurations for debugging
console.log('Environment configuration loaded:');
console.log('- Mapbox token available:', !!MAPBOX_TOKEN);
console.log('- Supabase URL:', SUPABASE_URL);

// Verify and log configuration status
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Supabase configuration is incomplete');
} else {
  console.log('Supabase configuration loaded');
}
