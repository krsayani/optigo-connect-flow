import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const url = import.meta.env.VITE_SUPABASE_URL;
const key =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  import.meta.env.VITE_SUPABASE_ANON_KEY;

export function isSupabaseConfigured() {
  return Boolean(url && key);
}

export const supabase =
  url && key
    ? createClient<Database>(url, key, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;
