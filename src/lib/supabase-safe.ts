import * as supabaseModule from "@/integrations/supabase/client";

type Client = typeof supabaseModule.supabase;

/**
 * Il client del backend lancia un errore se le variabili d'ambiente mancano
 * (es. build pubblicata prima dell'attivazione di Lovable Cloud).
 * Qui lo recuperiamo in modo sicuro: se non è disponibile torniamo null e
 * l'app continua a funzionare in locale invece di mostrare schermo bianco.
 */
export function getSupabase(): Client | null {
  try {
    const client = supabaseModule.supabase;
    // `supabase` is lazy and only validates its environment when a property
    // is read. Force that validation inside this guard so callers never
    // receive a proxy that can throw outside the try/catch.
    void client.auth;
    return client;
  } catch {
    return null;
  }
}

export const hasCloud = (): boolean => getSupabase() !== null;
