import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const createServerSupabase = () => {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Cookies can only be modified in Route Handlers or Server Actions
            // This error can safely be ignored in server components
            if (!error.message?.includes('Cookies can only be modified')) {
              throw error;
            }
          }
        },
        remove(name, options) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Cookies can only be modified in Route Handlers or Server Actions
            // This error can safely be ignored in server components
            if (!error.message?.includes('Cookies can only be modified')) {
              throw error;
            }
          }
        },
      },
    }
  );
};