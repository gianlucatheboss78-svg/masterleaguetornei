import type { Lang } from "./i18n-core";

type Dict = Record<string, string>;

export const BASKET_DICTS: Record<Lang, Dict> = {
  it: {
    "bk.rules": "Regole FIP: 4 quarti da 10' · 5 falli per giocatore · bonus dal 5° fallo · overtime se pari",
    "bk.tableHint": "Classifica: vittorie, sconfitte, punti fatti/subiti, differenza e percentuale vittorie",
    "bk.quarter": "Quarto {n}", "bk.overtime": "Overtime {n}", "bk.start": "Avvia", "bk.pause": "Pausa",
    "bk.next": "Periodo successivo", "bk.reset": "Azzera tabellino", "bk.foul": "Registra fallo",
    "bk.fouledOut": "5 falli · espulso", "bk.bonus": "BONUS", "bk.noPlayers": "Aggiungi giocatori per registrare i falli.",
    "bk.pf": "PF", "bk.pa": "PS", "bk.diff": "Diff", "bk.winPct": "%V", "bk.playoffs": "Playoff Basket · 8 squadre",
    "bk.needEight": "Servono 8 squadre e tutte le partite della fase regolare concluse.",
  },
  en: {
    "bk.rules": "FIP rules: four 10-minute quarters · 5 fouls per player · team bonus from 5th foul · overtime if tied",
    "bk.tableHint": "Standings: wins, losses, points for/against, point difference and win percentage",
    "bk.quarter": "Quarter {n}", "bk.overtime": "Overtime {n}", "bk.start": "Start", "bk.pause": "Pause",
    "bk.next": "Next period", "bk.reset": "Reset scoreboard", "bk.foul": "Record foul",
    "bk.fouledOut": "5 fouls · fouled out", "bk.bonus": "BONUS", "bk.noPlayers": "Add players to record fouls.",
    "bk.pf": "PF", "bk.pa": "PA", "bk.diff": "Diff", "bk.winPct": "W%", "bk.playoffs": "Basketball playoffs · 8 teams",
    "bk.needEight": "Eight teams and all regular-season games must be completed.",
  },
  es: {
    "bk.rules": "Reglas FIP: 4 cuartos de 10 min · 5 faltas por jugador · bonus desde la 5.ª falta · prórroga si empatan",
    "bk.tableHint": "Clasificación: victorias, derrotas, puntos a favor/en contra, diferencia y porcentaje de victorias",
    "bk.quarter": "Cuarto {n}", "bk.overtime": "Prórroga {n}", "bk.start": "Iniciar", "bk.pause": "Pausa",
    "bk.next": "Siguiente periodo", "bk.reset": "Reiniciar marcador", "bk.foul": "Registrar falta",
    "bk.fouledOut": "5 faltas · eliminado", "bk.bonus": "BONUS", "bk.noPlayers": "Añade jugadores para registrar faltas.",
    "bk.pf": "PF", "bk.pa": "PC", "bk.diff": "Dif", "bk.winPct": "%V", "bk.playoffs": "Playoffs Basket · 8 equipos",
    "bk.needEight": "Se necesitan 8 equipos y todos los partidos de la fase regular terminados.",
  },
  fr: {
    "bk.rules": "Règles FIP : 4 quarts de 10 min · 5 fautes par joueur · bonus dès la 5e faute · prolongation si égalité",
    "bk.tableHint": "Classement : victoires, défaites, points marqués/encaissés, différence et pourcentage de victoires",
    "bk.quarter": "Quart-temps {n}", "bk.overtime": "Prolongation {n}", "bk.start": "Démarrer", "bk.pause": "Pause",
    "bk.next": "Période suivante", "bk.reset": "Réinitialiser", "bk.foul": "Ajouter une faute",
    "bk.fouledOut": "5 fautes · exclu", "bk.bonus": "BONUS", "bk.noPlayers": "Ajoutez des joueurs pour enregistrer les fautes.",
    "bk.pf": "PM", "bk.pa": "PE", "bk.diff": "Diff", "bk.winPct": "%V", "bk.playoffs": "Playoffs Basket · 8 équipes",
    "bk.needEight": "Il faut 8 équipes et tous les matchs de saison régulière terminés.",
  },
  pt: {
    "bk.rules": "Regras FIP: 4 períodos de 10 min · 5 faltas por jogador · bónus a partir da 5.ª falta · prolongamento se empatar",
    "bk.tableHint": "Classificação: vitórias, derrotas, pontos marcados/sofridos, diferença e percentagem de vitórias",
    "bk.quarter": "Período {n}", "bk.overtime": "Prolongamento {n}", "bk.start": "Iniciar", "bk.pause": "Pausa",
    "bk.next": "Período seguinte", "bk.reset": "Reiniciar marcador", "bk.foul": "Registar falta",
    "bk.fouledOut": "5 faltas · excluído", "bk.bonus": "BÓNUS", "bk.noPlayers": "Adiciona jogadores para registar faltas.",
    "bk.pf": "PM", "bk.pa": "PS", "bk.diff": "Dif", "bk.winPct": "%V", "bk.playoffs": "Playoffs Basket · 8 equipas",
    "bk.needEight": "São necessárias 8 equipas e todos os jogos da fase regular concluídos.",
  },
  zh: {
    "bk.rules": "FIP规则：4节，每节10分钟 · 球员5次犯规离场 · 单节第5次团队犯规进入奖励 · 平局加时",
    "bk.tableHint": "排名：胜负场、得失分、净胜分与胜率",
    "bk.quarter": "第 {n} 节", "bk.overtime": "加时 {n}", "bk.start": "开始", "bk.pause": "暂停",
    "bk.next": "下一节", "bk.reset": "重置记分牌", "bk.foul": "记录犯规",
    "bk.fouledOut": "5次犯规 · 离场", "bk.bonus": "奖励", "bk.noPlayers": "请先添加球员以记录犯规。",
    "bk.pf": "得分", "bk.pa": "失分", "bk.diff": "净胜", "bk.winPct": "胜率", "bk.playoffs": "篮球季后赛 · 8队",
    "bk.needEight": "需要8支球队，且所有常规赛均已结束。",
  },
};