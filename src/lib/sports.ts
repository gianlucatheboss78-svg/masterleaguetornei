export type Sport = {
  id: string;
  name: string;
  icon: string;
  venue: string; // campo / vasca / tavolo / pista
  roles: { id: string; name: string; icon: string }[];
  scoreLabel: string;
  winPoints: number;
  drawPoints: number;
  hasDraw: boolean;
};

export const SPORTS: Sport[] = [
  {
    id: "calcio",
    name: "Calcio",
    icon: "⚽",
    venue: "Campo",
    scoreLabel: "Gol",
    winPoints: 3,
    drawPoints: 1,
    hasDraw: true,
    roles: [
      { id: "por", name: "Portiere", icon: "🧤" },
      { id: "dif", name: "Difensore", icon: "🛡️" },
      { id: "cen", name: "Centrocampista", icon: "🎯" },
      { id: "att", name: "Attaccante", icon: "🔥" },
      { id: "all", name: "Allenatore", icon: "📋" },
    ],
  },
  {
    id: "pallamano",
    name: "Pallamano",
    icon: "🤾",
    venue: "Campo",
    scoreLabel: "Reti",
    winPoints: 2,
    drawPoints: 1,
    hasDraw: true,
    roles: [
      { id: "por", name: "Portiere", icon: "🧤" },
      { id: "ala", name: "Ala", icon: "🪽" },
      { id: "ter", name: "Terzino", icon: "🛡️" },
      { id: "cen", name: "Centrale", icon: "🎯" },
      { id: "piv", name: "Pivot", icon: "💪" },
    ],
  },
  {
    id: "pallanuoto",
    name: "Pallanuoto",
    icon: "🤽",
    venue: "Vasca",
    scoreLabel: "Reti",
    winPoints: 3,
    drawPoints: 1,
    hasDraw: true,
    roles: [
      { id: "por", name: "Portiere", icon: "🧤" },
      { id: "bor", name: "Boa", icon: "🎈" },
      { id: "mar", name: "Marcatore di boa", icon: "🛡️" },
      { id: "per", name: "Perimetrale", icon: "🌊" },
    ],
  },
  {
    id: "pallavolo",
    name: "Pallavolo",
    icon: "🏐",
    venue: "Campo",
    scoreLabel: "Set",
    winPoints: 3,
    drawPoints: 0,
    hasDraw: false,
    roles: [
      { id: "pal", name: "Palleggiatore", icon: "🙌" },
      { id: "sch", name: "Schiacciatore", icon: "💥" },
      { id: "cen", name: "Centrale", icon: "🧱" },
      { id: "opp", name: "Opposto", icon: "🔥" },
      { id: "lib", name: "Libero", icon: "🦺" },
    ],
  },
  {
    id: "beachvolley",
    name: "Beach Volley",
    icon: "🏖️",
    venue: "Campo",
    scoreLabel: "Set",
    winPoints: 3,
    drawPoints: 0,
    hasDraw: false,
    roles: [
      { id: "dif", name: "Difensore", icon: "🛡️" },
      { id: "blo", name: "Bloccante", icon: "🧱" },
    ],
  },
  {
    id: "basket",
    name: "Basket",
    icon: "🏀",
    venue: "Campo",
    scoreLabel: "Punti",
    winPoints: 2,
    drawPoints: 0,
    hasDraw: false,
    roles: [
      { id: "play", name: "Playmaker", icon: "🧠" },
      { id: "guar", name: "Guardia", icon: "🎯" },
      { id: "ala", name: "Ala", icon: "🪽" },
      { id: "alag", name: "Ala grande", icon: "💪" },
      { id: "cen", name: "Centro", icon: "🗼" },
    ],
  },
  {
    id: "padel",
    name: "Padel",
    icon: "🎾",
    venue: "Campo",
    scoreLabel: "Set",
    winPoints: 2,
    drawPoints: 0,
    hasDraw: false,
    roles: [
      { id: "dx", name: "Dritto", icon: "➡️" },
      { id: "sx", name: "Rovescio", icon: "⬅️" },
    ],
  },
  {
    id: "tennis",
    name: "Tennis",
    icon: "🎾",
    venue: "Campo",
    scoreLabel: "Set",
    winPoints: 2,
    drawPoints: 0,
    hasDraw: false,
    roles: [
      { id: "sin", name: "Singolarista", icon: "🎯" },
      { id: "dop", name: "Doppista", icon: "👥" },
    ],
  },
  {
    id: "pingpong",
    name: "Ping Pong",
    icon: "🏓",
    venue: "Tavolo",
    scoreLabel: "Set",
    winPoints: 2,
    drawPoints: 0,
    hasDraw: false,
    roles: [
      { id: "att", name: "Attaccante", icon: "💥" },
      { id: "dif", name: "Difensivo", icon: "🛡️" },
    ],
  },
  {
    id: "biliardino",
    name: "Biliardino",
    icon: "⚽",
    venue: "Tavolo",
    scoreLabel: "Gol",
    winPoints: 3,
    drawPoints: 1,
    hasDraw: true,
    roles: [
      { id: "att", name: "Attacco", icon: "🔥" },
      { id: "dif", name: "Difesa", icon: "🛡️" },
      { id: "sin", name: "Singolo", icon: "🙋" },
    ],
  },
  {
    id: "freccette",
    name: "Freccette",
    icon: "🎯",
    venue: "Tabellone",
    scoreLabel: "Leg",
    winPoints: 2,
    drawPoints: 0,
    hasDraw: false,
    roles: [
      { id: "sin", name: "Singolo", icon: "🎯" },
      { id: "dop", name: "Doppio", icon: "👥" },
    ],
  },
  {
    id: "rugby",
    name: "Rugby",
    icon: "🏉",
    venue: "Campo",
    scoreLabel: "Punti",
    winPoints: 4,
    drawPoints: 2,
    hasDraw: true,
    roles: [
      { id: "pil", name: "Pilone", icon: "🧱" },
      { id: "med", name: "Mediano", icon: "🧠" },
      { id: "cen", name: "Centro", icon: "🎯" },
      { id: "ala", name: "Ala", icon: "💨" },
      { id: "est", name: "Estremo", icon: "🛡️" },
    ],
  },
  {
    id: "hockey",
    name: "Hockey",
    icon: "🏒",
    venue: "Pista",
    scoreLabel: "Gol",
    winPoints: 3,
    drawPoints: 1,
    hasDraw: true,
    roles: [
      { id: "por", name: "Portiere", icon: "🧤" },
      { id: "dif", name: "Difensore", icon: "🛡️" },
      { id: "att", name: "Attaccante", icon: "🔥" },
    ],
  },
  {
    id: "beachsoccer",
    name: "Beach Soccer",
    icon: "🏝️",
    venue: "Campo",
    scoreLabel: "Gol",
    winPoints: 3,
    drawPoints: 1,
    hasDraw: true,
    roles: [
      { id: "por", name: "Portiere", icon: "🧤" },
      { id: "dif", name: "Difensore", icon: "🛡️" },
      { id: "ala", name: "Ala", icon: "🪽" },
      { id: "pivot", name: "Pivot", icon: "🔥" },
    ],
  },
];

export const getSport = (id: string): Sport =>
  SPORTS.find((s) => s.id === id) ?? SPORTS[0]!;

/** Varianti del calcio: un'unica disciplina "Calcio" con formati diversi. */
export const FOOTBALL_VARIANTS = [
  { id: "a5", label: "A5", players: 5 },
  { id: "a6", label: "A6", players: 6 },
  { id: "a7", label: "A7", players: 7 },
  { id: "a8", label: "A8", players: 8 },
  { id: "a11", label: "A11", players: 11 },
] as const;

export const isFootball = (sportId: string) => sportId === "calcio" || sportId === "calcio5";

export const variantLabel = (variant?: string) =>
  FOOTBALL_VARIANTS.find((v) => v.id === variant)?.label ?? "";
