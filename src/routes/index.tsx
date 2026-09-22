import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogoPicker } from "@/components/LogoPicker";
import { LOGO_URL } from "@/components/AppHeader";
import { SPORTS, getSport, FOOTBALL_VARIANTS, isFootball, variantLabel } from "@/lib/sports";
import { useI18n } from "@/lib/i18n";
import { usePro, useOwner } from "@/lib/pro";
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
  const owner = useOwner();
  const [open, setOpen] = useState(false);
  const [boss, setBoss] = useState(false);
  const [code, setCode] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [torneoDaEliminare, setTorneoDaEliminare] = useState<Tournament | null>(null);
  const locked = !pro;

  useEffect(() => {
    if (window.sessionStorage.getItem("mlt.boss.welcome") === "1") {
      window.sessionStorage.removeItem("mlt.boss.welcome");
      setBoss(true);
    }
  }, []);

  return (
    <main className="mx-auto min-h-screen w-full max-w-lg px-4 pb-28 pt-8">
      {boss && (
        <p className="mb-4 rounded-xl border border-primary/40 bg-primary/15 p-3 text-center text-sm font-semibold text-primary">
          👑 BENVENUTO BOSS, accesso gratis attivato
        </p>
      )}
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
          <div key={x.id} className="relative">
            <Link
              to="/torneo/$id"
              params={{ id: x.id }}
              className="card-night flex items-center gap-3 py-3 pl-3 pr-14"
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
                  {sportName(x.sport, getSport(x.sport).name)}
                  {isFootball(x.sport) && variantLabel(x.variant)
                    ? ` (${variantLabel(x.variant)})`
                    : ""}{" "}
                  · {x.teams.length} {t("home.teams")} ·{" "}
                  {x.city || "—"}
                </p>
              </div>
              <span className="text-primary">›</span>
            </Link>
            <button
              type="button"
              aria-label={t("home.delete")}
              title={t("home.delete")}
              onClick={() => {
                const randomCode = (Math.floor(Math.random() * 900) + 100).toString();
                setCode(randomCode);
                setCodeInput("");
                setTorneoDaEliminare(x);
                setOpenDialog(true);
              }}
              className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-destructive/15 text-lg text-destructive"
            >
              🗑️
            </button>
          </div>
        ))}
      </section>

      {open && <NewTournament onClose={() => setOpen(false)} update={update} />}

      <Dialog open={openDialog} onOpenChange={(v) => { setOpenDialog(v); if (!v) setCodeInput(""); }}>
        <DialogContent className="card-night max-w-sm">
          <DialogHeader>
            <DialogTitle className="gold-text text-lg">
              {torneoDaEliminare
                ? t("home.deleteConfirm", { name: torneoDaEliminare.name })
                : t("home.delete")}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {t("home.deleteIrreversible")}
            </DialogDescription>
          </DialogHeader>
          <p className="text-center text-3xl font-bold tracking-widest text-primary">{code}</p>
          <input
            className="field text-center"
            placeholder={t("home.deleteCodePlaceholder")}
            value={codeInput}
            inputMode="numeric"
            onChange={(e) => setCodeInput(e.target.value)}
          />
          <div className="mt-2 flex gap-2">
            <Button
              variant="ghost"
              className="btn-ghost-gold flex-1 py-3"
              onClick={() => setOpenDialog(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button
              disabled={codeInput !== code}
              className={`flex-1 py-3 text-white ${
                codeInput !== code
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              }`}
              onClick={() => {
                if (!torneoDaEliminare) return;
                update((list) => list.filter((tournament) => tournament.id !== torneoDaEliminare.id));
                setOpenDialog(false);
                setTorneoDaEliminare(null);
              }}
            >
              {t("home.deleteBtn")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
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
  const [format, setFormat] = useState<"single" | "groups">("single");
  const [variant, setVariant] = useState<string>("a11");

  const create = () => {
    if (!name.trim()) return;
    const id = uid();
    const item: Tournament = {
      id,
      name: name.trim(),
      sport,
      ...(isFootball(sport) ? { variant } : {}),
      ...(logo ? { logo } : {}),
      city,
      startDate,
      fee,
      format,
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
          {isFootball(sport) && (
            <div className="rounded-xl border border-primary/30 bg-secondary/40 p-3">
              <p className="text-xs text-primary">{t("nt.footballType")}</p>
              <div className="mt-2 grid grid-cols-5 gap-2">
                {FOOTBALL_VARIANTS.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVariant(v.id)}
                    className={`rounded-full py-2 text-xs font-bold ${
                      variant === v.id ? "btn-gold" : "btn-ghost-gold"
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                {FOOTBALL_VARIANTS.find((v) => v.id === variant)?.players} {t("nt.playersPerTeam")}
              </p>
            </div>
          )}
          <label className="block text-xs text-muted-foreground">{t("nt.format")}</label>
          <select
            className="field"
            value={format}
            onChange={(e) => setFormat(e.target.value as "single" | "groups")}
          >
            <option value="single">{t("nt.fmtSingle")}</option>
            <option value="groups">{t("nt.fmtGroups")}</option>
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
