export type Sport = {
  id: string; name: string; icon: string; venue: string;
  roles: { id: string; name: string; icon: string }[];
  scoreLabel: string; winPoints: number; drawPoints: number; hasDraw: boolean;
};
export const SPORTS: Sport[] = [
  { id: "calcio", name: "Calcio", icon: "⚽", venue: "Campo", scoreLabel: "Gol", winPoints: 3, drawPoints: 1, hasDraw: true, roles: [{ id: "por", name: "Portiere", icon: "🧤" }, { id: "dif", name: "Difensore", icon: "🛡️" }, { id: "cen", name: "Centrocampista", icon: "⚙️" }, { id: "att", name: "Attaccante", icon: "🎯" }, { id: "all", name: "Allenatore", icon: "📋" }] },
  { id: "padel", name: "Padel", icon: "🎾", venue: "Campo Padel", scoreLabel: "Punti", winPoints: 3, drawPoints: 0, hasDraw: false, roles: [{ id: "gioc", name: "Giocatore", icon: "🎾" }] },
  { id: "basket", name: "Basket", icon: "🏀", venue: "Palazzetto", scoreLabel: "Canestri", winPoints: 2, drawPoints: 0, hasDraw: false, roles: [{ id: "play", name: "Playmaker", icon: "🧠" }, { id: "guard", name: "Guardia", icon: "🎯" }, { id: "ala", name: "Ala", icon: "🦅" }, { id: "centro", name: "Centro", icon: "🏔️" }] },
  { id: "volley", name: "Pallavolo", icon: "🏐", venue: "Palazzetto", scoreLabel: "Set", winPoints: 3, drawPoints: 0, hasDraw: false, roles: [{ id: "pal", name: "Palleggiatore", icon: "🤲" }, { id: "sch", name: "Schiacciatore", icon: "💥" }, { id: "lib", name: "Libero", icon: "🛡️" }] },
  { id: "tennis", name: "Tennis", icon: "🎾", venue: "Campo Tennis", scoreLabel: "Game", winPoints: 3, drawPoints: 0, hasDraw: false, roles: [{ id: "sing", name: "Singolo", icon: "🎾" }] },
  { id: "beachvolley", name: "Beach Volley", icon: "🏖️", venue: "Spiaggia", scoreLabel: "Set", winPoints: 3, drawPoints: 0, hasDraw: false, roles: [{ id: "gioc", name: "Giocatore", icon: "🏖️" }] },
];
export const FOOTBALL_VARIANTS = [
  { id: "a11", label: "A11", players: 11 },
  { id: "a8", label: "A8", players: 8 },
  { id: "a7", label: "A7", players: 7 },
  { id: "a6", label: "A6", players: 6 },
  { id: "futsal", label: "Futsal", players: 5 },
] as const;
export const isFootball = (id: string) => id === "calcio" || id === "calcetto" || id === "futsal";
export const variantLabel = (id?: string) => FOOTBALL_VARIANTS.find((variant) => variant.id === id)?.label ?? "";
const DEFAULT_SPORT: Sport = { id: "calcio", name: "Calcio", icon: "⚽", venue: "Campo", scoreLabel: "Gol", winPoints: 3, drawPoints: 1, hasDraw: true, roles: [{ id: "por", name: "Portiere", icon: "🧤" }, { id: "dif", name: "Difensore", icon: "🛡️" }, { id: "cen", name: "Centrocampista", icon: "⚙️" }, { id: "att", name: "Attaccante", icon: "🎯" }] };
export const getSport = (id?: string): Sport => SPORTS.find((sport) => sport.id === id) ?? DEFAULT_SPORT;
