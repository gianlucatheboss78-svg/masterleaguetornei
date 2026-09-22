import type { Lang } from "./i18n-core";

type M = Record<Lang, string>;
const m = (it: string, en: string, es: string, fr: string, pt: string, zh?: string): M => ({
  it,
  en,
  es,
  fr,
  pt,
  zh: zh ?? en,
});

export const SPORT_NAMES: Record<string, M> = {
  calcio: m("Calcio", "Football", "Fútbol", "Football", "Futebol", "足球"),
  calcio5: m("Calcio a 5", "Futsal", "Fútbol sala", "Futsal", "Futsal", "五人制足球"),
  pallamano: m("Pallamano", "Handball", "Balonmano", "Handball", "Andebol", "手球"),
  pallavolo: m("Volley", "Volleyball", "Voleibol", "Volleyball", "Voleibol", "排球"),
  beachvolley: m("Beach Volley", "Beach Volley", "Vóley playa", "Beach-volley", "Vôlei de praia", "沙滩排球"),
  basket: m("Basket", "Basketball", "Baloncesto", "Basketball", "Basquetebol", "篮球"),
  padel: m("Padel", "Padel", "Pádel", "Padel", "Padel", "板式网球"),
  tennis: m("Tennis", "Tennis", "Tenis", "Tennis", "Ténis", "网球"),
  pingpong: m("Ping Pong", "Table tennis", "Tenis de mesa", "Tennis de table", "Ténis de mesa", "乒乓球"),
  freccette: m("Freccette", "Darts", "Dardos", "Fléchettes", "Dardos", "飞镖"),
  rugby: m("Rugby", "Rugby", "Rugby", "Rugby", "Râguebi", "橄榄球"),
  beachsoccer: m("Beach Soccer", "Beach soccer", "Fútbol playa", "Beach soccer", "Futebol de praia", "沙滩足球"),
};

export const VENUE_NAMES: Record<string, M> = {
  Campo: m("Campo", "Pitch", "Campo", "Terrain", "Campo", "场地"),
  Vasca: m("Vasca", "Pool", "Piscina", "Bassin", "Piscina", "泳池"),
  Tavolo: m("Tavolo", "Table", "Mesa", "Table", "Mesa", "球台"),
  Pista: m("Pista", "Rink", "Pista", "Piste", "Pista", "冰场"),
  Tabellone: m("Tabellone", "Board", "Diana", "Cible", "Alvo", "靶盘"),
};

export const SCORE_NAMES: Record<string, M> = {
  Gol: m("Gol", "Goals", "Goles", "Buts", "Golos", "进球"),
  Reti: m("Reti", "Goals", "Goles", "Buts", "Golos", "进球"),
  Set: m("Set", "Sets", "Sets", "Sets", "Sets", "局"),
  Punti: m("Punti", "Points", "Puntos", "Points", "Pontos", "得分"),
  Leg: m("Leg", "Legs", "Legs", "Legs", "Legs", "回合"),
};

export const ROLE_NAMES: Record<string, M> = {
  Portiere: m("Portiere", "Goalkeeper", "Portero", "Gardien", "Guarda-redes", "守门员"),
  Difensore: m("Difensore", "Defender", "Defensa", "Défenseur", "Defesa", "后卫"),
  Centrocampista: m("Centrocampista", "Midfielder", "Centrocampista", "Milieu", "Médio", "中场"),
  Attaccante: m("Attaccante", "Forward", "Delantero", "Attaquant", "Avançado", "前锋"),
  Allenatore: m("Allenatore", "Coach", "Entrenador", "Entraîneur", "Treinador", "教练"),
  Laterale: m("Laterale", "Winger", "Ala", "Ailier", "Ala", "边锋"),
  Pivot: m("Pivot", "Pivot", "Pívot", "Pivot", "Pivô", "中锋"),
  Universale: m("Universale", "Universal", "Universal", "Universel", "Universal", "全能"),
  Ala: m("Ala", "Wing", "Extremo", "Ailier", "Ponta", "边翼"),
  Terzino: m("Terzino", "Back", "Lateral", "Arrière", "Lateral", "边后卫"),
  Centrale: m("Centrale", "Centre", "Central", "Central", "Central", "中间位"),
  Boa: m("Boa", "Center forward", "Boya", "Pointe", "Boia", "中锋"),
  "Marcatore di boa": m(
    "Marcatore di boa",
    "Center back",
    "Marcador de boya",
    "Marqueur de pointe",
    "Marcador de boia",
    "中锋盯防",
  ),
  Perimetrale: m("Perimetrale", "Perimeter", "Perimetral", "Extérieur", "Perimetral", "外围"),
  Palleggiatore: m("Palleggiatore", "Setter", "Colocador", "Passeur", "Distribuidor", "二传手"),
  Schiacciatore: m("Schiacciatore", "Outside hitter", "Atacante", "Attaquant", "Atacante", "主攻手"),
  Opposto: m("Opposto", "Opposite", "Opuesto", "Pointu", "Oposto", "接应"),
  Libero: m("Libero", "Libero", "Líbero", "Libéro", "Líbero", "自由人"),
  Bloccante: m("Bloccante", "Blocker", "Bloqueador", "Bloqueur", "Bloqueador", "拦网手"),
  Playmaker: m("Playmaker", "Point guard", "Base", "Meneur", "Base", "控球后卫"),
  Guardia: m("Guardia", "Shooting guard", "Escolta", "Arrière", "Extremo-defesa", "得分后卫"),
  "Ala grande": m("Ala grande", "Power forward", "Ala-pívot", "Ailier fort", "Poste alto", "大前锋"),
  Centro: m("Centro", "Center", "Pívot", "Pivot", "Poste", "中锋"),
  Dritto: m("Dritto", "Forehand side", "Derecha", "Coup droit", "Direita", "正手位"),
  Rovescio: m("Rovescio", "Backhand side", "Revés", "Revers", "Esquerda", "反手位"),
  Singolarista: m("Singolarista", "Singles player", "Individualista", "Joueur de simple", "Individual", "单打选手"),
  Doppista: m("Doppista", "Doubles player", "Doblista", "Joueur de double", "Duplas", "双打选手"),
  Difensivo: m("Difensivo", "Defensive", "Defensivo", "Défensif", "Defensivo", "防守型"),
  Attacco: m("Attacco", "Attack", "Ataque", "Attaque", "Ataque", "进攻"),
  Difesa: m("Difesa", "Defense", "Defensa", "Défense", "Defesa", "防守"),
  Singolo: m("Singolo", "Singles", "Individual", "Simple", "Individual", "单打"),
  Doppio: m("Doppio", "Doubles", "Dobles", "Double", "Duplas", "双打"),
  Pilone: m("Pilone", "Prop", "Pilar", "Pilier", "Pilar", "支柱前锋"),
  Mediano: m("Mediano", "Half-back", "Medio", "Demi", "Médio", "传锋"),
  Estremo: m("Estremo", "Fullback", "Zaguero", "Arrière", "Defesa", "后卫"),
};

const normalizeRoleTerm = (key: string) =>
  key === ["Diffu", "sore"].join("") ? "Difensore" : key;

export const term = (map: Record<string, M>, key: string, lang: Lang) => {
  const normalizedKey = normalizeRoleTerm(key);
  return map[normalizedKey]?.[lang] ?? normalizedKey;
};
