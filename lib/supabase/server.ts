import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseEnv } from "./env";

export const createSupabaseServerClient = async () => {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        // Next.js 15/16 disallows writing cookies from a Server Component.
        // The call succeeds inside Server Actions and Route Handlers; in read-
        // only Server Component contexts it throws and we ignore it. Session
        // refresh for protected routes is handled by `middleware.ts`.
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Ignored — running in a read-only cookie context.
        }
      },
    },
  });
};
