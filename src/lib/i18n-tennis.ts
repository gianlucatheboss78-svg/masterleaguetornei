import type { Lang } from "./i18n-core";

type Dict = Record<string, string>;

/** Chiavi del punteggio Tennis / Padel. */
export const TENNIS_DICTS: Record<Lang, Dict> = {
  it: {
    "tn.game": "Game in corso",
    "tn.tiebreak": "Tie-break (a 7)",
    "tn.set": "Set",
    "tn.pointHome": "Punto casa",
    "tn.pointAway": "Punto ospite",
    "tn.reset": "Azzera punteggio partita",
    "tn.rules": "15-30-40 · set a 6 game · tie-break a 7 · al meglio dei 3 set",
    "tn.tableHint": "Classifica: vittorie e differenza game",
  },
  en: {
    "tn.game": "Current game",
    "tn.tiebreak": "Tie-break (to 7)",
    "tn.set": "Set",
    "tn.pointHome": "Home point",
    "tn.pointAway": "Away point",
    "tn.reset": "Reset match score",
    "tn.rules": "15-30-40 · sets to 6 games · tie-break to 7 · best of 3 sets",
    "tn.tableHint": "Standings: wins and game difference",
  },
  es: {
    "tn.game": "Juego en curso",
    "tn.tiebreak": "Tie-break (a 7)",
    "tn.set": "Set",
    "tn.pointHome": "Punto local",
    "tn.pointAway": "Punto visitante",
    "tn.reset": "Reiniciar marcador",
    "tn.rules": "15-30-40 · sets a 6 juegos · tie-break a 7 · al mejor de 3 sets",
    "tn.tableHint": "Clasificación: victorias y diferencia de juegos",
  },
  fr: {
    "tn.game": "Jeu en cours",
    "tn.tiebreak": "Tie-break (en 7)",
    "tn.set": "Set",
    "tn.pointHome": "Point domicile",
    "tn.pointAway": "Point extérieur",
    "tn.reset": "Réinitialiser le score",
    "tn.rules": "15-30-40 · sets en 6 jeux · tie-break en 7 · au meilleur des 3 sets",
    "tn.tableHint": "Classement : victoires et différence de jeux",
  },
  pt: {
    "tn.game": "Jogo em curso",
    "tn.tiebreak": "Tie-break (até 7)",
    "tn.set": "Set",
    "tn.pointHome": "Ponto casa",
    "tn.pointAway": "Ponto visitante",
    "tn.reset": "Reiniciar marcador",
    "tn.rules": "15-30-40 · sets de 6 jogos · tie-break até 7 · à melhor de 3 sets",
    "tn.tableHint": "Classificação: vitórias e diferença de jogos",
  },
  zh: {
    "tn.game": "当前一局",
    "tn.tiebreak": "抢七局（7分）",
    "tn.set": "盘",
    "tn.pointHome": "主队得分",
    "tn.pointAway": "客队得分",
    "tn.reset": "重置比分",
    "tn.rules": "15-30-40 · 每盘6局 · 抢七 · 三盘两胜",
    "tn.tableHint": "排名：胜场与净局数",
  },
};
