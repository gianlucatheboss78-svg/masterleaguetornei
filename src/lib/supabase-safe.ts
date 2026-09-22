import { createClient } from "@supabase/supabase-js";
import * as supabaseModule from "@/integrations/supabase/client";

type Client = typeof supabaseModule.supabase;

/** Valori pubblici del progetto: servono da riserva se la build pubblicata
 *  non ha ricevuto le variabili d'ambiente (chiave pubblica, non segreta). */
const FALLBACK_URL = "https://otyeapygynhgqtqadhmp.supabase.co";
const FALLBACK_KEY = "sb_publishable_ngdWWjWQytETqA9xR50u_Q_8vI2ERrg";

let fallbackClient: Client | null = null;

function makeFallback(): Client | null {
  if (fallbackClient) return fallbackClient;
  try {
    fallbackClient = createClient(FALLBACK_URL, FALLBACK_KEY, {
      global: {
        fetch: (input, init) => {
          const headers = new Headers(init?.headers);
          if (headers.get("Authorization") === `Bearer ${FALLBACK_KEY}`) {
            headers.delete("Authorization");
          }
          headers.set("apikey", FALLBACK_KEY);
          return fetch(input, { ...init, headers });
        },
      },
      auth: { persistSession: true, autoRefreshToken: true },
    }) as unknown as Client;
    return fallbackClient;
  } catch {
    return null;
  }
}

/**
 * Il client del backend lancia un errore se le variabili d'ambiente mancano
 * (es. build pubblicata prima dell'attivazione di Lovable Cloud).
 * In quel caso usiamo il client di riserva, così i tornei restano condivisibili.
 */
export function getSupabase(): Client | null {
  try {
    const client = supabaseModule.supabase;
    // `supabase` is lazy and only validates its environment when a property
    // is read. Force that validation inside this guard.
    void client.auth;
    return client;
  } catch {
    return makeFallback();
  }
}

export const hasCloud = (): boolean => getSupabase() !== null;
