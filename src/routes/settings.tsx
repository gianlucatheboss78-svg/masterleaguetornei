import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Crown, Languages, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LANGS, useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Impostazioni — Master League Tornei" },
      { name: "description", content: "Lingua, account e abbonamento di Master League Tornei." },
      { property: "og:title", content: "Impostazioni — Master League Tornei" },
      { property: "og:description", content: "Gestisci lingua, account e abbonamento." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" }
    ]
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { lang, setLang } = useI18n();
  return (
    <main className="mx-auto min-h-screen w-full max-w-lg px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-8">
      <p className="text-[10px] font-bold uppercase text-muted-foreground">Master League</p>
      <h1 className="mt-1 text-2xl gold-text">Impostazioni</h1>

      <section className="league-panel mt-6 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary"><Languages className="h-4 w-4" /> Lingua</div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {LANGS.map((item) => (
            <Button key={item.code} type="button" variant={lang === item.code ? "default" : "outline"} className="h-11 px-2" onClick={() => setLang(item.code)}>
              <span>{item.flag}</span><span>{item.code.toUpperCase()}</span>
            </Button>
          ))}
        </div>
      </section>

      <Link to="/auth" className="league-panel mt-3 flex items-center gap-3 p-4">
        <UserRound className="h-5 w-5 text-primary" aria-hidden="true" />
        <span className="flex-1 text-sm font-semibold">Account e sincronizzazione</span>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </Link>
      <a href="https://buy.stripe.com/8x28wQ2WU0aY6wSgQL9AQ00" className="league-panel mt-3 flex items-center gap-3 border-primary/60 p-4">
        <Crown className="h-5 w-5 text-primary" aria-hidden="true" />
        <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-primary">Abbonati</span><span className="block text-[11px] text-muted-foreground">6 giorni gratis, poi 9,99 € al mese</span></span>
        <ChevronRight className="h-4 w-4 text-primary" />
      </a>
    </main>
  );
}