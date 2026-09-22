/** Punteggio tennis/padel: 15-30-40, set a 6 game, tie-break a 7. */

export type TennisSet = { a: number; b: number; tbA?: number; tbB?: number };
export type TennisState = { sets: TennisSet[]; pA: number; pB: number; done?: boolean };

export const isRacket = (sportId: string) => sportId === "tennis" || sportId === "padel";

export const BEST_OF = 3;
const NEEDED = Math.ceil(BEST_OF / 2);
const POINTS = ["0", "15", "30", "40"];

export const emptyTennis = (): TennisState => ({ sets: [{ a: 0, b: 0 }], pA: 0, pB: 0 });

export const setClosed = (s: TennisSet) =>
  (s.a >= 6 && s.a - s.b >= 2) || (s.b >= 6 && s.b - s.a >= 2) || s.a === 7 || s.b === 7;

export const setsWon = (st: TennisState) => {
  let a = 0;
  let b = 0;
  st.sets.forEach((s) => {
    if (!setClosed(s)) return;
    if (s.a > s.b) a++;
    else b++;
  });
  return { a, b };
};

export const gamesTotal = (st: TennisState) =>
  st.sets.reduce((acc, s) => ({ a: acc.a + s.a, b: acc.b + s.b }), { a: 0, b: 0 });

export const inTieBreak = (st: TennisState) => {
  const cur = st.sets[st.sets.length - 1];
  return !!cur && cur.a === 6 && cur.b === 6;
};

/** Etichette del game in corso (15/30/40/AV oppure punti del tie-break). */
export function pointLabels(st: TennisState): [string, string] {
  if (inTieBreak(st)) return [String(st.pA), String(st.pB)];
  if (st.pA >= 3 && st.pB >= 3) {
    if (st.pA === st.pB) return ["40", "40"];
    return st.pA > st.pB ? ["AV", "40"] : ["40", "AV"];
  }
  return [POINTS[Math.min(st.pA, 3)]!, POINTS[Math.min(st.pB, 3)]!];
}

/** Aggiunge un punto al lato indicato e aggiorna game, set e fine partita. */
export function addPoint(state: TennisState, side: "a" | "b"): TennisState {
  const st: TennisState = {
    sets: state.sets.map((s) => ({ ...s })),
    pA: state.pA,
    pB: state.pB,
    done: state.done,
  };
  if (st.done) return st;
  if (st.sets.length === 0) st.sets.push({ a: 0, b: 0 });
  const cur = st.sets[st.sets.length - 1]!;
  const tie = cur.a === 6 && cur.b === 6;

  if (side === "a") st.pA++;
  else st.pB++;

  const target = tie ? 7 : 4;
  const hi = side === "a" ? st.pA : st.pB;
  const lo = side === "a" ? st.pB : st.pA;
  if (hi < target || hi - lo < 2) return st;

  if (tie) {
    cur.tbA = st.pA;
    cur.tbB = st.pB;
  }
  if (side === "a") cur.a++;
  else cur.b++;
  st.pA = 0;
  st.pB = 0;

  if (setClosed(cur)) {
    const won = setsWon(st);
    if (won.a >= NEEDED || won.b >= NEEDED) st.done = true;
    else st.sets.push({ a: 0, b: 0 });
  }
  return st;
}

export const setsLine = (st: TennisState) =>
  st.sets
    .map((s) => (s.tbA !== undefined ? `${s.a}-${s.b}(${Math.min(s.tbA, s.tbB ?? 0)})` : `${s.a}-${s.b}`))
    .join("  ");
