import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart3, ChevronRight } from "lucide-react";
import { getSport } from "@/lib/sports";
import { standings, useTournaments } from "@/lib/store";

export const Route = createFileRoute("/classifiche")({
  head: () => ({ meta: [
    { title: "Classifiche — Master League Tornei" },
    { name: "description", content: "Consulta le classifiche aggiornate dei tuoi tornei." },
    { property: "og:title", content: "Classifiche — Master League Tornei" },
    { property: "og:description", content: "Risultati e classifiche aggiornate dei tornei Master League." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: StandingsHub,
});

function StandingsHub() {
  const { data, ready } = useTournaments();
  return <main className="mx-auto min-h-screen w-full max-w-lg px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-8">
    <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/50 text-primary"><BarChart3 /></span><div><p className="text-[10px] font-bold uppercase text-muted-foreground">Master League</p><h1 className="text-2xl gold-text">Classifiche</h1></div></div>
    <section className="mt-6 space-y-3">
      {ready && data.length === 0 && <p className="league-panel p-8 text-center text-sm text-muted-foreground">Crea un torneo per vedere la classifica.</p>}
      {data.map((tournament) => {
        const sport = getSport(tournament.sport); const leader = standings(tournament, sport.winPoints, sport.drawPoints)[0];
        return <Link key={tournament.id} to="/torneo/$id" params={{ id: tournament.id }} className="league-panel flex items-center gap-3 p-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 bg-secondary text-xl">{sport.icon}</span>
          <span className="min-w-0 flex-1"><span className="display block truncate text-sm text-primary">{tournament.name}</span><span className="block truncate text-xs text-muted-foreground">{leader ? `1° ${leader.team.name} · ${leader.pts} pt` : "Classifica in attesa dei risultati"}</span></span>
          {tournament.basketMode === "3x3" && <span className="rounded-full bg-primary px-2 py-1 text-[10px] font-black text-primary-foreground">3vs3</span>}<ChevronRight className="h-4 w-4 text-primary" />
        </Link>;
      })}
    </section>
  </main>;
}
