import { useCallback, useEffect, useState } from "react";
import type { TennisState } from "./tennis";
import type { BasketState } from "./basket";
import type { VolleyState } from "./volley";

export type Player = {
  id: string;
  name: string;
  photo?: string;
  country: string;
  birth: string;
  season?: string;
  role: string;
  paid: boolean;
};

export type GroupId = "A" | "B";

export type Team = {
  id: string;
  name: string;
  logo?: string;
  color1?: string;
  group?: GroupId;
  players: Player[];
};

export type EventType =
  | "goal"
  | "owngoal"
  | "pengoal"
  | "pensaved"
  | "penmissed"
  | "yellow"
  | "red"
  | "dblyellow"
  | "sub"
  | "mvp";

export type MatchEvent = {
  id: string;
  playerId: string;
  teamId: string;
  type: EventType;
  minute: string;
};

export type KoInfo = { round: number; index: number; kind?: "third" };

export type Match = {
  id: string;
  round: number;
  teamA: string;
  teamB: string;
  date: string;
  time: string;
  venue: string;
  scoreA: number;
  scoreB: number;
  status: "programmata" | "live" | "finita";
  events: MatchEvent[];
  group?: GroupId;
  ko?: KoInfo;
  /** Tennis/Padel: stato punteggio 15-30-40, set e tie-break. */
  tennis?: TennisState;
  /** Tennis/Padel: game vinti (usati per la differenza game in classifica). */
  gamesA?: number;
  gamesB?: number;
  /** Basket: periodo, cronometro e falli persistenti. */
  basket?: BasketState;
  /** Volley/Beach Volley: set conclusi e punti del set in corso. */
  volley?: VolleyState;
};

export type TournamentFormat = "single" | "singleko" | "groups";

export type Tournament = {
  id: string;
  name: string;
  sport: string;
  /** Variante del calcio: a5 | a6 | a7 | a8 | a11 */
  variant?: string;
  logo?: string;
  city: string;
  startDate: string;
  fee: number;
  format?: TournamentFormat;
  qualifiers?: number;
  teams: Team[];
  matches: Match[];
};

const KEY = "mlt.tournaments.v1";
const REMOVED_SPORT_IDS = new Set(["biliardino", "hockey", "pallanuoto"]);

export const uid = () => Math.random().toString(36).slice(2, 10);

function read(): Tournament[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(KEY) ?? "[]") as Tournament[];
    const cleaned = parsed.filter((tournament) => !REMOVED_SPORT_IDS.has(tournament.sport));
    if (cleaned.length !== parsed.length) {
      window.localStorage.setItem(KEY, JSON.stringify(cleaned));
    }
    return cleaned;
  } catch {
    return [];
  }
}

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function writeLocal(data: Tournament[]) {
  window.localStorage.setItem(
    KEY,
    JSON.stringify(data.filter((tournament) => !REMOVED_SPORT_IDS.has(tournament.sport))),
  );
}

/** Salva in locale e sincronizza le differenze con il database. */
export function saveAll(data: Tournament[]) {
  const before = read();
  const next = data.filter((tournament) => !REMOVED_SPORT_IDS.has(tournament.sport));
  writeLocal(next);
  emit();
  void syncDiff(before, next);
}

async function syncDiff(before: Tournament[], after: Tournament[]) {
  if (typeof window === "undefined") return;
  const { pushTournament, deleteTournament } = await import("./cloud");
  const beforeMap = new Map(before.map((t) => [t.id, JSON.stringify(t)]));
  const afterIds = new Set(after.map((t) => t.id));
  for (const t of after) {
    if (beforeMap.get(t.id) !== JSON.stringify(t)) await pushTournament(t);
  }
  for (const t of before) {
    if (!afterIds.has(t.id)) await deleteTournament(t.id);
  }
}

const uploaded = new Set<string>();

/** Scarica i tornei dal database e li unisce a quelli presenti sul dispositivo. */
export async function syncFromCloud(): Promise<void> {
  if (typeof window === "undefined") return;
  const { pullTournaments, pushTournament } = await import("./cloud");
  const remote = await pullTournaments();
  if (!remote) {
    // Nessun account collegato: carica comunque online i tornei del dispositivo.
    for (const t of read()) {
      if (uploaded.has(t.id)) continue;
      uploaded.add(t.id);
      await pushTournament(t);
    }
    return;
  }
  const local = read();
  const remoteIds = new Set(remote.map((t) => t.id));
  const onlyLocal = local.filter((t) => !remoteIds.has(t.id));
  for (const t of onlyLocal) await pushTournament(t);
  const merged = [...onlyLocal, ...remote].filter(
    (tournament) => !REMOVED_SPORT_IDS.has(tournament.sport),
  );
  writeLocal(merged);
  emit();
}

