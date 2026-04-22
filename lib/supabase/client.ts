import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "./env";

export const createSupabaseBrowserClient = () => {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv();

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};
