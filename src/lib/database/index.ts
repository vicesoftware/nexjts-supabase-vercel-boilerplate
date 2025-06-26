// Browser client for client-side components
export { createClient as createBrowserClient } from './supabase-browser';

// Server clients (only import these on server-side)
export { supabase, supabaseAdmin } from './supabase';