export function useTournaments() {
  const [data, setData] = useState<Tournament[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setData(read());
    sync();
    setReady(true);
    listeners.add(sync);
    void syncFromCloud();
    const onFocus = () => void syncFromCloud();
    window.addEventListener("focus", onFocus);
    return () => {
      listeners.delete(sync);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  const update = useCallback((fn: (list: Tournament[]) => Tournament[]) => {
    saveAll(fn(read()));
  }, []);

  return { data, ready, update };
}

export function useTournament(id: string) {
  const { data, ready, update } = useTournaments();
  const [remote, setRemote] = useState<Tournament | null>(null);
  const [remoteDone, setRemoteDone] = useState(false);
  const local = data.find((t) => t.id === id) ?? null;

  // Legge prima dal database, poi ricade sui dati del dispositivo.
  useEffect(() => {
    let alive = true;
    setRemoteDone(false);
    void (async () => {
      let found: Tournament | null = null;
      try {
        const { fetchTournament } = await import("./cloud");
        found = await fetchTournament(id);
      } catch {
        found = null;
      }
      if (!alive) return;
      if (found) {
        setRemote(found);
        // Copia il torneo sul dispositivo così può essere aperto e modificato.
        const list = read();
        if (!list.some((t) => t.id === found!.id)) writeLocal([found, ...list]), emit();
      }
      setRemoteDone(true);
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  const tournament = local ?? remote;
  const patch = useCallback(
    (fn: (t: Tournament) => Tournament) =>
      update((list) => list.map((t) => (t.id === id ? fn(t) : t))),
    [id, update],
  );
  return { tournament, ready, patch };
}

export type Row = {
  team: Team;
  g: number;
  v: number;
  n: number;
  p: number;
  gf: number;
  gs: number;
  pts: number;
  /** Campi derivati usati dalla classifica Volley/Beach Volley. */
  sf?: number;
  sa?: number;
  pf?: number;
  pa?: number;
};

export function standings(
  t: Tournament,
  winPts: number,
  drawPts: number,
  group?: GroupId,
): Row[] {
  const rows = new Map<string, Row>();
  t.teams
    .filter((team) => (group ? team.group === group : true))
    .forEach((team) =>
      rows.set(team.id, { team, g: 0, v: 0, n: 0, p: 0, gf: 0, gs: 0, pts: 0 }),
    );
  t.matches
    .filter((m) => m.status === "finita" && !m.ko && (group ? m.group === group : true))
    .forEach((m) => {
      const a = rows.get(m.teamA);
      const b = rows.get(m.teamB);
      if (!a || !b) return;
      a.g++; b.g++;
      // Tennis/Padel: la differenza in classifica usa i game, non i set.
      const ga = m.gamesA ?? m.scoreA;
      const gb = m.gamesB ?? m.scoreB;
      a.gf += ga; a.gs += gb;
      b.gf += gb; b.gs += ga;
      if (m.scoreA > m.scoreB) { a.v++; b.p++; a.pts += winPts; }
      else if (m.scoreB > m.scoreA) { b.v++; a.p++; b.pts += winPts; }
      else { a.n++; b.n++; a.pts += drawPts; b.pts += drawPts; }
    });
  return [...rows.values()].sort(
    (x, y) => y.pts - x.pts || y.gf - y.gs - (x.gf - x.gs) || y.gf - x.gf,
  );
}

export function scorers(t: Tournament) {
  const map = new Map<string, { player: Player; team: Team; goals: number; mvp: number }>();
  t.matches.forEach((m) =>
    m.events.forEach((e) => {
      const team = t.teams.find((tm) => tm.id === e.teamId);
      const player = team?.players.find((p) => p.id === e.playerId);
      if (!team || !player) return;
      const cur = map.get(player.id) ?? { player, team, goals: 0, mvp: 0 };
      if (e.type === "goal" || e.type === "pengoal") cur.goals++;
      if (e.type === "mvp") cur.mvp++;
      map.set(player.id, cur);
    }),
  );
  return [...map.values()].sort((a, b) => b.goals - a.goals || b.mvp - a.mvp);
}

/** Calendario automatico all'italiana (round robin, algoritmo del cerchio). */
export function autoCalendar(teams: Team[], startDate: string, venue: string): Match[] {
  const ids = teams.map((t) => t.id);
  if (ids.length < 2) return [];
  const list = [...ids];
  if (list.length % 2 === 1) list.push("__bye__");
  const n = list.length;
  const rounds = n - 1;
  const matches: Match[] = [];
  const base = startDate ? new Date(startDate) : new Date();

  for (let r = 0; r < rounds; r++) {
    const day = new Date(base);
    day.setDate(base.getDate() + r * 7);
    for (let i = 0; i < n / 2; i++) {
      const a = list[i]!;
      const b = list[n - 1 - i]!;
      if (a === "__bye__" || b === "__bye__") continue;
      matches.push({
        id: uid(),
        round: r + 1,
        teamA: r % 2 === 0 ? a : b,
        teamB: r % 2 === 0 ? b : a,
        date: day.toISOString().slice(0, 10),
        time: `${String(15 + (i % 5)).padStart(2, "0")}:00`,
        venue: `${venue} ${i + 1}`,
        scoreA: 0,
        scoreB: 0,
        status: "programmata",
        events: [],
      });
    }
    list.splice(1, 0, list.pop()!);
  }
  return matches;
}

/* ---------------- 2 Gironi + Fase finale ---------------- */

/** Divide le squadre in 2 gironi equilibrati (totale / 2, sempre dinamico). */
export function splitGroups(teams: Team[]): Team[] {
  return teams.map((team, i) => ({ ...team, group: (i % 2 === 0 ? "A" : "B") as GroupId }));
}

export const teamsOfGroup = (t: Tournament, g: GroupId) => t.teams.filter((x) => x.group === g);

/** Calendario all'italiana separato per Girone A e Girone B. */
export function autoCalendarGroups(t: Tournament, venue: string): Match[] {
  const out: Match[] = [];
  (["A", "B"] as GroupId[]).forEach((g) => {
    const list = teamsOfGroup(t, g);
    autoCalendar(list, t.startDate, `${venue} ${g}`).forEach((m) => out.push({ ...m, group: g }));
  });
  return out;
}

export const groupPhaseMatches = (t: Tournament) => t.matches.filter((m) => !m.ko);
export const koMatches = (t: Tournament) => t.matches.filter((m) => m.ko);

/** La fase a gironi è finita quando ci sono partite e sono tutte concluse. */
export function groupPhaseDone(t: Tournament): boolean {
  const list = groupPhaseMatches(t);
  return list.length > 0 && list.every((m) => m.status === "finita");
}

/** Numero di turni a eliminazione diretta per 2*q qualificate. */
const koRounds = (q: number) => Math.round(Math.log2(q * 2));

/** Crea il tabellone: q qualificate per girone (1, 2, 4...). */
export function buildKnockout(
  t: Tournament,
  q: number,
  winPts: number,
  drawPts: number,
): Match[] {
  const a = standings(t, winPts, drawPts, "A").slice(0, q);
  const b = standings(t, winPts, drawPts, "B").slice(0, q);
  if (a.length < q || b.length < q) return [];

  const seeds: string[] = [];
  for (let i = 0; i < q; i++) {
    seeds.push(a[i]!.team.id);
    seeds.push(b[q - 1 - i]!.team.id);
  }

  const R = koRounds(q);
  const out: Match[] = [];
  const base = t.startDate ? new Date(t.startDate) : new Date();

  for (let r = 1; r <= R; r++) {
    const count = 2 ** (R - r);
    for (let i = 0; i < count; i++) {
      const day = new Date(base);
      day.setDate(base.getDate() + 30 + r * 3);
      out.push({
        id: uid(),
        round: 100 + r,
        teamA: r === 1 ? (seeds[i * 2] ?? "") : "",
        teamB: r === 1 ? (seeds[i * 2 + 1] ?? "") : "",
        date: day.toISOString().slice(0, 10),
        time: "18:00",
        venue: "",
        scoreA: 0,
        scoreB: 0,
        status: "programmata",
        events: [],
        ko: { round: r, index: i },
      });
    }
  }

  if (R >= 2) {
    const day = new Date(base);
    day.setDate(base.getDate() + 30 + R * 3);
    out.push({
      id: uid(),
      round: 100 + R,
      teamA: "",
      teamB: "",
      date: day.toISOString().slice(0, 10),
      time: "15:00",
      venue: "",
      scoreA: 0,
      scoreB: 0,
      status: "programmata",
      events: [],
      ko: { round: R, index: 1, kind: "third" },
    });
  }

  return syncKnockout(out);
}

/** Girone unico + fase eliminatoria: prime n della classifica, 1 vs n, 2 vs n-1... */
export function buildKnockoutSingle(
  t: Tournament,
  n: number,
  winPts: number,
  drawPts: number,
): Match[] {
  const rows = standings(t, winPts, drawPts).slice(0, n);
  if (rows.length < n || n < 2) return [];
  const seeds: string[] = [];
  for (let i = 0; i < n / 2; i++) {
    seeds.push(rows[i]!.team.id);
    seeds.push(rows[n - 1 - i]!.team.id);
  }
  const R = Math.round(Math.log2(n));
  const out: Match[] = [];
  const base = t.startDate ? new Date(t.startDate) : new Date();
  for (let r = 1; r <= R; r++) {
    const count = 2 ** (R - r);
    for (let i = 0; i < count; i++) {
      const day = new Date(base);
      day.setDate(base.getDate() + 30 + r * 3);
      out.push({
        id: uid(),
        round: 100 + r,
        teamA: r === 1 ? (seeds[i * 2] ?? "") : "",
        teamB: r === 1 ? (seeds[i * 2 + 1] ?? "") : "",
        date: day.toISOString().slice(0, 10),
        time: "18:00",
        venue: "",
        scoreA: 0,
        scoreB: 0,
        status: "programmata",
        events: [],
        ko: { round: r, index: i },
      });
    }
  }
  if (R >= 2) {
    const day = new Date(base);
    day.setDate(base.getDate() + 30 + R * 3);
    out.push({
      id: uid(),
      round: 100 + R,
      teamA: "",
      teamB: "",
      date: day.toISOString().slice(0, 10),
      time: "15:00",
      venue: "",
      scoreA: 0,
      scoreB: 0,
      status: "programmata",
      events: [],
      ko: { round: R, index: 1, kind: "third" },
    });
  }
  return syncKnockout(out);
}

/** Crea playoff Basket a 8 squadre: 1-8, 4-5, 2-7, 3-6. */
export function buildBasketPlayoffs(t: Tournament): Match[] {
  const seeds = standings(t, 2, 0).slice(0, 8).map((row) => row.team.id);
  if (seeds.length < 8) return [];
  const pairings = [[0, 7], [3, 4], [1, 6], [2, 5]];
  const out: Match[] = [];
  const base = t.startDate ? new Date(t.startDate) : new Date();
  for (let round = 1; round <= 3; round++) {
    const count = 2 ** (3 - round);
    for (let index = 0; index < count; index++) {
      const day = new Date(base);
      day.setDate(base.getDate() + 30 + round * 3);
      const pairing = pairings[index];
      out.push({
        id: uid(), round: 100 + round,
        teamA: round === 1 && pairing ? seeds[pairing[0]!] ?? "" : "",
        teamB: round === 1 && pairing ? seeds[pairing[1]!] ?? "" : "",
        date: day.toISOString().slice(0, 10), time: "18:00", venue: "",
        scoreA: 0, scoreB: 0, status: "programmata", events: [],
        ko: { round, index },
      });
    }
  }
  return syncKnockout(out);
}

const winnerOf = (m?: Match) =>
  m && m.status === "finita" && m.scoreA !== m.scoreB
    ? m.scoreA > m.scoreB
      ? m.teamA
      : m.teamB
    : "";
const loserOf = (m?: Match) =>
  m && m.status === "finita" && m.scoreA !== m.scoreB
    ? m.scoreA > m.scoreB
      ? m.teamB
      : m.teamA
    : "";

/** Propaga vincitori (e perdenti in finale 3°/4°) nei turni successivi. */
export function syncKnockout(matches: Match[]): Match[] {
  const ko = matches.filter((m) => m.ko);
  if (ko.length === 0) return matches;
  const R = Math.max(...ko.map((m) => m.ko!.round));
  const at = (r: number, i: number) =>
    ko.find((m) => m.ko!.round === r && m.ko!.index === i && m.ko!.kind !== "third");

  const next = matches.map((m) => {
    if (!m.ko) return m;
    const { round, index, kind } = m.ko;
    if (kind === "third") {
      const s1 = at(R - 1, 0);
      const s2 = at(R - 1, 1);
      return { ...m, teamA: loserOf(s1), teamB: loserOf(s2) };
    }
    if (round === 1) return m;
    const p1 = at(round - 1, index * 2);
    const p2 = at(round - 1, index * 2 + 1);
    return { ...m, teamA: winnerOf(p1), teamB: winnerOf(p2) };
  });
  return next;
}

export function koRoundLabelKey(round: number, total: number, kind?: "third"): string {
  if (kind === "third") return "final.third";
  const left = total - round;
  if (left === 0) return "final.final";
  if (left === 1) return "final.semis";
  if (left === 2) return "final.quarters";
  return "final.round16";
}
