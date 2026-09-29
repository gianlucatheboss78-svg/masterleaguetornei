import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Clock3, ShieldCheck, Trophy, Users } from "lucide-react";

export const Route = createFileRoute("/regolamento")({
  head: () => ({ meta: [
    { title: "Regolamento — Master League Tornei" },
    { name: "description", content: "Regole dei formati e degli sport disponibili in Master League Tornei." },
    { property: "og:title", content: "Regolamento — Master League Tornei" },
    { property: "og:description", content: "Calcio, basket, 3x3, tennis, padel, volley e beach volley." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: RulesPage,
});

const rules = [
  [Trophy, "Formati torneo", "Girone unico, andata/ritorno, girone con fase eliminatoria ed eliminazione diretta. Calendario e classifica si aggiornano dai risultati."],
  [Clock3, "Basket 5vs5", "Quattro quarti da 10 minuti, cinque falli per giocatore, bonus dal quinto fallo e overtime in caso di parità."],
  [ShieldCheck, "Basket 3vs3", "Regole FIBA 3x3: metà campo, 10 minuti, 12 secondi per l’azione, canestri da 1 o 2 punti, vittoria a 21 e overtime ai primi 2 punti."],
  [Users, "Rose 3vs3", "Massimo quattro giocatori per squadra: tre in campo e una riserva."],
  [BookOpen, "Altri sport", "Tennis e padel usano 15-30-40, set e tie-break. Volley e beach volley applicano set, punteggi e limiti rosa dedicati."],
] as const;

function RulesPage() { return <main className="mx-auto min-h-screen w-full max-w-lg px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-8"><p className="text-[10px] font-bold uppercase text-muted-foreground">Master League</p><h1 className="mt-1 text-2xl gold-text">Regolamento</h1><div className="mt-6 space-y-3">{rules.map(([Icon, title, copy]) => <section key={title} className="league-panel p-4"><div className="flex items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/50 text-primary"><Icon className="h-5 w-5" /></span><h2 className="text-sm text-primary">{title}</h2></div><p className="mt-3 text-sm leading-6 text-muted-foreground">{copy}</p></section>)}</div></main>; }
