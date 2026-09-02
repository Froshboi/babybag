import { createClient } from '@supabase/supabase-js';

let supabaseAdminInstance = null;

const handler = {
  get(target, prop) {
    if (!supabaseAdminInstance) {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error('Missing required Supabase environment variables');
      }
      supabaseAdminInstance = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        { auth: { autoRefreshToken: false, persistSession: false } }
      );
    }
    return supabaseAdminInstance[prop];
  },
};

export const supabaseAdmin = new Proxy({}, handler);