import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Trophy } from "lucide-react";

import { useTournaments } from "@/lib/store";
import { getSport, isFootball, variantLabel } from "@/lib/sports";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/tournaments")({
  head: () => ({
    meta: [
      { title: "I miei tornei — Master League Tornei" },
      { name: "description", content: "Consulta e gestisci tutti i tuoi tornei Master League." },
      { property: "og:title", content: "I miei tornei — Master League Tornei" },
      { property: "og:description", content: "Tornei, squadre, calendari e classifiche in un solo posto." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" }
    ]
  }),
  component: TournamentsPage,
});

function TournamentsPage() {
  const { data, ready } = useTournaments();
  const { t, sportName } = useI18n();

  return (
    <main className="mx-auto min-h-screen w-full max-w-lg px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-8">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/50 text-primary"><Trophy aria-hidden="true" /></span>
        <div>
          <p className="text-[10px] font-bold uppercase text-muted-foreground">Master League</p>
          <h1 className="text-2xl gold-text">{t("home.yours")}</h1>
        </div>
      </div>

      <section className="mt-6 space-y-3">
        {ready && data.length === 0 && <p className="league-panel p-8 text-center text-sm text-muted-foreground">{t("home.empty")}</p>}
        {data.map((tournament) => {
          const sport = getSport(tournament.sport);
          return (
            <Link key={tournament.id} to="/torneo/$id" params={{ id: tournament.id }} className="league-panel flex items-center gap-3 p-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-primary/50 bg-secondary text-xl">
                {tournament.logo ? <img src={tournament.logo} alt="" className="h-full w-full object-cover" /> : sport.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="display block truncate text-sm text-primary" translate="no">{tournament.name}</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {sportName(sport.id, sport.name)}{isFootball(sport.id) && variantLabel(tournament.variant) ? ` · ${variantLabel(tournament.variant)}` : ""} · {tournament.teams.length} {t("home.teams")}
                </span>
              </span>
              <ChevronRight className="h-4 w-4 text-primary" aria-hidden="true" />
            </Link>
          );
        })}
      </section>
    </main>
  );
}