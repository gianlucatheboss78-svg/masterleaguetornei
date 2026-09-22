export type VolleySet = { a: number; b: number };
export type VolleyState = { sets: VolleySet[]; pointsA: number; pointsB: number; done?: boolean };

export const isVolley = (sportId: string) => sportId === "pallavolo" || sportId === "beachvolley";
export const isBeachVolley = (sportId: string) => sportId === "beachvolley";
export const volleyRosterLimit = (sportId: string) => isBeachVolley(sportId) ? 2 : sportId === "pallavolo" ? 6 : undefined;
export const emptyVolley = (): VolleyState => ({ sets: [], pointsA: 0, pointsB: 0, done: false });

export const volleySetsWon = (state: VolleyState) => state.sets.reduce(
  (wins, set) => ({ a: wins.a + Number(set.a > set.b), b: wins.b + Number(set.b > set.a) }),
  { a: 0, b: 0 },
);

export const volleyPointsTotal = (state: VolleyState) => state.sets.reduce(
  (points, set) => ({ a: points.a + set.a, b: points.b + set.b }),
  { a: state.pointsA, b: state.pointsB },
);

export function addVolleyPoint(state: VolleyState, side: "a" | "b", beach: boolean): VolleyState {
  if (state.done) return state;
  const pointsA = state.pointsA + Number(side === "a");
  const pointsB = state.pointsB + Number(side === "b");
  const decidingSet = state.sets.length === (beach ? 2 : 4);
  const target = decidingSet ? 15 : beach ? 21 : 25;
  const setDone = Math.max(pointsA, pointsB) >= target && Math.abs(pointsA - pointsB) >= 2;
  if (!setDone) return { ...state, pointsA, pointsB };
  const sets = [...state.sets, { a: pointsA, b: pointsB }];
  const wins = volleySetsWon({ sets, pointsA: 0, pointsB: 0 });
  const done = wins.a === (beach ? 2 : 3) || wins.b === (beach ? 2 : 3);
  return { sets, pointsA: 0, pointsB: 0, done };
}