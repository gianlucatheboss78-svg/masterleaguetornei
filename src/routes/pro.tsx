import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  PRO_PRICE,
  setPro,
  usePro,
  useOwner,
  signInOwner,
  isOwnerEmail,
  signOutOwner,
  ownerEmail,
} from "@/lib/pro";
import { useI18n } from "@/lib/i18n";
import { LOGO_URL } from "@/components/AppHeader";
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
  const owner = useOwner();
  const { t } = useI18n();
  const nav = useNavigate();
  const checkout = useServerFn(createProCheckout);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [ownerInput, setOwnerInput] = useState("");
  const ownerEmailLabel = owner ? (ownerEmail() ?? "") : "";

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("checkout") === "success") {
      setPro(true);
      nav({ to: "/" });
    }
  }, [nav]);

  const start = async () => {
    setError(undefined);
    // OWNER BYPASS: nessun redirect a Stripe per l'email del proprietario
    if (isOwnerEmail(ownerInput)) {
      signInOwner(ownerInput);
      window.sessionStorage.setItem("mlt.boss.welcome", "1");
      nav({ to: "/" });
      return;
    }
    setLoading(true);
    try {
      const res = await checkout({ data: { origin: window.location.origin } });
      if (res.ok) window.location.href = res.url;
      else setError(res.error);
    } catch {
      setError(t("pro.err"));
    }
    setLoading(false);
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-lg px-4 pb-24 pt-6">
      <Link to="/" className="text-sm text-muted-foreground">
        {t("common.back")}
      </Link>

      <div className="card-night mt-4 p-6 text-center">
        <img
          src={LOGO_URL}
          alt="Master League Tornei"
          className="mx-auto h-24 w-24 rounded-3xl border border-primary/40 object-cover shadow-lg"
        />
        <h1 className="mt-4 text-3xl gold-text">{t("pro.title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("pro.subtitle", { price: PRO_PRICE })}
        </p>

        <ul className="mt-6 space-y-3 text-left text-sm">
          {BENEFIT_KEYS.map((k) => (
            <li key={k} className="flex gap-2">
              <span className="text-primary">✔</span>
              <span>{t(k)}</span>
            </li>
          ))}
        </ul>

        {owner ? (
          <>
            <p className="mt-6 rounded-xl bg-primary/15 p-3 text-sm text-primary">
              👑 OWNER — accesso completo gratuito
            </p>
            <p className="mt-2 text-xs text-muted-foreground">{ownerEmailLabel}</p>
            <button
              onClick={() => signOutOwner()}
              className="btn-ghost-gold mt-3 w-full py-2 text-xs"
            >
              Esci da owner
            </button>
          </>
        ) : pro ? (
          <>
            <p className="mt-6 rounded-xl bg-primary/15 p-3 text-sm text-primary">
              {t("pro.active")}
            </p>
            <button onClick={() => setPro(false)} className="btn-ghost-gold mt-3 w-full py-2 text-xs">
              {t("pro.off")}
            </button>
          </>
        ) : (
          <>
            <input
              className="field mt-6"
              type="email"
              autoComplete="email"
              placeholder="La tua email"
              value={ownerInput}
              onChange={(e) => setOwnerInput(e.target.value)}
            />
            <button
              onClick={start}
              disabled={loading}
              className="btn-gold mt-3 w-full py-3 text-base disabled:opacity-60"
            >
              {loading ? t("pro.wait") : t("pro.cta")}
            </button>
            {error && (
              <p className="mt-3 rounded-xl bg-destructive/15 p-3 text-xs text-destructive">
                {error}
              </p>
            )}
            <p className="mt-3 text-xs text-muted-foreground">
              {t("pro.noCharge", { price: PRO_PRICE })}
            </p>
          </>
        )}
      </div>

      {!owner && (
        <p className="mt-4 text-center text-xs text-muted-foreground">
          👑 Sei il proprietario? Inserisci la tua email owner: l'accesso è gratuito, senza
          pagamento.
        </p>
      )}
    </main>
  );
}
