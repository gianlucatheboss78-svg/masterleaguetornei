import { supabase } from "@/integrations/supabase/client";
import type { Tournament } from "./store";

export type CloudRow = {
  id: string;
  user_id: string;
  data: unknown;
  updated_at: string;
};

export async function currentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id ?? null;
}

/** Scarica tutti i tornei dell'utente dal database. */
export async function pullTournaments(): Promise<Tournament[] | null> {
  const userId = await currentUserId();
  if (!userId) return null;
  const { data, error } = await supabase
    .from("tournaments")
    .select("id, data, updated_at")
    .order("updated_at", { ascending: false });
  if (error) {
    console.error("[cloud] pull", error.message);
    return null;
  }
  return (data ?? [])
    .map((row) => row.data as unknown as Tournament)
    .filter((t): t is Tournament => Boolean(t && t.id));
}

/** Salva (crea o aggiorna) un torneo nel database. */
export async function pushTournament(t: Tournament): Promise<void> {
  const userId = await currentUserId();
  if (!userId) return;
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
  const userId = await currentUserId();
  if (!userId) return;
  const { error } = await supabase.from("tournaments").delete().eq("id", id);
  if (error) console.error("[cloud] delete", error.message);
}
