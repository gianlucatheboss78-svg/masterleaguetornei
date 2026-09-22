import { useCallback, useEffect, useState } from "react";

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

export type MatchEvent = {
  id: string;
  playerId: string;
  teamId: string;
  type: "goal" | "yellow" | "red" | "mvp";
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
};

export type TournamentFormat = "single" | "groups";

export type Tournament = {
  id: string;
  name: string;
  sport: string;
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

export const uid = () => Math.random().toString(36).slice(2, 10);

function read(): Tournament[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "[]") as Tournament[];
  } catch {
    return [];
  }
}

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function saveAll(data: Tournament[]) {
  window.localStorage.setItem(KEY, JSON.stringify(data));
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
    return () => {
      listeners.delete(sync);
    };
  }, []);

  const update = useCallback((fn: (list: Tournament[]) => Tournament[]) => {
    saveAll(fn(read()));
  }, []);

  return { data, ready, update };
}

export function useTournament(id: string) {
  const { data, ready, update } = useTournaments();
  const tournament = data.find((t) => t.id === id) ?? null;
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
      a.gf += m.scoreA; a.gs += m.scoreB;
      b.gf += m.scoreB; b.gs += m.scoreA;
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
      if (e.type === "goal") cur.goals++;
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
