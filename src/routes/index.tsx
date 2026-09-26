import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, ChevronRight, Copy, Crown, Languages, Link2, MessageCircle, Send, Share2, Sparkles, Trash2, Trophy, Users } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LOGO_URL } from "@/components/AppHeader";
import { SPORTS, getSport, FOOTBALL_VARIANTS, isFootball, variantLabel } from "@/lib/sports";
import { useI18n } from "@/lib/i18n";
import { isRacket } from "@/lib/tennis";
import { isBasket } from "@/lib/basket";
import { usePro, useOwner } from "@/lib/pro";
import { uid, useTournaments, type Tournament } from "@/lib/store";
import { pushTournament } from "@/lib/cloud";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Master League Tornei — Gestione tornei multisport" },
      {
        name: "description",
        content:
          "Crea tornei per 12 sport: squadre, giocatori, calendario, live, classifiche, iscrizioni e locandina automatica.",
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
  const [torneoDaCondividere, setTorneoDaCondividere] = useState<Tournament | null>(null);
  const [copied, setCopied] = useState(false);

  const shareUrl = torneoDaCondividere
    ? `https://masterleaguetornei.lovable.app/torneo/${torneoDaCondividere.id}`
    : "";

  const copyShareLink = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  useEffect(() => {
    if (window.sessionStorage.getItem("mlt.boss.welcome") === "1") {
      window.sessionStorage.removeItem("mlt.boss.welcome");
      setBoss(true);
    }
  }, []);

  return (
    <main className="mx-auto min-h-screen w-full max-w-lg px-4 pb-[calc(7rem+env(safe-area-inset-bottom))] pt-9">
      {boss && (
        <p className="mb-4 rounded-xl border border-primary/40 bg-primary/15 p-3 text-center text-sm font-semibold text-primary">
          👑 BENVENUTO BOSS, accesso gratis attivato
        </p>
      )}
      <header className="text-center">
        <img
          src={LOGO_URL}
          alt="Master League Tornei"
          className="mx-auto h-24 w-24 rounded-2xl border border-primary/60 object-cover shadow-lg"
        />
        <h1 className="mt-4 text-2xl leading-none gold-text">Master League</h1>
        <p className="mt-2 text-[10px] font-bold uppercase text-muted-foreground">Tournament Engine</p>
        <p className="mt-3 text-xs text-muted-foreground">Organizza, gestisci e condividi i tuoi tornei</p>
      </header>

      <Button onClick={() => setOpen(true)} className="mt-7 h-16 w-full justify-between rounded-lg px-5 text-left shadow-[var(--shadow-gold)]">
        <span className="flex items-center gap-3"><Trophy className="h-5 w-5" /><span><span className="display block text-sm">Crea torneo</span><span className="block text-[10px] font-normal">Squadre e giocatori illimitati</span></span></span>
        <ChevronRight className="h-5 w-5" />
      </Button>

      <section className="mt-3 grid grid-cols-2 gap-2">
        {[
          [Users, `${SPORTS.length} Sport`, "Calcio, Basket, Padel +"],
          [Share2, "Condivisione live", "QR + Link + WhatsApp"],
          [Sparkles, "Formato automatico", "Calendario e tabellone"],
          [Languages, "6 Lingue", "IT · EN · ES · FR · PT · ZH"],
        ].map(([Icon, title, copy]) => {
          const FeatureIcon = Icon as typeof Users;
          return <div key={String(title)} className="league-panel min-h-24 p-3"><span className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/60 text-primary"><FeatureIcon className="h-4 w-4" /></span><p className="mt-2 text-xs font-bold">{String(title)}</p><p className="mt-1 text-[10px] text-muted-foreground">{String(copy)}</p></div>;
        })}
      </section>

      <a href="https://buy.stripe.com/8x28wQ2WU0aY6wSgQL9AQ00" className="league-panel mt-3 flex items-center gap-3 border-primary/70 p-4">
        <Crown className="h-5 w-5 text-primary" aria-hidden="true" />
        <span className="min-w-0 flex-1"><span className="block text-xs font-bold text-primary">Abbonati</span><span className="block text-[10px] text-muted-foreground">6 GIORNI GRATIS · poi 9,99 €/mese</span></span>
        <ChevronRight className="h-4 w-4 text-primary" aria-hidden="true" />
      </a>

      {(owner || pro) && <p className="mt-3 text-center text-xs text-primary">{owner ? "👑 OWNER — tutto sbloccato" : t("home.proActive")}</p>}

      <section className="mt-8 space-y-3">
        <div className="flex items-center justify-between"><h2 className="text-sm text-muted-foreground">{t("home.yours")}</h2><Link to="/tournaments" className="text-xs text-primary">Vedi tutti ›</Link></div>
        {ready && data.length === 0 && (
          <p className="card-night p-6 text-center text-sm text-muted-foreground">
            {t("home.empty")}
          </p>
        )}
        {data.map((x) => (
          <article key={x.id} className="card-night overflow-hidden">
            <Link
              to="/torneo/$id"
              params={{ id: x.id }}
              className="flex items-center gap-3 p-3"
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
            <div className="grid h-12 grid-cols-3 border-t border-border/70">
              <Button
                type="button"
                variant="ghost"
                aria-label={t("home.share")}
                title={t("home.share")}
                onClick={async () => {
                  await pushTournament(x);
                  setCopied(false);
                  setTorneoDaCondividere(x);
                }}
                className="h-full rounded-none border-r border-border/70 text-primary hover:bg-primary/10 hover:text-primary"
              >
                <Share2 aria-hidden="true" />
                <span className="sr-only">{t("home.share")}</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                aria-label={t("home.chat")}
                title={t("home.chat")}
                className="h-full rounded-none border-r border-border/70 text-primary hover:bg-primary/10 hover:text-primary"
              >
                <MessageCircle aria-hidden="true" />
                <span className="sr-only">{t("home.chat")}</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                aria-label={t("home.delete")}
                title={t("home.delete")}
                onClick={() => {
                  const randomCode = (Math.floor(Math.random() * 900) + 100).toString();
                  setCode(randomCode);
                  setCodeInput("");
                  setTorneoDaEliminare(x);
                  setOpenDialog(true);
                }}
                className="h-full rounded-none text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 aria-hidden="true" />
                <span className="sr-only">{t("home.delete")}</span>
              </Button>
            </div>
          </article>
        ))}
      </section>

      {open && <NewTournament onClose={() => setOpen(false)} update={update} />}

      <Dialog
        open={Boolean(torneoDaCondividere)}
        onOpenChange={(value) => {
          if (!value) {
            setTorneoDaCondividere(null);
            setCopied(false);
          }
        }}
      >
        <DialogContent className="card-night w-[calc(100%-2rem)] max-w-sm p-5">
          <DialogHeader className="pr-7 text-left">
            <DialogTitle className="gold-text text-xl">{t("share.title")}</DialogTitle>
            <DialogDescription className="truncate text-sm text-muted-foreground">
              {torneoDaCondividere?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="mx-auto rounded-lg bg-qr p-3 text-qr-foreground">
            {shareUrl && <QRCodeSVG value={shareUrl} size={176} level="H" fgColor="currentColor" bgColor="transparent" />}
          </div>

          <div className="flex min-w-0 items-center gap-2 rounded-md border border-border bg-secondary/60 p-2">
            <Link2 className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">{shareUrl}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button asChild className="h-11 bg-success text-success-foreground hover:bg-success/90">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${torneoDaCondividere?.name ?? "Master League"} ${shareUrl}`)}`}
                target="_blank"
                rel="noreferrer"
              >
                <Send aria-hidden="true" />
                WhatsApp
              </a>
            </Button>
            <Button type="button" variant="outline" className="h-11" onClick={copyShareLink}>
              {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
              {copied ? t("share.copied") : t("share.copy")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
  const [name, setName] = useState("");
  const [sport, setSport] = useState(SPORTS[0]!.id);
  const [city, setCity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [fee, setFee] = useState(0);
  const [format, setFormat] = useState<"single" | "singleko" | "groups">("single");
  const [variant, setVariant] = useState<string>("a11");

  const create = async () => {
    if (!name.trim()) return;
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : uid();
    const item: Tournament = {
      id,
      name: name.trim(),
      sport,
      ...(isFootball(sport) ? { variant } : {}),
      city,
      startDate,
      fee,
      format,
      teams: [],
      matches: [],
    };
    update((l) => [item, ...l]);
    await pushTournament(item);
    onClose();
    nav({ to: "/torneo/$id", params: { id } });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/70 p-0 sm:items-center sm:p-4">
      <div className="card-night max-h-[92vh] w-full overflow-y-auto p-5 sm:mx-auto sm:max-w-lg">
        <h2 className="text-xl gold-text">{t("nt.title")}</h2>

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
          {isRacket(sport) && (
            <div className="rounded-xl border border-primary/30 bg-secondary/40 p-3">
              <p className="text-xs text-primary">🎾 {t("tn.rules")}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{t("tn.tableHint")}</p>
            </div>
          )}
          {isBasket(sport) && (
            <div className="rounded-xl border border-primary/30 bg-secondary/40 p-3">
              <p className="text-xs text-primary">🏀 {t("bk.rules")}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{t("bk.tableHint")}</p>
            </div>
          )}
          {(sport === "pallavolo" || sport === "beachvolley") && (
            <div className="rounded-xl border border-primary/30 bg-secondary/40 p-3">
              <p className="text-xs text-primary">🏐 {t(sport === "beachvolley" ? "vl.beachRules" : "vl.volleyRules")}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{t("vl.tableHint")}</p>
            </div>
          )}
          <label className="block text-xs text-muted-foreground">{t("nt.format")}</label>
          <select
            className="field"
            value={format}
            onChange={(e) => setFormat(e.target.value as "single" | "singleko" | "groups")}
          >
            <option value="single">{t("nt.fmtSingle")}</option>
            <option value="singleko">{t("nt.fmtSingleKo")}</option>
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
