import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Share2 } from "lucide-react";
import { LogoPicker } from "@/components/LogoPicker";
import { ShareDialog } from "@/components/ShareDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TEAM_LOGOS, renderTeamLogo } from "@/data/teamLogos";
import { getCountries, countryName, flagFor } from "@/lib/countries";
import { useI18n } from "@/lib/i18n";
import { pushTournament } from "@/lib/cloud";
import { ageFrom, readCircleImage } from "@/lib/media";
import { getSport, isFootball, variantLabel } from "@/lib/sports";
import {
  emptyBasket,
  formatBasketClock,
  isBasket,
  periodSeconds,
  playerFouls,
  teamPeriodFouls,
  type BasketState,
} from "@/lib/basket";
import {
  addPoint,
  emptyTennis,
  gamesTotal,
  inTieBreak,
  isRacket,
  pointLabels,
  setsWon,
  type TennisState,
} from "@/lib/tennis";
import {
  addVolleyPoint,
  emptyVolley,
  isBeachVolley,
  isVolley,
  volleyPointsTotal,
  volleyRosterLimit,
  volleySetsWon,
  type VolleyState,
} from "@/lib/volley";
import {
  autoCalendar,
  autoCalendarGroups,
  buildBasketPlayoffs,
  buildKnockout,
  buildKnockoutSingle,
  groupPhaseDone,
  koRoundLabelKey,
  scorers,
  splitGroups,
  standings,
  syncKnockout,
  uid,
  useTournament,
  type EventType,
  type GroupId,
  type Match,
  type Player,
  type Team,
  type Tournament,
} from "@/lib/store";

export const Route = createFileRoute("/torneo/$id")({
  head: () => ({
    meta: [
      { title: "Torneo — Master League Tornei" },
      {
        name: "description",
        content: "Squadre, giocatori, calendario, partite live, classifiche e locandina del torneo.",
      },
      { property: "og:title", content: "Torneo — Master League Tornei" },
      {
        property: "og:description",
        content: "Gestisci squadre, calendario, live e classifiche del tuo torneo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TournamentPage,
});

const TABS = [
  { id: "squadre", key: "tab.teams", icon: "👥" },
  { id: "calendario", key: "tab.calendar", icon: "📅" },
  { id: "live", key: "tab.live", icon: "🔴" },
  { id: "classifica", key: "tab.table", icon: "🏅" },
  { id: "finale", key: "tab.final", icon: "🏆" },
  { id: "cassa", key: "tab.money", icon: "💶" },
  { id: "locandina", key: "tab.poster", icon: "🖼️" },
] as const;

function TournamentPage() {
  const { id } = Route.useParams();
  const { tournament, ready, patch } = useTournament(id);
  const { t: tr, sportName } = useI18n();
  const [tab, setTab] = useState<string>("squadre");
  const [openMatch, setOpenMatch] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") setShareUrl(window.location.href);
  }, [id]);

  if (!ready) return <div className="p-8 text-center text-muted-foreground">{tr("common.loading")}</div>;
  if (!tournament)
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">{tr("t.notFound")}</p>
        <Link to="/" className="btn-gold mt-4 inline-block px-5 py-2">
          {tr("common.home")}
        </Link>
      </div>
    );

  const sport = getSport(tournament.sport);

  return (
    <main className="mx-auto min-h-screen w-full max-w-lg px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-6">
      <Link to="/" className="text-sm text-muted-foreground">
        {tr("common.back")}
      </Link>

      <header className="card-night mt-3 flex items-center gap-3 p-4">
        {tournament.logo ? (
          <img src={tournament.logo} alt="" className="h-16 w-16 rounded-full object-cover" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-2xl">
            {sport.icon}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl gold-text">{tournament.name}</h1>
          <p className="text-xs text-muted-foreground">
            {sport.icon} {sportName(sport.id, sport.name)}
          {isFootball(tournament.sport) && variantLabel(tournament.variant)
            ? ` (${variantLabel(tournament.variant)})`
            : ""}{" "}
          · {tournament.city || "—"} ·{" "}
            {tournament.startDate || tr("t.tbd")}
          </p>
        </div>
        <button
          type="button"
          onClick={async () => {
            await pushTournament(tournament);
            setShareUrl(`https://masterleaguetornei.lovable.app/torneo/${tournament.id}`);
            setShareOpen(true);
          }}
          className="btn-gold flex shrink-0 items-center gap-1 self-start px-3 py-2 text-xs font-semibold"
        >
          <Share2 className="h-4 w-4" aria-hidden="true" />
          {tr("home.share")}
        </button>
      </header>

      <ShareDialog open={shareOpen} onOpenChange={setShareOpen} name={tournament.name} url={shareUrl} />


      <nav className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {TABS.filter((x) => x.id !== "finale" || tournament.format === "groups" || tournament.format === "singleko" || isBasket(tournament.sport)).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`shrink-0 px-4 py-2 text-xs font-bold ${
              tab === t.id ? "btn-gold" : "btn-ghost-gold"
            }`}
          >
            {t.icon} {tr(t.key)}
          </button>
        ))}
      </nav>

      <div className="mt-5">
        {tab === "squadre" && <TeamsTab t={tournament} patch={patch} />}
        {tab === "calendario" && (
          <CalendarTab
            t={tournament}
            patch={patch}
            onOpen={(mid) => {
              setOpenMatch(mid);
              setTab("live");
            }}
          />
        )}
        {tab === "live" && <LiveTab t={tournament} patch={patch} initialOpen={openMatch} />}
        {tab === "classifica" && <TableTab t={tournament} patch={patch} />}
        {tab === "finale" && <FinalTab t={tournament} patch={patch} />}
        {tab === "cassa" && <MoneyTab t={tournament} patch={patch} />}
        {tab === "locandina" && <PosterTab t={tournament} />}
      </div>
    </main>
  );
}

type Patch = (fn: (t: Tournament) => Tournament) => void;

const logoSource = (value?: string) => {
  if (!value) return undefined;
  const logo = TEAM_LOGOS.find((item) => item.id === value);
  return logo ? renderTeamLogo(logo) : value;
};

const sportKitIcon = (sportId: string) =>
  isBasket(sportId)
    ? "🎽"
    : isBeachVolley(sportId)
      ? "🏖️"
      : isVolley(sportId)
        ? "🏐"
        : isFootball(sportId)
          ? "👕"
          : getSport(sportId).icon;

/* ---------------- Squadre ---------------- */

