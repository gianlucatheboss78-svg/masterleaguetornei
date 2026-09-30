import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, CircleDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JERSEY_PRESETS, jerseyInitials } from "@/data/jerseys";
import { renderTeamKit } from "@/data/teamLogos";
import { SPORTS } from "@/lib/sports";

export const Route = createFileRoute("/sport")({
  head: () => ({
    meta: [
      { title: "6 Sport e maglie mondiali — Master League Tornei" },
      { name: "description", content: "Scegli uno dei sei sport Master League e consulta le maglie mondiali già sbloccate." },
      { property: "og:title", content: "6 Sport — Master League Tornei" },
      { property: "og:description", content: "Sei sport e maglie mondiali disponibili per i tuoi tornei." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SportPage,
});

function SportPage() {
  const [selectedSport, setSelectedSport] = useState(SPORTS[0]?.id ?? "calcio");
  const selected = SPORTS.find((sport) => sport.id === selectedSport) ?? SPORTS[0];
  const jerseySport = selectedSport === "basket" ? "basket" : "football";
  const jerseys = useMemo(
    () => JERSEY_PRESETS.filter((preset) => preset.sport === jerseySport),
    [jerseySport],
  );

  return (
    <main className="mx-auto min-h-screen w-full max-w-lg px-4 pb-[calc(7rem+env(safe-area-inset-bottom))] pt-6">
      <header className="mb-5">
        <div className="flex items-center gap-2 text-primary">
          <CircleDot className="h-6 w-6" aria-hidden="true" />
          <h1 className="gold-text text-2xl">6 SPORT</h1>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Scegli lo sport e scopri tutte le maglie disponibili.</p>
      </header>

      <section className="grid grid-cols-2 gap-2" aria-label="Selezione sport">
        {SPORTS.map((sport) => (
          <Button
            key={sport.id}
            type="button"
            variant="outline"
            onClick={() => setSelectedSport(sport.id)}
            className={`h-16 justify-start px-3 ${selectedSport === sport.id ? "border-primary bg-primary/10 text-primary" : ""}`}
          >
            <span className="text-xl" aria-hidden="true">{sport.icon}</span>
            <span className="min-w-0 flex-1 truncate text-left text-xs font-bold">{sport.name}</span>
            {selectedSport === sport.id && <Check className="h-4 w-4" aria-hidden="true" />}
          </Button>
        ))}
      </section>

      <section className="mt-7">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase text-muted-foreground">{selected?.name}</p>
            <h2 className="display text-base text-primary">Maglie mondiali</h2>
          </div>
          <span className="rounded-full border border-primary/40 bg-primary/10 px-2 py-1 text-[9px] font-bold text-primary">SBLOCCATE</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {jerseys.map((preset) => (
            <article key={preset.id} className="league-panel flex min-h-28 flex-col items-center justify-center gap-1 p-2 text-center">
              <img
                src={renderTeamKit(selectedSport, preset.primary, 10, preset.secondary, jerseyInitials(preset.club))}
                alt={`Maglia ${preset.club}`}
                className="h-16 w-16 object-contain"
              />
              <p className="line-clamp-2 text-[10px] font-bold">{preset.club}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}