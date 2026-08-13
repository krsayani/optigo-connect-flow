import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

let cachedAdmin: SupabaseClient<Database> | null = null;
let cachedAuth: SupabaseClient<Database> | null = null;

function supabaseUrl() {
  return process.env["VITE_SUPABASE_URL"] || process.env["SUPABASE_URL"];
}

export function getSupabase(): SupabaseClient<Database> | null {
  if (cachedAdmin) return cachedAdmin;

  const url = supabaseUrl();
  const key =
    process.env["SUPABASE_SERVICE_ROLE_KEY"] ||
    process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
    process.env["VITE_SUPABASE_ANON_KEY"] ||
    process.env["SUPABASE_ANON_KEY"];

  if (!url || !key) return null;

  cachedAdmin = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cachedAdmin;
}

export function getSupabaseAuth(): SupabaseClient<Database> | null {
  if (cachedAuth) return cachedAuth;

  const url = supabaseUrl();
  const key =
    process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
    process.env["VITE_SUPABASE_ANON_KEY"] ||
    process.env["SUPABASE_ANON_KEY"];

  if (!url || !key) return null;

  cachedAuth = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cachedAuth;
}

