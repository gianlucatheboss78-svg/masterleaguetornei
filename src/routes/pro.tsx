import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { PRO_PRICE, setPro, usePro } from "@/lib/pro";
import { useI18n } from "@/lib/i18n";
import { createProCheckout } from "@/lib/billing.functions";

export const Route = createFileRoute("/pro")({
  head: () => ({
    meta: [
      { title: "Prova Master League PRO — 7 giorni gratis, poi 9,99 €/mese" },
      {
        name: "description",
        content:
          "7 giorni gratis, poi 9,99 € al mese: tornei illimitati, 15 sport, 1000 loghi, 195 bandiere, classifica live e locandina.",
      },
      { property: "og:title", content: "Prova Master League PRO" },
      {
        property: "og:description",
        content: "7 giorni gratis, poi 9,99 € al mese. Disdici quando vuoi.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProPage,
});

const BENEFIT_KEYS = ["pro.b1", "pro.b2", "pro.b3", "pro.b4", "pro.b5", "pro.b6", "pro.b7", "pro.b8"];

function ProPage() {
  const pro = usePro();
  const { t } = useI18n();
  const nav = useNavigate();
  const checkout = useServerFn(createProCheckout);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("checkout") === "success") {
      setPro(true);
      nav({ to: "/" });
    }
  }, [nav]);

  const start = async () => {
    setLoading(true);
    setError(undefined);
    try {
      const res = await checkout({ data: { origin: window.location.origin } });
      if (res.ok) window.location.href = res.url;
      else setError(res.error);
    } catch {
      setError("Collega Stripe nelle Environment Variables");
    }
    setLoading(false);
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-lg px-4 pb-24 pt-6">
      <Link to="/" className="text-sm text-muted-foreground">
        ‹ Tornei
      </Link>

      <div className="card-night mt-4 p-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full btn-gold text-3xl">
          👑
        </div>
        <h1 className="mt-4 text-3xl gold-text">Prova Master League PRO</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          7 giorni gratis, poi {PRO_PRICE} al mese — Disdici quando vuoi
        </p>

        <ul className="mt-6 space-y-3 text-left text-sm">
          {BENEFITS.map((f) => (
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
              Disattiva PRO
            </button>
          </>
        ) : (
          <>
            <button
              onClick={start}
              disabled={loading}
              className="btn-gold mt-6 w-full py-3 text-base disabled:opacity-60"
            >
              {loading ? "Attendi…" : "Inizia 7 giorni gratis"}
            </button>
            {error && (
              <p className="mt-3 rounded-xl bg-destructive/15 p-3 text-xs text-destructive">
                {error}
              </p>
            )}
            <p className="mt-3 text-xs text-muted-foreground">
              Nessun addebito oggi. Dopo 7 giorni {PRO_PRICE} al mese, rinnovo automatico.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
