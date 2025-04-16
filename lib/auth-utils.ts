import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { UserType } from "./types";
import type { CookieOptions } from "@supabase/ssr";
import { RequestCookies } from "next/dist/server/web/spec-extension/cookies";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function getCurrentUser(): Promise<UserType | null> {
  try {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions = {}) {
            cookieStore.set(name, value, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              path: '/',
              ...options,
            });
          },
          remove(name: string) {
            cookieStore.delete(name);
          },
        },
      }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return null;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error("Error al obtener el perfil del usuario:", profileError);
      return null;
    }
    return profile;
  } catch (error) {
    console.error("Error al obtener el usuario actual:", error);
    return null;
  }
}