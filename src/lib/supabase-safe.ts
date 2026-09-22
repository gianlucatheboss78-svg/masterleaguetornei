import { supabase as rawSupabase } from "@/integrations/supabase/client";
import type { supabase as SupabaseClientType } from "@/integrations/supabase/client";

type Client = typeof SupabaseClientType;

/**
 * Il client del backend lancia un errore se le variabili d'ambiente mancano
 * (es. build pubblicata prima dell'attivazione di Lovable Cloud).
 * Qui lo recuperiamo in modo sicuro: se non è disponibile torniamo null e
 * l'app continua a funzionare in locale invece di mostrare schermo bianco.
 */
export function getSupabase(): Client | null {
  try {
    return rawSupabase as Client;
  } catch {
    return null;
  }
}

export const hasCloud = (): boolean => getSupabase() !== null;
