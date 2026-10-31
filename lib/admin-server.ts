import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Verifies the request comes from a signed-in admin.
 * Returns a Supabase client acting as that user (so RLS still applies), or null.
 */
export async function requireAdmin(req: Request): Promise<SupabaseClient | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!url || !key || !token) return null;

  const sb = createClient(url, key, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await sb.rpc('is_admin');
  return !error && data === true ? sb : null;
}
