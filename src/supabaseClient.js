// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Verifica que las variables de entorno estén configuradas correctamente
export function checkSupabaseConfig() {
  const hasUrl = typeof supabaseUrl === 'string' && supabaseUrl.length > 0;
  const hasKey = typeof supabaseAnonKey === 'string' && supabaseAnonKey.length > 0;
  if (!hasUrl || !hasKey) {
    console.error('[Supabase] Variables de entorno faltantes o vacías:', {
      hasUrl,
      hasKey
    });
    return false;
  }
  return true;
}

// Intenta una operación mínima para comprobar conectividad
export async function verifySupabaseConnectivity() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    console.info('[Supabase] Conexión OK. Sesión actual:', !!data?.session);
    return true;
  } catch (err) {
    console.error('[Supabase] Error de conectividad:', err);
    return false;
  }
}