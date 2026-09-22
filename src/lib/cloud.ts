import { getSupabase } from "./supabase-safe";
import type { Tournament } from "./store";

export type CloudRow = {
  id: string;
  user_id: string;
  data: unknown;
  updated_at: string;
};

export async function currentUserId(): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id ?? null;
}

/** Scarica tutti i tornei dell'utente dal database. */
export async function pullTournaments(): Promise<Tournament[] | null> {
  const supabase = getSupabase();
  const userId = await currentUserId();
  if (!supabase || !userId) return null;
  const { data, error } = await supabase
    .from("tournaments")
    .select("id, data, updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });
  if (error) {
    console.error("[cloud] pull", error.message);
    return null;
  }
  return (data ?? [])
    .map((row) => row.data as unknown as Tournament)
    .filter((t): t is Tournament => Boolean(t && t.id));
}

/** Legge un singolo torneo dal database (lettura pubblica, anche senza accesso). */
export async function fetchTournament(id: string): Promise<Tournament | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("tournaments")
    .select("data")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.error("[cloud] fetch", error.message);
    return null;
  }
  const t = (data?.data ?? null) as Tournament | null;
  return t && t.id ? t : null;
}

/** Salva (crea o aggiorna) un torneo nel database. */
export async function pushTournament(t: Tournament): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;
  const userId = await currentUserId();
  const { error } = await supabase.from("tournaments").upsert(
    {
      id: t.id,
      user_id: userId,
      name: t.name,
      sport: t.sport,
      data: JSON.parse(JSON.stringify(t)),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );
  if (error) console.error("[cloud] push", error.message);
}

/** Elimina un torneo dal database. */
export async function deleteTournament(id: string): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;
  const { error } = await supabase.from("tournaments").delete().eq("id", id);
  if (error) console.error("[cloud] delete", error.message);
}
