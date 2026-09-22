import type { Lang } from "./i18n-core";

type M = Record<Lang, string>;
const m = (it: string, en: string, es: string, fr: string, pt: string): M => ({ it, en, es, fr, pt });

export const SPORT_NAMES: Record<string, M> = {
  calcio: m("Calcio", "Football", "Fútbol", "Football", "Futebol"),
  calcio5: m("Calcio a 5", "Futsal", "Fútbol sala", "Futsal", "Futsal"),
  pallamano: m("Pallamano", "Handball", "Balonmano", "Handball", "Andebol"),
  pallanuoto: m("Pallanuoto", "Water polo", "Waterpolo", "Water-polo", "Polo aquático"),
  pallavolo: m("Pallavolo", "Volleyball", "Voleibol", "Volleyball", "Voleibol"),
  beachvolley: m("Beach Volley", "Beach Volley", "Vóley playa", "Beach-volley", "Vôlei de praia"),
  basket: m("Basket", "Basketball", "Baloncesto", "Basketball", "Basquetebol"),
  padel: m("Padel", "Padel", "Pádel", "Padel", "Padel"),
  tennis: m("Tennis", "Tennis", "Tenis", "Tennis", "Ténis"),
  pingpong: m("Ping Pong", "Table tennis", "Tenis de mesa", "Tennis de table", "Ténis de mesa"),
  biliardino: m("Biliardino", "Foosball", "Futbolín", "Baby-foot", "Matraquilhos"),
  freccette: m("Freccette", "Darts", "Dardos", "Fléchettes", "Dardos"),
  rugby: m("Rugby", "Rugby", "Rugby", "Rugby", "Râguebi"),
  hockey: m("Hockey", "Hockey", "Hockey", "Hockey", "Hóquei"),
  beachsoccer: m("Beach Soccer", "Beach soccer", "Fútbol playa", "Beach soccer", "Futebol de praia"),
};

export const VENUE_NAMES: Record<string, M> = {
  Campo: m("Campo", "Pitch", "Campo", "Terrain", "Campo"),
  Vasca: m("Vasca", "Pool", "Piscina", "Bassin", "Piscina"),
  Tavolo: m("Tavolo", "Table", "Mesa", "Table", "Mesa"),
  Pista: m("Pista", "Rink", "Pista", "Piste", "Pista"),
  Tabellone: m("Tabellone", "Board", "Diana", "Cible", "Alvo"),
};

export const SCORE_NAMES: Record<string, M> = {
  Gol: m("Gol", "Goals", "Goles", "Buts", "Golos"),
  Reti: m("Reti", "Goals", "Goles", "Buts", "Golos"),
  Set: m("Set", "Sets", "Sets", "Sets", "Sets"),
  Punti: m("Punti", "Points", "Puntos", "Points", "Pontos"),
  Leg: m("Leg", "Legs", "Legs", "Legs", "Legs"),
};

export const ROLE_NAMES: Record<string, M> = {
  Portiere: m("Portiere", "Goalkeeper", "Portero", "Gardien", "Guarda-redes"),
  Difensore: m("Difensore", "Defender", "Defensa", "Défenseur", "Defesa"),
  Centrocampista: m("Centrocampista", "Midfielder", "Centrocampista", "Milieu", "Médio"),
  Attaccante: m("Attaccante", "Forward", "Delantero", "Attaquant", "Avançado"),
  Allenatore: m("Allenatore", "Coach", "Entrenador", "Entraîneur", "Treinador"),
  Laterale: m("Laterale", "Winger", "Ala", "Ailier", "Ala"),
  Pivot: m("Pivot", "Pivot", "Pívot", "Pivot", "Pivô"),
  Universale: m("Universale", "Universal", "Universal", "Universel", "Universal"),
  Ala: m("Ala", "Wing", "Extremo", "Ailier", "Ponta"),
  Terzino: m("Terzino", "Back", "Lateral", "Arrière", "Lateral"),
  Centrale: m("Centrale", "Centre", "Central", "Central", "Central"),
  Boa: m("Boa", "Center forward", "Boya", "Pointe", "Boia"),
  "Marcatore di boa": m("Marcatore di boa", "Center back", "Marcador de boya", "Marqueur de pointe", "Marcador de boia"),
  Perimetrale: m("Perimetrale", "Perimeter", "Perimetral", "Extérieur", "Perimetral"),
  Palleggiatore: m("Palleggiatore", "Setter", "Colocador", "Passeur", "Distribuidor"),
  Schiacciatore: m("Schiacciatore", "Outside hitter", "Atacante", "Attaquant", "Atacante"),
  Opposto: m("Opposto", "Opposite", "Opuesto", "Pointu", "Oposto"),
  Libero: m("Libero", "Libero", "Líbero", "Libéro", "Líbero"),
  Bloccante: m("Bloccante", "Blocker", "Bloqueador", "Bloqueur", "Bloqueador"),
  Playmaker: m("Playmaker", "Point guard", "Base", "Meneur", "Base"),
  Guardia: m("Guardia", "Shooting guard", "Escolta", "Arrière", "Extremo-defesa"),
  "Ala grande": m("Ala grande", "Power forward", "Ala-pívot", "Ailier fort", "Poste alto"),
  Centro: m("Centro", "Center", "Pívot", "Pivot", "Poste"),
  Dritto: m("Dritto", "Forehand side", "Derecha", "Coup droit", "Direita"),
  Rovescio: m("Rovescio", "Backhand side", "Revés", "Revers", "Esquerda"),
  Singolarista: m("Singolarista", "Singles player", "Individualista", "Joueur de simple", "Individual"),
  Doppista: m("Doppista", "Doubles player", "Doblista", "Joueur de double", "Duplas"),
  Difensivo: m("Difensivo", "Defensive", "Defensivo", "Défensif", "Defensivo"),
  Attacco: m("Attacco", "Attack", "Ataque", "Attaque", "Ataque"),
  Difesa: m("Difesa", "Defense", "Defensa", "Défense", "Defesa"),
  Singolo: m("Singolo", "Singles", "Individual", "Simple", "Individual"),
  Doppio: m("Doppio", "Doubles", "Dobles", "Double", "Duplas"),
  Pilone: m("Pilone", "Prop", "Pilar", "Pilier", "Pilar"),
  Mediano: m("Mediano", "Half-back", "Medio", "Demi", "Médio"),
  Estremo: m("Estremo", "Fullback", "Zaguero", "Arrière", "Defesa"),
};

export const term = (map: Record<string, M>, key: string, lang: Lang) =>
  map[key]?.[lang] ?? key;
