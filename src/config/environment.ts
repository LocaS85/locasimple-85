
/**
 * Environment variables configuration
 * 
 * This file centralizes all environment variable access to ensure consistency
 * and proper fallbacks throughout the application.
 */

// Mapbox configuration
export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 
  'pk.eyJ1IjoibG9jYXNpbXBsZSIsImEiOiJjbTdwMTZmZXAwZ3Q4MmtyM3U1bG8weng3In0.38X4Wh5p8tTmfNQj1rqutw';

// Verify and log Mapbox token status
if (!MAPBOX_TOKEN || MAPBOX_TOKEN === '') {
  console.error('MAPBOX_TOKEN is missing. Map functionality will not work properly.');
  console.error('Please set the VITE_MAPBOX_TOKEN environment variable in a .env file');
} else {
  console.log('MAPBOX_TOKEN is configured:', MAPBOX_TOKEN.substring(0, 10) + '...');
}

// Supabase configuration
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 
  'https://lnnzfcdkqdqtfmpyxsst.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxubnpmY2RrcWRxdGZtcHl4c3N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNjU0MjAsImV4cCI6MjA1Njg0MTQyMH0.9sjYQRFf0FX0Ria7DlD16tuF7fNzTXpyIc6Uh9yGoNQ';

// Verify and log Supabase configuration status
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Supabase configuration is incomplete. Authentication and database features will not work properly.');
} else {
  console.log('Supabase configuration is loaded');
}

// Add other API keys or configuration variables here