function TeamsTab({ t, patch }: { t: Tournament; patch: Patch }) {
  const { t: tr } = useI18n();
  const [name, setName] = useState("");
  const [openTeam, setOpenTeam] = useState<string | null>(null);
  const [logoTeamId, setLogoTeamId] = useState<string | null>(null);

  // Tornei a 2 gironi: se nessuna squadra ha un girone, dividile automaticamente.
  const needsSplit =
    t.format === "groups" && t.teams.length >= 2 && t.teams.every((x) => !x.group);
  useEffect(() => {
    if (needsSplit) patch((cur) => ({ ...cur, teams: splitGroups(cur.teams) }));
  }, [needsSplit, patch]);

  const addTeam = () => {
    if (!name.trim()) return;
    patch((cur) => {
      const auto =
        cur.format === "groups"
          ? {
              group: (cur.teams.filter((x) => x.group === "A").length <=
              cur.teams.filter((x) => x.group === "B").length
                ? "A"
                : "B") as GroupId,
            }
          : {};
      return {
        ...cur,
        teams: [
          ...cur.teams,
          { id: uid(), name: name.trim(), players: [], ...auto },
        ],
      };
    });
    setName("");
  };

  const selectedTeam = t.teams.find((team) => team.id === logoTeamId);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          className="field"
          placeholder={tr("teams.name")}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={addTeam} className="btn-gold shrink-0 px-5">
          +
        </button>
      </div>

      {t.format === "groups" && (
        <div className="card-night space-y-3 p-4">
          <p className="text-sm text-primary">{tr("groups.title")}</p>
          <button
            onClick={() => patch((cur) => ({ ...cur, teams: splitGroups(cur.teams) }))}
            className="btn-gold w-full py-2 text-sm"
            disabled={t.teams.length < 2}
          >
            {tr("groups.split")}
          </button>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {(["A", "B"] as GroupId[]).map((g) => (
              <div
                key={g}
                className={`rounded-xl border p-2 ${
                  g === "A"
                    ? "border-primary/40 bg-primary/10"
                    : "border-emerald-400/40 bg-emerald-400/10"
                }`}
              >
                <p
                  className={`text-[11px] font-bold tracking-widest ${
                    g === "A" ? "text-primary" : "text-emerald-300"
                  }`}
                >
                  {tr(g === "A" ? "groups.a" : "groups.b")} ({t.teams.filter((x) => x.group === g).length})
                </p>
                <ul className="mt-1 space-y-0.5">
                  {t.teams
                    .filter((x) => x.group === g)
                    .map((x) => (
                      <li key={x.id} className="truncate" translate="no">
                        {x.name}
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {t.teams.map((team) => (
        <div key={team.id} className="card-night p-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setLogoTeamId(team.id)}
              aria-label={`${tr("lp.logo")} ${team.name}`}
              className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-primary/40 bg-secondary text-xl"
            >
              {team.logo ? (
                <img
                  src={logoSource(team.logo)}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                sportKitIcon(t.sport)
              )}
            </button>
            <div className="min-w-0 flex-1">
              <p className="display truncate text-primary" translate="no">{team.name}</p>
              <p className="text-xs text-muted-foreground">
                {team.players.length} {tr("teams.players")}
              </p>
              {t.format === "groups" && (
                <select
                  className="mt-1 rounded-lg border border-primary/30 bg-secondary/60 px-2 py-1 text-[11px]"
                  aria-label={tr("groups.move")}
                  value={team.group ?? ""}
                  onChange={(e) =>
                    patch((cur) => ({
                      ...cur,
                      teams: cur.teams.map((x) =>
                        x.id === team.id
                          ? e.target.value
                            ? { ...x, group: e.target.value as GroupId }
                            : (({ group: _g, ...rest }) => rest)(x)
                          : x,
                      ),
                    }))
                  }
                >
                  <option value="">{tr("groups.none")}</option>
                  <option value="A">{tr("groups.a")}</option>
                  <option value="B">{tr("groups.b")}</option>
                </select>
              )}
            </div>
            <button
              onClick={() => setOpenTeam(openTeam === team.id ? null : team.id)}
              className="btn-ghost-gold px-3 py-1 text-xs"
            >
              {openTeam === team.id ? tr("common.close") : tr("teams.roster")}
            </button>
            <button
              onClick={() =>
                patch((cur) => ({ ...cur, teams: cur.teams.filter((x) => x.id !== team.id) }))
              }
              className="text-destructive"
              aria-label={tr("teams.del")}
            >
              🗑
            </button>
          </div>

          {openTeam === team.id && (
            <Roster
              t={t}
              team={team}
              patch={patch}
            />
          )}
        </div>
      ))}

      <Dialog open={Boolean(logoTeamId)} onOpenChange={(open) => !open && setLogoTeamId(null)}>
        <DialogContent className="card-night max-h-[85vh] w-[calc(100%-2rem)] max-w-md overflow-y-auto p-3 sm:p-5">
          <DialogHeader>
            <DialogTitle className="gold-text pr-8">
              {tr("lp.logo")}{selectedTeam ? ` · ${selectedTeam.name}` : ""}
            </DialogTitle>
          </DialogHeader>
          {selectedTeam && (
            <LogoPicker
              value={selectedTeam.logo}
              onChange={(logo) => {
                patch((cur) => ({
                  ...cur,
                  teams: cur.teams.map((team) =>
                    team.id === selectedTeam.id ? { ...team, logo } : team,
                  ),
                }));
                setLogoTeamId(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}



function Roster({ t, team, patch }: { t: Tournament; team: Team; patch: Patch }) {
  const sport = getSport(t.sport);
  const { t: tr, lang, roleName } = useI18n();
  const photoRef = useRef<HTMLInputElement>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string>(team.id);
  const targetTeamId = t.teams.some((x) => x.id === selectedTeamId) ? selectedTeamId : team.id;
  const [draft, setDraft] = useState<Omit<Player, "id">>({
    name: "",
    country: "IT",
    birth: "",
    role: sport.roles[0]!.id,
    paid: false,
    season: "",
  });

  const addPlayer = () => {
    if (!draft.name.trim()) return;
    const target = t.teams.find((x) => x.id === targetTeamId);
    const limit = volleyRosterLimit(t.sport);
    if (limit !== undefined && (target?.players.length ?? 0) >= limit) return;
    patch((cur) => ({
      ...cur,
      teams: cur.teams.map((x) =>
        x.id === targetTeamId
          ? { ...x, players: [...x.players, { ...draft, name: draft.name.trim(), id: uid() }] }
          : x,
      ),
    }));
    setDraft({ name: "", country: "IT", birth: "", season: "", role: sport.roles[0]!.id, paid: false });
  };
  const rosterLimit = volleyRosterLimit(t.sport);
  const targetRosterCount = t.teams.find((x) => x.id === targetTeamId)?.players.length ?? 0;

  return (
    <div className="mt-4 border-t border-primary/15 pt-4">
      <div className="space-y-2">
        <div>
          <p className="text-xs text-muted-foreground">{tr("roster.team")}</p>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {t.teams.map((tm) => {
              const sel = tm.id === targetTeamId;
              return (
                <button
                  key={tm.id}
                  type="button"
                  onClick={() => setSelectedTeamId(tm.id)}
                  className={`flex flex-col items-center gap-1 rounded-xl p-1 transition-transform ${
                    sel
                      ? "scale-110 bg-secondary/60 ring-2 ring-yellow-400"
                      : "opacity-80 hover:opacity-100"
                  }`}
                >
                  <div
                    className={`flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-primary/40 ${
                      tm.color1 ? "" : "bg-slate-700"
                    }`}
                    style={tm.color1 ? { backgroundColor: tm.color1 } : undefined}
                  >
                    {tm.logo ? (
                      <img
                        src={logoSource(tm.logo)}
                        alt=""
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">{sportKitIcon(t.sport)}</span>
                    )}
                  </div>
                  <span
                    className="w-full truncate text-center text-[10px] text-muted-foreground"
                    translate="no"
                  >
                    {tm.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => photoRef.current?.click()}
            className="h-14 w-14 shrink-0 overflow-hidden rounded-full border border-primary/40 bg-secondary text-lg"
          >
            {draft.photo ? (
              <img src={draft.photo} alt="" className="h-full w-full object-cover" />
            ) : (
              "📷"
            )}
          </button>
          <input
            ref={photoRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (f) setDraft({ ...draft, photo: await readCircleImage(f, 200) });
            }}
          />
          <label className="min-w-0 flex-1 text-xs text-muted-foreground">
            {tr("roster.name")}
            <input
              className="field mt-1"
              placeholder={tr("roster.name")}
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />
          </label>
        </div>
        <label className="block text-xs text-muted-foreground">
          {tr("roster.country")}
          <select
            className="field mt-1"
            value={draft.country}
            onChange={(e) => setDraft({ ...draft, country: e.target.value })}
          >
            {getCountries(lang).map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs text-muted-foreground">
          {tr("roster.season")}
          <input
            className="field mt-1"
            placeholder={tr("roster.season")}
            value={draft.season ?? ""}
            onChange={(e) => setDraft({ ...draft, season: e.target.value })}
          />
        </label>
        <div className="flex gap-2">
          <input
            className="field"
            type="date"
            value={draft.birth}
            onChange={(e) => setDraft({ ...draft, birth: e.target.value })}
          />
          <span className="flex items-center whitespace-nowrap text-xs text-muted-foreground">
            {ageFrom(draft.birth) !== null
              ? `${ageFrom(draft.birth)} ${tr("common.years")}`
              : tr("common.age")}
          </span>
        </div>
        <label className="block text-xs text-muted-foreground">
          {tr("roster.foot")}
          <select
            className="field mt-1"
            value={draft.role}
            onChange={(e) => setDraft({ ...draft, role: e.target.value })}
          >
            {sport.roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.icon} {roleName(r.name)}
              </option>
            ))}
          </select>
        </label>
        {rosterLimit !== undefined && targetRosterCount >= rosterLimit && (
          <p className="text-xs text-destructive">{tr("vl.rosterFull", { n: rosterLimit })}</p>
        )}
        <button disabled={rosterLimit !== undefined && targetRosterCount >= rosterLimit} onClick={addPlayer} className="btn-gold w-full py-2 text-sm disabled:opacity-40">
          {tr("roster.add")}
        </button>
      </div>

      <ul className="mt-4 space-y-2">
        {team.players.map((p) => {
          const role = sport.roles.find((r) => r.id === p.role);
          const age = ageFrom(p.birth);
          return (
            <li key={p.id} className="flex items-center gap-3 rounded-xl bg-secondary/50 p-2">
              {p.photo ? (
                <img src={p.photo} alt="" className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
                  {role?.icon ?? "👤"}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  {flagFor(p.country)} {p.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {role?.icon} {role ? roleName(role.name) : ""}
                  {age !== null ? ` · ${age} ${tr("common.years")}` : ""} ·{" "}
                  {countryName(p.country, lang)}
                </p>
              </div>
              <button
                onClick={() =>
                  patch((cur) => ({
                    ...cur,
                    teams: cur.teams.map((x) =>
                      x.id === team.id
                        ? {
                            ...x,
                            players: x.players.map((pl) =>
                              pl.id === p.id ? { ...pl, paid: !pl.paid } : pl,
                            ),
                          }
                        : x,
                    ),
                  }))
                }
                className={`rounded-full px-2 py-1 text-[10px] font-bold ${
                  p.paid ? "bg-primary text-primary-foreground" : "btn-ghost-gold"
                }`}
              >
                {p.paid ? tr("roster.paid") : tr("roster.topay")}
              </button>
              <button
                onClick={() =>
                  patch((cur) => ({
                    ...cur,
                    teams: cur.teams.map((x) =>
                      x.id === team.id
                        ? { ...x, players: x.players.filter((pl) => pl.id !== p.id) }
                        : x,
                    ),
                  }))
                }
                className="text-destructive"
                aria-label={tr("roster.del")}
              >
                ✕
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ---------------- Calendario ---------------- */

function CalendarTab({
  t,
  patch,
  onOpen,
}: {
  t: Tournament;
  patch: Patch;
  onOpen: (id: string) => void;
}) {
  const sport = getSport(t.sport);
  const { t: tr, venueName } = useI18n();
  const [m, setM] = useState({
    teamA: "",
    teamB: "",
    date: t.startDate,
    time: "18:00",
    venue: `${sport.venue} 1`,
    round: 1,
  });

  const add = () => {
    if (!m.teamA || !m.teamB || m.teamA === m.teamB) return;
    patch((cur) => ({
      ...cur,
      matches: [
        ...cur.matches,
        { ...m, id: uid(), scoreA: 0, scoreB: 0, status: "programmata", events: [] } as Match,
      ],
    }));
  };

  const sorted = [...t.matches.filter((x) => !x.ko)].sort((a, b) =>
    `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`),
  );

  return (
    <div className="space-y-4">
      <div className="card-night space-y-2 p-4">
        <p className="text-sm text-primary">{tr("cal.manual")}</p>
        <div className="flex gap-2">
          <select
            className="field"
            value={m.teamA}
            onChange={(e) => setM({ ...m, teamA: e.target.value })}
          >
            <option value="">{tr("cal.team1")}</option>
            {t.teams.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
          </select>
          <select
            className="field"
            value={m.teamB}
            onChange={(e) => setM({ ...m, teamB: e.target.value })}
          >
            <option value="">{tr("cal.team2")}</option>
            {t.teams.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <input
            className="field"
            type="date"
            value={m.date}
            onChange={(e) => setM({ ...m, date: e.target.value })}
          />
          <input
            className="field"
            type="time"
            value={m.time}
            onChange={(e) => setM({ ...m, time: e.target.value })}
          />
        </div>
        <div className="flex gap-2">
          <input
            className="field"
            placeholder={venueName(sport.venue)}
            value={m.venue}
            onChange={(e) => setM({ ...m, venue: e.target.value })}
          />
          <input
            className="field"
            type="number"
            min={1}
            value={m.round}
            onChange={(e) => setM({ ...m, round: Number(e.target.value) })}
          />
        </div>
        <button onClick={add} className="btn-gold w-full py-2 text-sm">
          {tr("cal.add")}
        </button>
      </div>

      <button
        onClick={() =>
          patch((cur) => ({
            ...cur,
            matches:
              cur.format === "groups"
                ? [
                    ...autoCalendarGroups(cur, getSport(cur.sport).venue),
                    ...cur.matches.filter((m) => m.ko),
                  ]
                : autoCalendar(cur.teams, cur.startDate, getSport(cur.sport).venue),
          }))
        }
        className="btn-ghost-gold w-full py-3 text-sm"
      >
        {tr(t.format === "groups" ? "cal.autoGroups" : "cal.auto")}
      </button>

      {sorted.length > 0 && (
        <button
          onClick={() =>
            patch((cur) => ({ ...cur, matches: cur.matches.filter((x) => x.ko) }))
          }
          className="w-full rounded-xl border border-destructive/40 bg-destructive/15 py-3 text-sm font-semibold text-destructive"
        >
          🗑️ {tr("cal.clearAll")}
        </button>
      )}

      <div className="space-y-2">
        {sorted.map((match) => (
          <div
            key={match.id}
            role="button"
            tabIndex={0}
            onClick={() => onOpen(match.id)}
            onKeyDown={(e) => e.key === "Enter" && onOpen(match.id)}
            className="card-night relative cursor-pointer p-3 pr-14"
          >
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
              {match.group ? `${tr(match.group === "A" ? "groups.a" : "groups.b")} · ` : ""}
              {tr("cal.round")} {match.round} · {match.date} {match.time} · {match.venue}
            </p>
            <p className="mt-1 text-sm font-semibold">
              {nameOf(t, match.teamA)} <span className="text-primary">{tr("cal.vs")}</span>{" "}
              {nameOf(t, match.teamB)}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                patch((cur) => ({ ...cur, matches: cur.matches.filter((x) => x.id !== match.id) }));
              }}
              aria-label={tr("cal.delMatch")}
              title={tr("cal.delMatch")}
              className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-red-500/15 text-destructive"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const nameOf = (t: Tournament, id: string) => t.teams.find((x) => x.id === id)?.name ?? "—";

/* ---------------- Live ---------------- */

function LiveTab({
  t,
  patch,
  initialOpen,
}: {
  t: Tournament;
  patch: Patch;
  initialOpen?: string | null;
}) {
  const [openId, setOpenId] = useState<string | null>(initialOpen ?? null);
  const sport = getSport(t.sport);
  const racket = isRacket(t.sport);
  const basket = isBasket(t.sport);
  const volley = isVolley(t.sport);
  const { t: tr, scoreName } = useI18n();
  const statusLabel = (s: string) =>
    s === "live" ? tr("live.live") : s === "finita" ? tr("live.ended") : tr("live.scheduled");

  const setMatch = (id: string, fn: (m: Match) => Match) =>
    patch((cur) => ({ ...cur, matches: cur.matches.map((m) => (m.id === id ? fn(m) : m)) }));

  if (t.matches.length === 0)
    return (
      <p className="card-night p-6 text-center text-sm text-muted-foreground">
        {tr("live.none")}
      </p>
    );

  return (
    <div className="space-y-3">
      {t.matches.map((m) => {
        const open = openId === m.id;
        return (
          <div key={m.id} className="card-night p-4">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-widest">
              <span className="text-muted-foreground">
                G{m.round} · {m.date} {m.time}
              </span>
              <span
                className={
                  m.status === "live"
                    ? "font-bold text-destructive"
                    : m.status === "finita"
                      ? "text-muted-foreground"
                      : "text-primary"
                }
              >
                {m.status === "live" ? `● ${tr("live.live").toUpperCase()}` : statusLabel(m.status)}
              </span>
            </div>

            <div className="mt-2 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
              <p className="text-right text-sm font-semibold">{nameOf(t, m.teamA)}</p>
              <p className="display text-2xl text-primary">
                {m.scoreA} - {m.scoreB}
              </p>
              <p className="text-sm font-semibold">{nameOf(t, m.teamB)}</p>
            </div>

            {racket ? (
              <TennisBoard m={m} setMatch={setMatch} />
            ) : basket ? (
              <BasketBoard t={t} m={m} setMatch={setMatch} />
            ) : volley ? (
              <VolleyBoard sportId={t.sport} m={m} setMatch={setMatch} />
            ) : (
              <div className="mt-3 flex justify-center gap-2">
                <button
                  onClick={() => setMatch(m.id, (x) => ({ ...x, scoreA: Math.max(0, x.scoreA - 1) }))}
                  className="btn-ghost-gold px-3"
                >
                  −
                </button>
                <button
                  onClick={() => setMatch(m.id, (x) => ({ ...x, scoreA: x.scoreA + 1 }))}
                  className="btn-gold px-3"
                >
                  {tr("live.home", { label: scoreName(sport.scoreLabel) })}
                </button>
                <button
                  onClick={() => setMatch(m.id, (x) => ({ ...x, scoreB: x.scoreB + 1 }))}
                  className="btn-gold px-3"
                >
                  {tr("live.away")}
                </button>
                <button
                  onClick={() => setMatch(m.id, (x) => ({ ...x, scoreB: Math.max(0, x.scoreB - 1) }))}
                  className="btn-ghost-gold px-3"
                >
                  −
                </button>
              </div>
            )}

            <div className="mt-3 flex gap-2 text-xs">
              {(["programmata", "live", "finita"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setMatch(m.id, (x) => {
                    if (basket && s === "finita" && x.scoreA === x.scoreB) {
                      const state = x.basket ?? emptyBasket();
                      const period = Math.max(5, state.period + 1);
                      return {
                        ...x,
                        status: "live",
                        basket: { ...state, period, clockSeconds: periodSeconds(period), running: false },
                      };
                    }
                    return { ...x, status: s };
                  })}
                  className={`flex-1 py-1 ${m.status === s ? "btn-gold" : "btn-ghost-gold"}`}
                >
                  {statusLabel(s)}
                </button>
              ))}
            </div>

            <button
              onClick={() => setOpenId(open ? null : m.id)}
              className="mt-3 w-full text-xs text-muted-foreground"
            >
              {open ? tr("live.hide") : tr("live.events", { n: m.events.length })}
            </button>

            {open && <Events t={t} m={m} setMatch={setMatch} />}
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- Volley / Beach Volley ---------------- */

function VolleyBoard({ sportId, m, setMatch }: { sportId: string; m: Match; setMatch: (id: string, fn: (x: Match) => Match) => void }) {
  const { t: tr } = useI18n();
  const state: VolleyState = m.volley ?? emptyVolley();
  const beach = isBeachVolley(sportId);
  const apply = (next: VolleyState) => setMatch(m.id, (current) => {
    const wins = volleySetsWon(next);
    const points = volleyPointsTotal(next);
    return { ...current, volley: next, scoreA: wins.a, scoreB: wins.b, gamesA: points.a, gamesB: points.b, status: next.done ? "finita" : "live" };
  });
  return (
    <div className="mt-3 rounded-xl border border-primary/30 bg-secondary/40 p-3">
      <p className="text-center text-[11px] uppercase text-muted-foreground">{tr("vl.current")} {state.sets.length + 1}</p>
      <div className="mt-1 grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-center">
        <p className="display text-4xl text-primary">{state.pointsA}</p><span className="text-muted-foreground">-</span><p className="display text-4xl text-primary">{state.pointsB}</p>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button disabled={state.done} onClick={() => apply(addVolleyPoint(state, "a", beach))} className="btn-gold py-2 text-xs disabled:opacity-40">+ {tr("vl.pointHome")}</button>
        <button disabled={state.done} onClick={() => apply(addVolleyPoint(state, "b", beach))} className="btn-gold py-2 text-xs disabled:opacity-40">+ {tr("vl.pointAway")}</button>
      </div>
      <div className="mt-3 space-y-1 text-xs">
        {state.sets.map((set, index) => <div key={index} className="flex justify-between"><span className="text-muted-foreground">{tr("vl.set")} {index + 1}</span><strong className="text-primary">{set.a} - {set.b}</strong></div>)}
      </div>
      <p className="mt-3 text-center text-[11px] text-muted-foreground">{tr(beach ? "vl.beachRules" : "vl.volleyRules")}</p>
      <button onClick={() => apply(emptyVolley())} className="btn-ghost-gold mt-2 w-full py-2 text-xs">{tr("vl.reset")}</button>
    </div>
  );
}

/* ---------------- Basket ---------------- */

function BasketBoard({
  t,
  m,
  setMatch,
}: {
  t: Tournament;
  m: Match;
  setMatch: (id: string, fn: (x: Match) => Match) => void;
}) {
  const { t: tr } = useI18n();
  const state: BasketState = m.basket ?? emptyBasket();
  const roster = t.teams
    .filter((team) => team.id === m.teamA || team.id === m.teamB)
    .flatMap((team) => team.players.map((player) => ({ player, team })));
  const eligible = roster.filter(({ player }) => playerFouls(state, player.id) < 5);
  const [playerId, setPlayerId] = useState(eligible[0]?.player.id ?? "");

  useEffect(() => {
    if (!state.running || state.clockSeconds <= 0) return;
    const timer = window.setInterval(() => {
      setMatch(m.id, (current) => {
        const basket = current.basket ?? emptyBasket();
        if (!basket.running || basket.clockSeconds <= 0) return current;
        const clockSeconds = basket.clockSeconds - 1;
        return {
          ...current,
          status: "live",
          basket: { ...basket, clockSeconds, running: clockSeconds > 0 },
        };
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [m.id, setMatch, state.running, state.clockSeconds]);

  const updateBasket = (fn: (basket: BasketState) => BasketState) =>
    setMatch(m.id, (current) => ({ ...current, basket: fn(current.basket ?? emptyBasket()) }));
  const addScore = (side: "A" | "B", points: number) =>
    setMatch(m.id, (current) => ({
      ...current,
      status: "live",
      [side === "A" ? "scoreA" : "scoreB"]: current[side === "A" ? "scoreA" : "scoreB"] + points,
    }));
  const nextPeriod = () => {
    if (state.clockSeconds > 0) return;
    if (state.period < 4 || m.scoreA === m.scoreB) {
      updateBasket((basket) => {
        const period = basket.period + 1;
        return { ...basket, period, clockSeconds: periodSeconds(period), running: false };
      });
    } else {
      setMatch(m.id, (current) => ({ ...current, status: "finita" }));
    }
  };
  const addFoul = () => {
    const found = roster.find(({ player }) => player.id === playerId);
    if (!found || playerFouls(state, found.player.id) >= 5) return;
    updateBasket((basket) => ({
      ...basket,
      fouls: [...basket.fouls, { id: uid(), playerId, teamId: found.team.id, period: basket.period }],
    }));
  };
  const periodLabel = state.period <= 4
    ? tr("bk.quarter", { n: state.period })
    : tr("bk.overtime", { n: state.period - 4 });

  return (
    <div className="mt-3 rounded-xl border border-primary/30 bg-secondary/40 p-3">
      <div className="flex items-center justify-between text-xs font-bold text-primary">
        <span>{periodLabel}</span>
        <span className="display text-3xl tabular-nums">{formatBasketClock(state.clockSeconds)}</span>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {(["A", "B"] as const).map((side) => (
          <div key={side} className="grid grid-cols-3 gap-1">
            {[1, 2, 3].map((points) => (
              <button key={points} onClick={() => addScore(side, points)} className="btn-gold py-2 text-xs">
                +{points}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2 text-center text-[11px]">
        {[m.teamA, m.teamB].map((teamId) => {
          const fouls = teamPeriodFouls(state, teamId);
          return <p key={teamId} className={fouls >= 5 ? "font-bold text-destructive" : "text-muted-foreground"}>
            {fouls} {tr("bk.foul")} {fouls >= 5 ? `· ${tr("bk.bonus")}` : ""}
          </p>;
        })}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          onClick={() => updateBasket((basket) => ({ ...basket, running: !basket.running }))}
          disabled={state.clockSeconds === 0}
          className="btn-ghost-gold py-2 text-xs disabled:opacity-40"
        >
          {state.running ? `⏸ ${tr("bk.pause")}` : `▶ ${tr("bk.start")}`}
        </button>
        <button onClick={nextPeriod} disabled={state.clockSeconds > 0} className="btn-ghost-gold py-2 text-xs disabled:opacity-40">
          {tr("bk.next")}
        </button>
      </div>
      {roster.length ? (
        <div className="mt-3 flex gap-2">
          <select className="field" value={playerId} onChange={(event) => setPlayerId(event.target.value)}>
            {roster.map(({ player, team }) => (
              <option key={player.id} value={player.id} disabled={playerFouls(state, player.id) >= 5}>
                {player.name} · {team.name} · {playerFouls(state, player.id)}/5
              </option>
            ))}
          </select>
          <button onClick={addFoul} className="btn-gold shrink-0 px-3 text-xs">+ {tr("bk.foul")}</button>
        </div>
      ) : <p className="mt-3 text-xs text-muted-foreground">{tr("bk.noPlayers")}</p>}
      {roster.filter(({ player }) => playerFouls(state, player.id) >= 5).map(({ player }) => (
        <p key={player.id} className="mt-1 text-xs text-destructive">{player.name}: {tr("bk.fouledOut")}</p>
      ))}
      <p className="mt-3 text-center text-[11px] text-muted-foreground">{tr("bk.rules")}</p>
      <button
        onClick={() => setMatch(m.id, (current) => ({ ...current, scoreA: 0, scoreB: 0, status: "programmata", basket: emptyBasket() }))}
        className="btn-ghost-gold mt-2 w-full py-2 text-xs"
      >
        {tr("bk.reset")}
      </button>
    </div>
  );
}

/* ---------------- Tennis / Padel ---------------- */

function TennisBoard({
  m,
  setMatch,
}: {
  m: Match;
  setMatch: (id: string, fn: (x: Match) => Match) => void;
}) {
  const { t: tr } = useI18n();
  const st: TennisState = m.tennis ?? emptyTennis();
  const [la, lb] = pointLabels(st);
  const tie = inTieBreak(st);

  const apply = (next: TennisState) =>
    setMatch(m.id, (x) => {
      const w = setsWon(next);
      const g = gamesTotal(next);
      return {
        ...x,
        tennis: next,
        scoreA: w.a,
        scoreB: w.b,
        gamesA: g.a,
        gamesB: g.b,
        status: next.done ? "finita" : x.status === "programmata" ? "live" : x.status,
      };
    });

  return (
    <div className="mt-3 rounded-xl border border-primary/20 bg-secondary/40 p-3">
      <p className="text-center text-[11px] uppercase tracking-widest text-muted-foreground">
        {tie ? tr("tn.tiebreak") : tr("tn.game")}
      </p>
      <div className="mt-1 grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-center">
        <p className="display text-3xl text-primary">{la}</p>
        <span className="text-muted-foreground">·</span>
        <p className="display text-3xl text-primary">{lb}</p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          onClick={() => apply(addPoint(st, "a"))}
          disabled={st.done}
          className="btn-gold py-2 text-xs disabled:opacity-40"
        >
          + {tr("tn.pointHome")}
        </button>
        <button
          onClick={() => apply(addPoint(st, "b"))}
          disabled={st.done}
          className="btn-gold py-2 text-xs disabled:opacity-40"
        >
          + {tr("tn.pointAway")}
        </button>
      </div>

      <div className="mt-3 space-y-1 text-xs">
        {st.sets.map((s, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className="text-muted-foreground">
              {tr("tn.set")} {i + 1}
            </span>
            <span className="font-bold text-primary">
              {s.a} - {s.b}
              {s.tbA !== undefined ? ` (${s.tbA}-${s.tbB})` : ""}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-2 text-center text-[11px] text-muted-foreground">{tr("tn.rules")}</p>

      <button
        onClick={() => apply(emptyTennis())}
        className="btn-ghost-gold mt-2 w-full py-2 text-xs"
      >
        {tr("tn.reset")}
      </button>
    </div>
  );
}

const EV_ICON: Record<EventType, string> = {
  goal: "⚽",
  owngoal: "🥅",
  pengoal: "🎯",
  pensaved: "🧤",
  penmissed: "❌",
  yellow: "🟨",
  red: "🟥",
  dblyellow: "🟨🟥",
  sub: "🔄",
  mvp: "⭐",
};

const FOOTBALL_EVENTS: EventType[] = [
  "goal",
  "owngoal",
  "pengoal",
  "pensaved",
  "penmissed",
  "yellow",
  "red",
  "dblyellow",
  "sub",
  "mvp",
];

const BASIC_EVENTS: EventType[] = ["goal", "yellow", "red", "mvp"];

/** Un evento che segna: +1 alla squadra del giocatore, l'autogol all'avversaria. */
const scoreDelta = (type: EventType, teamId: string, m: Match, sign: 1 | -1) => {
  if (type === "goal" || type === "pengoal") {
    return teamId === m.teamA ? { scoreA: m.scoreA + sign } : { scoreB: m.scoreB + sign };
  }
  if (type === "owngoal") {
    return teamId === m.teamA ? { scoreB: m.scoreB + sign } : { scoreA: m.scoreA + sign };
  }
  return {};
};

function Events({
  t,
  m,
  setMatch,
}: {
  t: Tournament;
  m: Match;
  setMatch: (id: string, fn: (m: Match) => Match) => void;
}) {
  const { t: tr } = useI18n();
  const football = isFootball(t.sport);
  const roster = t.teams
    .filter((x) => x.id === m.teamA || x.id === m.teamB)
    .flatMap((x) => x.players.map((p) => ({ p, team: x })));
  const [playerId, setPlayerId] = useState(roster[0]?.p.id ?? "");
  const [type, setType] = useState<EventType>("goal");
  const [minute, setMinute] = useState("");

  const types = football ? FOOTBALL_EVENTS : BASIC_EVENTS;
  const count = (k: EventType) => m.events.filter((e) => e.type === k).length;

  const addEvent = (kind: EventType) => {
    const found = roster.find((r) => r.p.id === playerId);
    if (!found) return;
    setMatch(m.id, (x) => ({
      ...x,
      ...scoreDelta(kind, found.team.id, x, 1),
      events: [...x.events, { id: uid(), playerId, teamId: found.team.id, type: kind, minute }],
    }));
    setMinute("");
  };

  const ordered = [...m.events].sort(
    (a, b) => (Number(a.minute) || 999) - (Number(b.minute) || 999),
  );

  return (
    <div className="mt-3 border-t border-primary/15 pt-3">
      <div className="flex gap-2">
        <select className="field" value={playerId} onChange={(e) => setPlayerId(e.target.value)}>
          {roster.map(({ p, team }) => (
            <option key={p.id} value={p.id}>
              {p.name} ({team.name})
            </option>
          ))}
        </select>
        <input
          className="field w-20"
          placeholder={tr("ev.minute")}
          inputMode="numeric"
          value={minute}
          onChange={(e) => setMinute(e.target.value)}
        />
      </div>

      {roster.length === 0 && (
        <p className="mt-2 text-xs text-muted-foreground">{tr("ev.noPlayers")}</p>
      )}

      {football ? (
        <div className="mt-2 grid grid-cols-2 gap-2">
          {types.map((k) => (
            <button
              key={k}
              onClick={() => addEvent(k)}
              disabled={roster.length === 0}
              className="btn-ghost-gold flex items-center gap-2 px-2 py-2 text-left text-xs disabled:opacity-40"
            >
              <span>{EV_ICON[k]}</span>
              <span className="truncate">{tr(`ev.${k}`)}</span>
            </button>
          ))}
        </div>
      ) : (
        <>
          <select
            className="field mt-2"
            value={type}
            onChange={(e) => setType(e.target.value as EventType)}
          >
            {types.map((k) => (
              <option key={k} value={k}>
                {EV_ICON[k]} {tr(`ev.${k}`)}
              </option>
            ))}
          </select>
          <button onClick={() => addEvent(type)} className="btn-gold mt-2 w-full py-2 text-sm">
            {tr("ev.add")}
          </button>
        </>
      )}

      {football && (
        <div className="mt-3 flex justify-center gap-3 text-xs text-muted-foreground">
          <span>🟨 {count("yellow") + count("dblyellow")}</span>
          <span>🟥 {count("red") + count("dblyellow")}</span>
          <span>🎯 {count("pengoal") + count("pensaved") + count("penmissed")}</span>
          <span>🥅 {count("owngoal")}</span>
        </div>
      )}

      <ul className="mt-3 space-y-1 text-xs">
        {ordered.map((e) => {
          const found = roster.find((r) => r.p.id === e.playerId);
          return (
            <li key={e.id} className="flex items-center gap-2">
              <span className="w-8 text-right text-primary">{e.minute ? `${e.minute}'` : "—"}</span>
              <span>{EV_ICON[e.type]}</span>
              <span className="flex-1 truncate">
                {tr(`ev.${e.type}`)} · {found?.p.name ?? "—"}
              </span>
              <button
                onClick={() =>
                  setMatch(m.id, (x) => ({
                    ...x,
                    ...scoreDelta(e.type, e.teamId, x, -1),
                    events: x.events.filter((ev) => ev.id !== e.id),
                  }))
                }
                aria-label={tr("ev.del")}
                title={tr("ev.del")}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500/15 text-destructive"
              >
                🗑️
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ---------------- Classifica ---------------- */

function StandingsTable({
  t,
  group,
  patch,
}: {
  t: Tournament;
  group?: GroupId;
  patch: Patch;
}) {
  const { t: tr } = useI18n();
  const sport = getSport(t.sport);
  const rows = standings(t, sport.winPoints, sport.drawPoints, group);
  const basket = isBasket(t.sport);
  const volley = isVolley(t.sport);
  const volleyRows = volley ? rows.map((row) => {
    let sf = 0, sa = 0, pf = 0, pa = 0, pts = 0;
    t.matches.filter((m) => m.status === "finita" && !m.ko && (!group || m.group === group) && (m.teamA === row.team.id || m.teamB === row.team.id)).forEach((m) => {
      const home = m.teamA === row.team.id;
      const ownSets = home ? m.scoreA : m.scoreB, otherSets = home ? m.scoreB : m.scoreA;
      const ownPoints = home ? (m.gamesA ?? 0) : (m.gamesB ?? 0), otherPoints = home ? (m.gamesB ?? 0) : (m.gamesA ?? 0);
      sf += ownSets; sa += otherSets; pf += ownPoints; pa += otherPoints;
      if (ownSets > otherSets) pts += isBeachVolley(t.sport) ? 2 : otherSets === 2 ? 2 : 3;
      else if (!isBeachVolley(t.sport) && ownSets === 2) pts += 1;
    });
    return { ...row, sf, sa, pf, pa, pts };
  }).sort((a, b) => b.pts - a.pts || (b.sf - b.sa) - (a.sf - a.sa) || (b.pa ? b.pf / b.pa : b.pf) - (a.pa ? a.pf / a.pa : a.pf)) : [];
  const shownRows = volley ? volleyRows : rows;
  const accent = group === "B" ? "text-emerald-300" : "text-primary";

  return (
    <div
      className={`card-night ${basket ? "overflow-x-auto" : "overflow-hidden"} ${
        group === "B" ? "border border-emerald-400/30" : group === "A" ? "border border-primary/30" : ""
      }`}
    >
      {group && (
        <p className={`px-3 pt-3 text-[11px] font-bold tracking-widest ${accent}`}>
          {tr(group === "A" ? "groups.a" : "groups.b")}
        </p>
      )}
      <table className={`${basket || volley ? "min-w-[34rem]" : "w-full"} text-xs`}>
        <thead className="bg-secondary/70 text-muted-foreground">
          <tr>
            <th className="p-2 text-left">#</th>
            <th className="p-2 text-left">{tr("tbl.team")}</th>
            {!basket && <th className="p-2">{tr("tbl.g")}</th>}
            <th className="p-2">{tr("tbl.v")}</th>
            {sport.hasDraw && <th className="p-2">{tr("tbl.n")}</th>}
            <th className="p-2">{tr("tbl.p")}</th>
            {basket ? (
              <>
                <th className="p-2">{tr("bk.pf")}</th><th className="p-2">{tr("bk.pa")}</th>
                <th className="p-2">{tr("bk.diff")}</th><th className={`p-2 ${accent}`}>{tr("bk.winPct")}</th>
              </>
            ) : volley ? <><th className="p-2">{tr("vl.setsFor")}</th><th className="p-2">{tr("vl.setsAgainst")}</th><th className="p-2">{tr("vl.quotient")}</th><th className={`p-2 ${accent}`}>{tr("tbl.pts")}</th></> : <><th className="p-2">+/−</th><th className={`p-2 ${accent}`}>{tr("tbl.pts")}</th></>}
            <th className="p-2" />

          </tr>
        </thead>
        <tbody>
          {shownRows.map((r, i) => (
            <tr key={r.team.id} className="border-t border-primary/10">
              <td className={`p-2 ${accent}`}>{i + 1}</td>
              <td className="flex items-center gap-2 p-2">
                {r.team.logo && (
                  <img src={r.team.logo} alt="" className="h-5 w-5 rounded-full object-cover" />
                )}
                <span className="truncate" translate="no">{r.team.name}</span>
              </td>
              {!basket && <td className="p-2 text-center">{r.g}</td>}
              <td className="p-2 text-center">{r.v}</td>
              {sport.hasDraw && <td className="p-2 text-center">{r.n}</td>}
              <td className="p-2 text-center">{r.p}</td>
              {basket ? (
                <>
                  <td className="p-2 text-center">{r.gf}</td><td className="p-2 text-center">{r.gs}</td>
                  <td className="p-2 text-center">{r.gf - r.gs}</td>
                  <td className={`p-2 text-center font-bold ${accent}`}>{r.g ? `${Math.round((r.v / r.g) * 100)}%` : "0%"}</td>
                </>
              ) : volley ? <><td className="p-2 text-center">{r.sf ?? 0}</td><td className="p-2 text-center">{r.sa ?? 0}</td><td className="p-2 text-center">{r.pa ? ((r.pf ?? 0) / r.pa).toFixed(3) : r.pf ? "∞" : "0.000"}</td><td className={`p-2 text-center font-bold ${accent}`}>{r.pts}</td></> : <><td className="p-2 text-center">{r.gf - r.gs}</td><td className={`p-2 text-center font-bold ${accent}`}>{r.pts}</td></>}
              <td className="p-2 text-right">
                <button
                  onClick={() =>
                    patch((cur) => ({
                      ...cur,
                      teams: cur.teams.filter((x) => x.id !== r.team.id),
                      matches: cur.matches.filter(
                        (m) => m.teamA !== r.team.id && m.teamB !== r.team.id,
                      ),
                    }))
                  }
                  aria-label={tr("teams.del")}
                  title={tr("teams.del")}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/15 text-destructive"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isRacket(t.sport) && (
        <p className="px-3 pb-3 text-[11px] text-muted-foreground">{tr("tn.tableHint")}</p>
      )}
      {basket && <p className="px-3 pb-3 text-[11px] text-muted-foreground">{tr("bk.tableHint")}</p>}
      {volley && <p className="px-3 pb-3 text-[11px] text-muted-foreground">{tr("vl.tableHint")}</p>}
      {shownRows.length === 0 && (
        <p className="p-4 text-center text-sm text-muted-foreground">{tr("tbl.noTeams")}</p>
      )}
    </div>
  );
}

function TableTab({ t, patch }: { t: Tournament; patch: Patch }) {
  const { t: tr } = useI18n();
  const top = scorers(t);

  return (
    <div className="space-y-5">
      {t.format === "groups" ? (
        <div className="-mx-1 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <StandingsTable t={t} group="A" patch={patch} />
          <StandingsTable t={t} group="B" patch={patch} />
        </div>
      ) : (
        <StandingsTable t={t} patch={patch} />
      )}

      {!isBasket(t.sport) && !isVolley(t.sport) && <div className="card-night p-4">
        <h2 className="text-sm text-primary">{tr("tbl.scorers")}</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {top.map((s) => (
            <li key={s.player.id} className="flex items-center gap-2">
              {s.player.photo ? (
                <img src={s.player.photo} alt="" className="h-8 w-8 rounded-full object-cover" />
              ) : (
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent">
                  👤
                </span>
              )}
              <span className="flex-1 truncate">
                {flagFor(s.player.country)} {s.player.name}{" "}
                <span className="text-xs text-muted-foreground">· {s.team.name}</span>
              </span>
              <span className="text-primary">⚽ {s.goals}</span>
              <span className="text-primary">⭐ {s.mvp}</span>
            </li>
          ))}
          {top.length === 0 && (
            <p className="text-xs text-muted-foreground">{tr("tbl.noEvents")}</p>
          )}
        </ul>
      </div>}
    </div>
  );
}

/* ---------------- Fase finale ---------------- */

function FinalTab({ t, patch }: { t: Tournament; patch: Patch }) {
  const { t: tr } = useI18n();
  const sport = getSport(t.sport);
  const basket = isBasket(t.sport);
  const singleKo = t.format === "singleko";
  const ko = t.matches.filter((m) => m.ko);
  const ready = basket
    ? t.teams.length >= 8 && t.matches.some((m) => !m.ko) && t.matches.filter((m) => !m.ko).every((m) => m.status === "finita")
    : groupPhaseDone(t);
  const perGroup = Math.min(
    t.teams.filter((x) => x.group === "A").length,
    t.teams.filter((x) => x.group === "B").length,
  );
  const options = singleKo
    ? [2, 4, 8, 16].filter((n) => n <= t.teams.length)
    : [1, 2, 4, 8].filter((q) => q <= perGroup);
  const [q, setQ] = useState<number>(singleKo ? 4 : (t.qualifiers ?? 2));
  const [err, setErr] = useState("");

  const generate = () => {
    const built = basket
      ? buildBasketPlayoffs(t)
      : singleKo
        ? buildKnockoutSingle(t, q, sport.winPoints, sport.drawPoints)
        : buildKnockout(t, q, sport.winPoints, sport.drawPoints);
    if (built.length === 0) {
      setErr(tr("final.needTeams"));
      return;
    }
    setErr("");
    patch((cur) => ({
      ...cur,
      qualifiers: q,
      matches: [...cur.matches.filter((m) => !m.ko), ...built],
    }));
  };

  const setMatch = (id: string, fn: (m: Match) => Match) =>
    patch((cur) => ({
      ...cur,
      matches: syncKnockout(cur.matches.map((m) => (m.id === id ? fn(m) : m))),
    }));

  if (!ready && ko.length === 0)
    return (
      <p className="card-night p-6 text-center text-sm text-muted-foreground">
        {tr(basket ? "bk.needEight" : "final.notReady")}
      </p>
    );

  const total = ko.length ? Math.max(...ko.map((m) => m.ko!.round)) : 0;
  const rounds = Array.from({ length: total }, (_, i) => i + 1);
  const finalMatch = ko.find((m) => m.ko!.round === total && m.ko!.kind !== "third");
  const champion =
    finalMatch && finalMatch.status === "finita" && finalMatch.scoreA !== finalMatch.scoreB
      ? nameOf(t, finalMatch.scoreA > finalMatch.scoreB ? finalMatch.teamA : finalMatch.teamB)
      : "";

  return (
    <div className="space-y-4">
      <div className="card-night space-y-3 border border-emerald-400/30 p-4">
        <p className="text-sm font-bold tracking-widest text-primary">🏆 {tr("final.title")}</p>
        <label className="block text-xs text-muted-foreground">
          {basket ? tr("bk.playoffs") : tr("final.qualifiers")}
          {!basket && (
          <select
            className="field mt-1"
            value={q}
            onChange={(e) => setQ(Number(e.target.value))}
          >
            {(options.length ? options : [1]).map((n) => (
              <option key={n} value={n}>
                {tr(singleKo ? "final.qualN" : "final.topN", { n })}
              </option>
            ))}
          </select>
          )}
        </label>
        <button onClick={generate} className="btn-gold w-full py-2 text-sm">
          {ko.length ? tr("final.reset") : tr("final.generate")}
        </button>
        {ko.length > 0 && (
          <button
            onClick={() => patch((cur) => ({ ...cur, matches: cur.matches.filter((m) => !m.ko) }))}
            className="w-full rounded-xl border border-destructive/40 bg-destructive/15 py-2 text-sm font-semibold text-destructive"
          >
            🗑️ {tr("final.clearAll")}
          </button>
        )}
        {err && <p className="text-xs text-destructive">{err}</p>}
      </div>

      {champion && (
        <p className="rounded-xl border border-primary/50 bg-gradient-to-r from-primary/20 to-emerald-400/15 p-4 text-center text-lg font-bold text-primary">
          🏆 {tr("final.champion")}: <span translate="no">{champion}</span>
        </p>
      )}

      <div className="-mx-4 overflow-x-auto px-4 pb-2">
        <div className="flex min-w-max items-stretch gap-3">
          {rounds.map((r) => {
            const list = ko
              .filter((m) => m.ko!.round === r)
              .sort((a, b) => a.ko!.index - b.ko!.index);
            return (
              <div key={r} className="flex w-56 shrink-0 flex-col justify-around gap-3">
                <p className="text-center text-[11px] font-bold uppercase tracking-widest text-emerald-300">
                  {tr(koRoundLabelKey(r, total))}
                </p>
                {list.map((m) => (
                  <KoCard
                    key={m.id}
                    t={t}
                    m={m}
                    total={total}
                    hasPrev={r > 1 && m.ko!.kind !== "third"}
                    hasNext={r < total && m.ko!.kind !== "third"}
                    setMatch={setMatch}
                    onDelete={() =>
                      patch((cur) => ({
                        ...cur,
                        matches: cur.matches.filter((x) => x.id !== m.id),
                      }))
                    }
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function KoCard({
  t,
  m,
  total,
  hasPrev,
  hasNext,
  setMatch,
  onDelete,
}: {
  t: Tournament;
  m: Match;
  total: number;
  hasPrev?: boolean;
  hasNext?: boolean;
  setMatch: (id: string, fn: (m: Match) => Match) => void;
  onDelete: () => void;
}) {
  const { t: tr } = useI18n();
  const isThird = m.ko?.kind === "third";
  const label = (id: string) => (id ? nameOf(t, id) : tr("final.tbd"));

  return (
    <div
      className={`relative rounded-xl border p-3 ${
        isThird
          ? "border-primary/30 bg-secondary/40"
          : "border-emerald-400/40 bg-gradient-to-br from-emerald-400/10 to-primary/10"
      }`}
    >
      {hasPrev && (
        <span className="absolute -left-3 top-1/2 h-px w-3 bg-emerald-400/50" aria-hidden />
      )}
      {hasNext && (
        <span className="absolute -right-3 top-1/2 h-px w-3 bg-emerald-400/50" aria-hidden />
      )}
      <div className="mb-2 flex items-center gap-2">
        <p className="flex-1 text-[10px] uppercase tracking-widest text-muted-foreground">
          {tr(koRoundLabelKey(m.ko!.round, total, m.ko!.kind))}
        </p>
        <button
          onClick={onDelete}
          aria-label={tr("cal.delMatch")}
          title={tr("cal.delMatch")}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/15 text-destructive"
        >
          🗑️
        </button>
      </div>
      {([
        ["teamA", "scoreA"],
        ["teamB", "scoreB"],
      ] as const).map(([tk, sk]) => (
        <div key={tk} className="flex items-center gap-2 py-0.5">
          <span className="min-w-0 flex-1 truncate text-sm" translate="no">
            {label(m[tk])}
          </span>
          <input
            className="w-12 rounded-lg border border-primary/30 bg-secondary/70 px-2 py-1 text-center text-sm"
            type="number"
            min={0}
            inputMode="numeric"
            value={m[sk]}
            onChange={(e) => setMatch(m.id, (x) => ({ ...x, [sk]: Number(e.target.value) }))}
          />
        </div>
      ))}
      <div className="mt-2 flex gap-1">
        {(["programmata", "live", "finita"] as const).map((st) => (
          <button
            key={st}
            onClick={() => setMatch(m.id, (x) => ({ ...x, status: st }))}
            className={`flex-1 rounded-full px-2 py-1 text-[10px] font-bold ${
              m.status === st ? "btn-gold" : "btn-ghost-gold"
            }`}
          >
            {st === "live" ? tr("live.live") : st === "finita" ? tr("live.ended") : tr("live.scheduled")}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Cassa ---------------- */

function MoneyTab({ t, patch }: { t: Tournament; patch: Patch }) {
  const { t: tr } = useI18n();
  const players = t.teams.flatMap((x) => x.players);
  const paid = players.filter((p) => p.paid).length;
  const incasso = paid * t.fee;
  const atteso = players.length * t.fee;

  return (
    <div className="space-y-4">
      <div className="card-night p-4">
        <label className="text-xs text-muted-foreground">{tr("money.fee")}</label>
        <input
          className="field mt-1"
          type="number"
          min={0}
          value={t.fee}
          onChange={(e) => patch((cur) => ({ ...cur, fee: Number(e.target.value) }))}
        />
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { l: tr("money.in"), v: `€${incasso}` },
          { l: tr("money.exp"), v: `€${atteso}` },
          { l: tr("money.paid"), v: `${paid}/${players.length}` },
        ].map((k) => (
          <div key={k.l} className="card-night p-3">
            <p className="display text-lg text-primary">{k.v}</p>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{k.l}</p>
          </div>
        ))}
      </div>

      <div className="card-night p-4">
        <h2 className="text-sm text-primary">{tr("money.signups")}</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {t.teams.map((team) => (
            <li key={team.id} className="flex justify-between">
              <span className="truncate">{team.name}</span>
              <span className="text-muted-foreground">
                €{team.players.filter((p) => p.paid).length * t.fee} / €
                {team.players.length * t.fee}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 rounded-xl bg-secondary/60 p-3 text-xs text-muted-foreground">
          {tr("money.hint")}
        </p>
      </div>
    </div>
  );
}

/* ---------------- Locandina ---------------- */

function PosterTab({ t }: { t: Tournament }) {
  const [url, setUrl] = useState<string>();
  const { t: tr, sportName } = useI18n();
  const sport = getSport(t.sport);

  const generate = async () => {
    const W = 1080;
    const H = 1350;
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#131c3f");
    bg.addColorStop(1, "#070b1d");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    const glow = ctx.createRadialGradient(W / 2, 220, 20, W / 2, 220, 700);
    glow.addColorStop(0, "rgba(212,175,55,0.35)");
    glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, 900);

    ctx.strokeStyle = "#D4AF37";
    ctx.lineWidth = 6;
    ctx.strokeRect(40, 40, W - 80, H - 80);

    if (t.logo) {
      const img = new Image();
      img.src = t.logo;
      await new Promise((r) => {
        img.onload = r;
        img.onerror = r;
      });
      ctx.drawImage(img, W / 2 - 130, 120, 260, 260);
    } else {
      ctx.font = "170px serif";
      ctx.textAlign = "center";
      ctx.fillText(sport.icon, W / 2, 330);
    }

    ctx.textAlign = "center";
    ctx.fillStyle = "#D4AF37";
    ctx.font = "bold 92px Anton, Impact, sans-serif";
    wrap(ctx, t.name.toUpperCase(), W / 2, 500, W - 160, 96);

    ctx.fillStyle = "#EEE8DA";
    ctx.font = "40px Manrope, sans-serif";
    ctx.fillText(
      `${sportName(sport.id, sport.name).toUpperCase()} · ${t.city || ""}`.trim(),
      W / 2,
      660,
    );
    if (t.startDate) ctx.fillText(`${tr("poster.start")} ${t.startDate}`, W / 2, 720);
    ctx.fillText(tr("poster.summary", { teams: t.teams.length, matches: t.matches.length }), W / 2, 780);

    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.font = "34px Manrope, sans-serif";
    t.teams.slice(0, 10).forEach((team, i) => {
      ctx.fillText(team.name, W / 2, 870 + i * 44);
    });

    ctx.fillStyle = "#D4AF37";
    ctx.font = "bold 36px Anton, Impact, sans-serif";
    ctx.fillText("MASTER LEAGUE TORNEI", W / 2, H - 90);

    setUrl(c.toDataURL("image/png"));
  };

  return (
    <div className="space-y-4">
      <button onClick={generate} className="btn-gold w-full py-3">
        {tr("poster.gen")}
      </button>
      {url && (
        <>
          <img src={url} alt={tr("poster.alt")} className="w-full rounded-xl border border-primary/30" />
          <a href={url} download={`${t.name}-locandina.png`} className="btn-ghost-gold block py-3 text-center">
            {tr("poster.dl")}
          </a>
        </>
      )}
    </div>
  );
}

function wrap(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxW: number,
  lh: number,
) {
  const words = text.split(" ");
  let line = "";
  let yy = y;
  words.forEach((w) => {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, yy);
      line = w;
      yy += lh;
    } else line = test;
  });
  ctx.fillText(line, x, yy);
}
