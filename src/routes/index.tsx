import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LogoPicker } from "@/components/LogoPicker";
import { SPORTS, getSport } from "@/lib/sports";
import { FREE_TOURNAMENT_LIMIT, PRO_PRICE, usePro } from "@/lib/pro";
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
  const pro = usePro();
  const [open, setOpen] = useState(false);
  const locked = !pro && data.length >= FREE_TOURNAMENT_LIMIT;


  return (
    <main className="mx-auto min-h-screen w-full max-w-lg px-4 pb-28 pt-8">
      <header className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full btn-gold text-3xl">
          🏆
        </div>
        <h1 className="mt-4 text-3xl leading-none gold-text">Master League</h1>
        <p className="display text-lg tracking-[0.35em] text-muted-foreground">Tornei</p>
        <p className="mt-3 text-sm text-muted-foreground">
          15 sport · squadre illimitate · live · classifiche
        </p>
      </header>

      <div className="mt-7 flex flex-wrap justify-center gap-2">
        {SPORTS.map((s) => (
          <span
            key={s.id}
            className="rounded-full border border-primary/25 bg-secondary/60 px-3 py-1 text-xs text-muted-foreground"
          >
            {s.icon} {s.name}
          </span>
        ))}
      </div>

      {locked ? (
        <Link to="/pro" className="btn-gold mt-7 block w-full py-3 text-center text-base">
          👑 Limite gratis raggiunto — passa a PRO {PRO_PRICE}/mese
        </Link>
      ) : (
        <button onClick={() => setOpen(true)} className="btn-gold mt-7 w-full py-3 text-base">
          + Nuovo torneo
        </button>
      )}

      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {pro ? "👑 PRO attivo · tornei illimitati" : `${data.length}/${FREE_TOURNAMENT_LIMIT} tornei gratis`}
        </span>
        <Link to="/pro" className="text-primary">
          {pro ? "Gestisci PRO" : "Scopri PRO"} ›
        </Link>
      </div>


      <section className="mt-8 space-y-3">
        <h2 className="text-sm tracking-widest text-muted-foreground">I tuoi tornei</h2>
        {ready && data.length === 0 && (
          <p className="card-night p-6 text-center text-sm text-muted-foreground">
            Nessun torneo. Creane uno per iniziare.
          </p>
        )}
        {data.map((t) => (
          <Link
            key={t.id}
            to="/torneo/$id"
            params={{ id: t.id }}
            className="card-night flex items-center gap-3 p-3"
          >
            {t.logo ? (
              <img src={t.logo} alt={t.name} className="h-14 w-14 rounded-full object-cover" />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-2xl">
                {getSport(t.sport).icon}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="display truncate text-base text-primary">{t.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {getSport(t.sport).name} · {t.teams.length} squadre · {t.city || "—"}
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
  const [logo, setLogo] = useState<string>();

  const [name, setName] = useState("");
  const [sport, setSport] = useState(SPORTS[0]!.id);
  const [city, setCity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [fee, setFee] = useState(0);

  const create = () => {
    if (!name.trim()) return;
    const id = uid();
    const t: Tournament = {
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
    update((l) => [t, ...l]);
    onClose();
    nav({ to: "/torneo/$id", params: { id } });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/70 p-0 sm:items-center sm:p-4">
      <div className="card-night max-h-[92vh] w-full overflow-y-auto p-5 sm:mx-auto sm:max-w-lg">
        <h2 className="text-xl gold-text">Nuovo torneo</h2>

        <div className="mt-4 flex flex-col items-center">
          <LogoPicker value={logo} onChange={setLogo} />
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Galleria telefono · 1000 loghi · 195 bandiere
          </p>
        </div>


        <div className="mt-5 space-y-3">
          <input
            className="field"
            placeholder="Nome torneo"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <select className="field" value={sport} onChange={(e) => setSport(e.target.value)}>
            {SPORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.icon} {s.name}
              </option>
            ))}
          </select>
          <input
            className="field"
            placeholder="Città"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <label className="block text-xs text-muted-foreground">Data inizio</label>
          <input
            className="field"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <label className="block text-xs text-muted-foreground">Quota iscrizione (€)</label>
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
            Annulla
          </button>
          <button onClick={create} className="btn-gold flex-1 py-3">
            Crea
          </button>
        </div>
      </div>
    </div>
  );
}
