import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LogoPicker } from "@/components/LogoPicker";
import { LOGO_URL } from "@/components/AppHeader";
import { SPORTS, getSport } from "@/lib/sports";
import { useI18n } from "@/lib/i18n";
import { usePro } from "@/lib/pro";
import { uid, useTournaments, type Tournament } from "@/lib/store";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Master League Tornei — Gestione tornei multisport" },
      {
        name: "description",
        content:
          "Crea tornei per 15 sport: squadre, giocatori, calendario, live, classifiche, iscrizioni e locandina automatica.",
      },
      { property: "og:title", content: "Master League Tornei" },
      {
        property: "og:description",
        content: "Tornei multisport in stile Champions: calendario, live, classifiche e locandina.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const { data, ready, update } = useTournaments();
  const { t, sportName } = useI18n();
  const pro = usePro();
  const [open, setOpen] = useState(false);
  const locked = !pro;

  return (
    <main className="mx-auto min-h-screen w-full max-w-lg px-4 pb-28 pt-8">
      <header className="text-center">
        <img
          src={LOGO_URL}
          alt="Master League Tornei"
          className="mx-auto h-28 w-28 rounded-3xl border border-primary/40 object-cover shadow-lg"
        />
        <h1 className="mt-4 text-3xl leading-none gold-text">Master League</h1>
        <p className="display text-lg tracking-[0.35em] text-muted-foreground">
          {t("home.tornei")}
        </p>
        <p className="mt-3 text-sm text-muted-foreground">{t("home.tagline")}</p>
      </header>

      <div className="mt-7 flex flex-wrap justify-center gap-2">
        {SPORTS.map((s) => (
          <span
            key={s.id}
            className="rounded-full border border-primary/25 bg-secondary/60 px-3 py-1 text-xs text-muted-foreground"
          >
            {s.icon} {sportName(s.id, s.name)}
          </span>
        ))}
      </div>

      {locked ? (
        <Link to="/pro" className="btn-gold mt-7 block w-full py-3 text-center text-base">
          {t("home.new")}
        </Link>
      ) : (
        <button onClick={() => setOpen(true)} className="btn-gold mt-7 w-full py-3 text-base">
          {t("home.new")}
        </button>
      )}

      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>{owner ? "👑 OWNER — tutto sbloccato" : pro ? t("home.proActive") : t("home.trial")}</span>
        <Link to="/pro" className="text-primary">
          {pro ? t("home.managePro") : t("home.discoverPro")} ›
        </Link>
      </div>

      <section className="mt-8 space-y-3">
        <h2 className="text-sm tracking-widest text-muted-foreground">{t("home.yours")}</h2>
        {ready && data.length === 0 && (
          <p className="card-night p-6 text-center text-sm text-muted-foreground">
            {t("home.empty")}
          </p>
        )}
        {data.map((x) => (
          <Link
            key={x.id}
            to="/torneo/$id"
            params={{ id: x.id }}
            className="card-night flex items-center gap-3 p-3"
          >
            {x.logo ? (
              <img src={x.logo} alt={x.name} className="h-14 w-14 rounded-full object-cover" />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-2xl">
                {getSport(x.sport).icon}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="display truncate text-base text-primary">{x.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {sportName(x.sport, getSport(x.sport).name)} · {x.teams.length} {t("home.teams")} ·{" "}
                {x.city || "—"}
              </p>
            </div>
            <span className="text-primary">›</span>
          </Link>
        ))}
      </section>

      {open && <NewTournament onClose={() => setOpen(false)} update={update} />}
    </main>
  );
}

function NewTournament({
  onClose,
  update,
}: {
  onClose: () => void;
  update: (fn: (l: Tournament[]) => Tournament[]) => void;
}) {
  const nav = useNavigate();
  const { t, sportName } = useI18n();
  const [logo, setLogo] = useState<string>();

  const [name, setName] = useState("");
  const [sport, setSport] = useState(SPORTS[0]!.id);
  const [city, setCity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [fee, setFee] = useState(0);

  const create = () => {
    if (!name.trim()) return;
    const id = uid();
    const item: Tournament = {
      id,
      name: name.trim(),
      sport,
      ...(logo ? { logo } : {}),
      city,
      startDate,
      fee,
      teams: [],
      matches: [],
    };
    update((l) => [item, ...l]);
    onClose();
    nav({ to: "/torneo/$id", params: { id } });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/70 p-0 sm:items-center sm:p-4">
      <div className="card-night max-h-[92vh] w-full overflow-y-auto p-5 sm:mx-auto sm:max-w-lg">
        <h2 className="text-xl gold-text">{t("nt.title")}</h2>

        <div className="mt-4 flex flex-col items-center">
          <LogoPicker value={logo} onChange={setLogo} />
          <p className="mt-2 text-center text-xs text-muted-foreground">{t("nt.logoHint")}</p>
        </div>

        <div className="mt-5 space-y-3">
          <input
            className="field"
            placeholder={t("nt.name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <select className="field" value={sport} onChange={(e) => setSport(e.target.value)}>
            {SPORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.icon} {sportName(s.id, s.name)}
              </option>
            ))}
          </select>
          <input
            className="field"
            placeholder={t("nt.city")}
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <label className="block text-xs text-muted-foreground">{t("nt.start")}</label>
          <input
            className="field"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <label className="block text-xs text-muted-foreground">{t("nt.fee")}</label>
          <input
            className="field"
            type="number"
            min={0}
            value={fee}
            onChange={(e) => setFee(Number(e.target.value))}
          />
        </div>

        <div className="mt-5 flex gap-2">
          <button onClick={onClose} className="btn-ghost-gold flex-1 py-3">
            {t("common.cancel")}
          </button>
          <button onClick={create} className="btn-gold flex-1 py-3">
            {t("nt.create")}
          </button>
        </div>
      </div>
    </div>
  );
}
