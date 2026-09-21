import { createFileRoute, Link } from "@tanstack/react-router";
import { FREE_TOURNAMENT_LIMIT, PRO_PRICE, setPro, usePro } from "@/lib/pro";

export const Route = createFileRoute("/pro")({
  head: () => ({
    meta: [
      { title: "Master League PRO — Tornei illimitati a 9,99 €/mese" },
      {
        name: "description",
        content:
          "Passa a PRO: tornei illimitati, libreria loghi completa e locandine senza limiti a 9,99 € al mese.",
      },
      { property: "og:title", content: "Master League PRO" },
      {
        property: "og:description",
        content: "Tornei illimitati e tutte le funzioni premium a 9,99 € al mese.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProPage,
});

function ProPage() {
  const pro = usePro();

  return (
    <main className="mx-auto min-h-screen w-full max-w-lg px-4 pb-24 pt-6">
      <Link to="/" className="text-sm text-muted-foreground">
        ‹ Tornei
      </Link>

      <div className="card-night mt-4 p-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full btn-gold text-3xl">
          👑
        </div>
        <h1 className="mt-4 text-3xl gold-text">Master League PRO</h1>
        <p className="display mt-1 text-4xl text-primary">{PRO_PRICE}</p>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">al mese</p>

        <ul className="mt-6 space-y-3 text-left text-sm">
          {[
            "Tornei illimitati (gratis: 3)",
            "Squadre e giocatori illimitati",
            "Libreria 1000 loghi + 195 bandiere",
            "Calendario automatico e partite live",
            "Locandina in 1 click senza filigrana",
            "Gestione incassi iscrizioni",
          ].map((f) => (
            <li key={f} className="flex gap-2">
              <span className="text-primary">✔</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        {pro ? (
          <>
            <p className="mt-6 rounded-xl bg-primary/15 p-3 text-sm text-primary">
              PRO attivo — tornei illimitati sbloccati.
            </p>
            <button onClick={() => setPro(false)} className="btn-ghost-gold mt-3 w-full py-2 text-xs">
              Disattiva PRO (prova)
            </button>
          </>
        ) : (
          <>
            <button className="btn-gold mt-6 w-full py-3 text-base" disabled>
              💳 Abbonati con Stripe
            </button>
            <p className="mt-3 text-xs text-muted-foreground">
              Il pagamento con carta si attiva collegando Stripe al progetto. Nel frattempo puoi
              provare le funzioni PRO in modalità demo.
            </p>
            <button onClick={() => setPro(true)} className="btn-ghost-gold mt-3 w-full py-2 text-xs">
              Prova PRO in demo
            </button>
          </>
        )}
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Piano gratuito: fino a {FREE_TOURNAMENT_LIMIT} tornei, tutte le altre funzioni incluse.
      </p>
    </main>
  );
}
