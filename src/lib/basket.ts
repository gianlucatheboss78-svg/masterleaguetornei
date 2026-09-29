export type BasketFoul = {
  id: string;
  playerId: string;
  teamId: string;
  period: number;
};

export type BasketState = {
  period: number;
  clockSeconds: number;
  running: boolean;
  fouls: BasketFoul[];
  /** FIBA 3x3 fields; absent on legacy 5x5 matches. */
  shotClockSeconds?: number;
  overtime?: boolean;
  overtimeStartA?: number;
  overtimeStartB?: number;
};

export const isBasket = (sportId: string) => sportId === "basket";

export const emptyBasket = (): BasketState => ({
  period: 1,
  clockSeconds: 10 * 60,
  running: false,
  fouls: [],
});

export const emptyBasket3x3 = (): BasketState => ({
  period: 1,
  clockSeconds: 10 * 60,
  shotClockSeconds: 12,
  running: false,
  fouls: [],
  overtime: false,
});

export const isBasket3x3 = (mode?: string) => mode === "3x3";

export const basketRosterLimit = (mode?: string) => isBasket3x3(mode) ? 4 : undefined;

export function isBasket3x3Finished(state: BasketState, scoreA: number, scoreB: number) {
  if (state.overtime) {
    const startA = state.overtimeStartA ?? scoreA;
    const startB = state.overtimeStartB ?? scoreB;
    return scoreA - startA >= 2 || scoreB - startB >= 2;
  }
  return scoreA >= 21 || scoreB >= 21 || (state.clockSeconds === 0 && scoreA !== scoreB);
}

export const periodSeconds = (period: number) => (period > 4 ? 5 * 60 : 10 * 60);

export const formatBasketClock = (seconds: number) => {
  const safe = Math.max(0, seconds);
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, "0")}`;
};

export const playerFouls = (state: BasketState, playerId: string) =>
  state.fouls.filter((foul) => foul.playerId === playerId).length;

export const teamPeriodFouls = (state: BasketState, teamId: string) =>
  state.fouls.filter((foul) => foul.teamId === teamId && foul.period === state.period).length;