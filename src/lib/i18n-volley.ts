import type { Lang } from "./i18n-core";
type Dict = Record<string, string>;

export const VOLLEY_DICTS: Record<Lang, Dict> = {
  it: {
    "vl.volleyRules": "6 giocatori · set a 25 · 5° set a 15 · meglio di 5 set · vantaggio di 2 punti",
    "vl.beachRules": "2 giocatori · set a 21 · 3° set a 15 · meglio di 3 set · vantaggio di 2 punti",
    "vl.tableHint": "Classifica: punti, set vinti/persi e quoziente punti", "vl.set": "Set", "vl.current": "Set in corso",
    "vl.pointHome": "Punto casa", "vl.pointAway": "Punto ospite", "vl.reset": "Azzera punteggio partita",
    "vl.setsFor": "SV", "vl.setsAgainst": "SP", "vl.quotient": "QP", "vl.rosterFull": "Limite regolamentare raggiunto: {n} giocatori.",
  },
  en: {
    "vl.volleyRules": "6 players · sets to 25 · 5th set to 15 · best of 5 · win by 2 points",
    "vl.beachRules": "2 players · sets to 21 · 3rd set to 15 · best of 3 · win by 2 points",
    "vl.tableHint": "Standings: points, sets won/lost and point quotient", "vl.set": "Set", "vl.current": "Current set",
    "vl.pointHome": "Home point", "vl.pointAway": "Away point", "vl.reset": "Reset match score",
    "vl.setsFor": "SW", "vl.setsAgainst": "SL", "vl.quotient": "PQ", "vl.rosterFull": "Regulation limit reached: {n} players.",
  },
  es: {
    "vl.volleyRules": "6 jugadores · sets a 25 · 5.º set a 15 · al mejor de 5 · diferencia de 2 puntos",
    "vl.beachRules": "2 jugadores · sets a 21 · 3.er set a 15 · al mejor de 3 · diferencia de 2 puntos",
    "vl.tableHint": "Clasificación: puntos, sets ganados/perdidos y cociente de puntos", "vl.set": "Set", "vl.current": "Set en curso",
    "vl.pointHome": "Punto local", "vl.pointAway": "Punto visitante", "vl.reset": "Reiniciar marcador",
    "vl.setsFor": "SG", "vl.setsAgainst": "SP", "vl.quotient": "CP", "vl.rosterFull": "Límite reglamentario alcanzado: {n} jugadores.",
  },
  fr: {
    "vl.volleyRules": "6 joueurs · sets en 25 · 5e set en 15 · au meilleur des 5 · 2 points d'écart",
    "vl.beachRules": "2 joueurs · sets en 21 · 3e set en 15 · au meilleur des 3 · 2 points d'écart",
    "vl.tableHint": "Classement : points, sets gagnés/perdus et quotient de points", "vl.set": "Set", "vl.current": "Set en cours",
    "vl.pointHome": "Point domicile", "vl.pointAway": "Point extérieur", "vl.reset": "Réinitialiser le score",
    "vl.setsFor": "SG", "vl.setsAgainst": "SP", "vl.quotient": "QP", "vl.rosterFull": "Limite réglementaire atteinte : {n} joueurs.",
  },
  pt: {
    "vl.volleyRules": "6 jogadores · sets até 25 · 5.º set até 15 · à melhor de 5 · vantagem de 2 pontos",
    "vl.beachRules": "2 jogadores · sets até 21 · 3.º set até 15 · à melhor de 3 · vantagem de 2 pontos",
    "vl.tableHint": "Classificação: pontos, sets ganhos/perdidos e quociente de pontos", "vl.set": "Set", "vl.current": "Set em curso",
    "vl.pointHome": "Ponto casa", "vl.pointAway": "Ponto visitante", "vl.reset": "Reiniciar marcador",
    "vl.setsFor": "SG", "vl.setsAgainst": "SP", "vl.quotient": "QP", "vl.rosterFull": "Limite regulamentar atingido: {n} jogadores.",
  },
  zh: {
    "vl.volleyRules": "6名球员 · 每局25分 · 第5局15分 · 五局三胜 · 领先2分胜",
    "vl.beachRules": "2名球员 · 每局21分 · 第3局15分 · 三局两胜 · 领先2分胜",
    "vl.tableHint": "排名：积分、胜负局和得失分比", "vl.set": "局", "vl.current": "当前局",
    "vl.pointHome": "主队得分", "vl.pointAway": "客队得分", "vl.reset": "重置比分",
    "vl.setsFor": "胜局", "vl.setsAgainst": "负局", "vl.quotient": "得失分比", "vl.rosterFull": "已达到规定人数上限：{n}人。",
  },
};