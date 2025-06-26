import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  // Environment variables for client-side (these are available via Next.js env injection)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please check your .env.local file:\n' +
        'NEXT_PUBLIC_SUPABASE_URL\n' +
        'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
