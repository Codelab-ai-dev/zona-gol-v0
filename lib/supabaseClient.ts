// lib/supabaseClient.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Verificamos que las variables de entorno estén definidas, lanzando un error en caso contrario.
if (!supabaseUrl) {
  throw new Error('La variable de entorno NEXT_PUBLIC_SUPABASE_URL no está definida');
}

if (!supabaseAnonKey) {
  throw new Error('La variable de entorno NEXT_PUBLIC_SUPABASE_ANON_KEY no está definida');
}

// Creamos e instanciamos el cliente de Supabase, tipado como SupabaseClient.
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);