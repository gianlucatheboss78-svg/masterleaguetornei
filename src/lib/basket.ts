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
};

export const isBasket = (sportId: string) => sportId === "basket";

export const emptyBasket = (): BasketState => ({
  period: 1,
  clockSeconds: 10 * 60,
  running: false,
  fouls: [],
});

export const periodSeconds = (period: number) => (period > 4 ? 5 * 60 : 10 * 60);

export const formatBasketClock = (seconds: number) => {
  const safe = Math.max(0, seconds);
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, "0")}`;
};

export const playerFouls = (state: BasketState, playerId: string) =>
  state.fouls.filter((foul) => foul.playerId === playerId).length;

export const teamPeriodFouls = (state: BasketState, teamId: string) =>
  state.fouls.filter((foul) => foul.teamId === teamId && foul.period === state.period).length;