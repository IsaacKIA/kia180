import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

interface CookieToSet {
  name: string;
  value: string;
  options?: CookieOptions;
}

export async function createClient() {
  const cookieStore = await cookies();

  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    'https://eakaagtmthajiuxpyipb.supabase.co';
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    'sb_publishable_PoNRq9hXY1dikqy0i8HisA_qcwjlwtA';

  return createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Can be ignored if called from Server Component
          }
        },
      },
    }
  );
}
