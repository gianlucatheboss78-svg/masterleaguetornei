export type Sport = {
  id: string; name: string; icon: string; venue: string;
  roles: { id: string; name: string; icon: string }[];
  scoreLabel: string; winPoints: number; drawPoints: number; hasDraw: boolean;
};
export const SPORTS: Sport[] = [
  { id: "calcio", name: "Calcio", icon: "⚽", venue: "Campo", scoreLabel: "Gol", winPoints: 3, drawPoints: 1, hasDraw: true, roles: [{ id: "por", name: "Portiere", icon: "🧤" }, { id: "dif", name: "Difensore", icon: "🛡️" }, { id: "cen", name: "Centrocampista", icon: "⚙️" }, { id: "att", name: "Attaccante", icon: "🎯" }, { id: "all", name: "Allenatore", icon: "📋" }] },
  { id: "calcetto", name: "Calcetto", icon: "🥅", venue: "Campo C5", scoreLabel: "Gol", winPoints: 3, drawPoints: 1, hasDraw: true, roles: [{ id: "por", name: "Portiere", icon: "🧤" }, { id: "uni", name: "Universale", icon: "⭐" }] },
  { id: "padel", name: "Padel", icon: "🎾", venue: "Campo Padel", scoreLabel: "Punti", winPoints: 3, drawPoints: 0, hasDraw: false, roles: [{ id: "gioc", name: "Giocatore", icon: "🎾" }] },
  { id: "basket", name: "Basket", icon: "🏀", venue: "Palazzetto", scoreLabel: "Canestri", winPoints: 2, drawPoints: 0, hasDraw: false, roles: [{ id: "play", name: "Playmaker", icon: "🧠" }, { id: "guard", name: "Guardia", icon: "🎯" }, { id: "ala", name: "Ala", icon: "🦅" }, { id: "centro", name: "Centro", icon: "🏔️" }] },
  { id: "volley", name: "Volley", icon: "🏐", venue: "Palazzetto", scoreLabel: "Set", winPoints: 3, drawPoints: 0, hasDraw: false, roles: [{ id: "pal", name: "Palleggiatore", icon: "🤲" }, { id: "sch", name: "Schiacciatore", icon: "💥" }, { id: "lib", name: "Libero", icon: "🛡️" }] },
  { id: "tennis", name: "Tennis", icon: "🎾", venue: "Campo Tennis", scoreLabel: "Game", winPoints: 3, drawPoints: 0, hasDraw: false, roles: [{ id: "sing", name: "Singolo", icon: "🎾" }] },
  { id: "beachvolley", name: "Beach Volley", icon: "🏖️", venue: "Spiaggia", scoreLabel: "Set", winPoints: 3, drawPoints: 0, hasDraw: false, roles: [{ id: "gioc", name: "Giocatore", icon: "🏖️" }] },
  { id: "futsal", name: "Futsal", icon: "⚽", venue: "Palazzetto", scoreLabel: "Gol", winPoints: 3, drawPoints: 1, hasDraw: true, roles: [{ id: "por", name: "Portiere", icon: "🧤" }, { id: "dif", name: "Difensore", icon: "🛡️" }, { id: "att", name: "Pivot", icon: "🎯" }] },
  { id: "rugby", name: "Rugby", icon: "🏉", venue: "Campo Rugby", scoreLabel: "Mete", winPoints: 4, drawPoints: 2, hasDraw: true, roles: [{ id: "ava", name: "Avanti", icon: "💪" }, { id: "tre", name: "Trequarti", icon: "🏃" }] },
  { id: "pallamano", name: "Pallamano", icon: "🤾", venue: "Palazzetto", scoreLabel: "Gol", winPoints: 2, drawPoints: 1, hasDraw: true, roles: [{ id: "por", name: "Portiere", icon: "🧤" }, { id: "ala", name: "Ala", icon: "🦅" }, { id: "centr", name: "Centrale", icon: "🧠" }] },
  { id: "hockey", name: "Hockey", icon: "🏑", venue: "Pista", scoreLabel: "Gol", winPoints: 3, drawPoints: 1, hasDraw: true, roles: [{ id: "por", name: "Portiere", icon: "🧤" }, { id: "dif", name: "Difensore", icon: "🛡️" }, { id: "att", name: "Attaccante", icon: "🎯" }] },
];
export const FOOTBALL_VARIANTS = [
  { id: "a5", label: "A5", players: 5 },
  { id: "a6", label: "A6", players: 6 },
  { id: "a7", label: "A7", players: 7 },
  { id: "a8", label: "A8", players: 8 },
  { id: "a11", label: "A11", players: 11 },
] as const;
export const isFootball = (id: string) => id === "calcio" || id === "calcetto" || id === "futsal";
export const variantLabel = (id?: string) => FOOTBALL_VARIANTS.find((variant) => variant.id === id)?.label ?? "";
const DEFAULT_SPORT: Sport = { id: "calcio", name: "Calcio", icon: "⚽", venue: "Campo", scoreLabel: "Gol", winPoints: 3, drawPoints: 1, hasDraw: true, roles: [{ id: "por", name: "Portiere", icon: "🧤" }, { id: "dif", name: "Difensore", icon: "🛡️" }, { id: "cen", name: "Centrocampista", icon: "⚙️" }, { id: "att", name: "Attaccante", icon: "🎯" }] };
export const getSport = (id?: string): Sport => SPORTS.find((sport) => sport.id === id) ?? DEFAULT_SPORT;
