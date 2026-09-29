export type JerseyPreset = {
  id: string;
  league: string;
  club: string;
  primary: string;
  secondary: string;
  sport: "football" | "basket";
};

const football = (league: string, clubs: Array<[string, string, string]>): JerseyPreset[] =>
  clubs.map(([club, primary, secondary]) => ({
    id: `${league}:${club}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    league,
    club,
    primary,
    secondary,
    sport: "football",
  }));

export const JERSEY_PRESETS: JerseyPreset[] = [
  ...football("Serie A", [
    ["Juventus", "#FFFFFF", "#101010"], ["Milan", "#C8102E", "#101010"], ["Inter", "#0057B8", "#101010"],
    ["Napoli", "#53B9E9", "#FFFFFF"], ["Roma", "#8E1F2F", "#F4A900"], ["Lazio", "#87CEEB", "#FFFFFF"],
  ]),
  ...football("Premier League", [
    ["Manchester City", "#6CABDD", "#FFFFFF"], ["Arsenal", "#EF0107", "#FFFFFF"], ["Liverpool", "#C8102E", "#F6EB61"],
    ["Chelsea", "#034694", "#FFFFFF"], ["Manchester United", "#DA291C", "#FBE122"],
  ]),
  ...football("La Liga", [
    ["Real Madrid", "#FFFFFF", "#FEBE10"], ["Barcelona", "#004D98", "#A50044"], ["Atlético Madrid", "#CB3524", "#FFFFFF"],
  ]),
  ...football("Brasileirão", [
    ["Flamengo", "#D71920", "#101010"], ["Palmeiras", "#006437", "#FFFFFF"], ["Corinthians", "#FFFFFF", "#101010"],
    ["São Paulo", "#FFFFFF", "#E31B23"], ["Santos", "#FFFFFF", "#101010"],
  ]),
  ...football("Liga Profesional Argentina", [
    ["Boca Juniors", "#003B7A", "#F7C600"], ["River Plate", "#FFFFFF", "#D71920"], ["Racing Club", "#6CB4E4", "#FFFFFF"],
    ["Independiente", "#D71920", "#FFFFFF"], ["San Lorenzo", "#1B3F8B", "#D71920"],
  ]),
  ...football("Ligue 1", [
    ["PSG", "#004170", "#DA291C"], ["Marseille", "#2FAEE0", "#FFFFFF"], ["Lyon", "#FFFFFF", "#1D428A"],
  ]),
  ...football("Bundesliga", [
    ["Bayern Munich", "#DC052D", "#FFFFFF"], ["Dortmund", "#FDE100", "#101010"], ["Leverkusen", "#E32221", "#101010"],
  ]),
  ...football("Primeira Liga", [
    ["Porto", "#005DAA", "#FFFFFF"], ["Benfica", "#E30613", "#FFFFFF"], ["Sporting", "#008C4A", "#FFFFFF"],
  ]),
  ...football("Chinese Super League", [
    ["Shanghai Port", "#D71920", "#FFFFFF"], ["Beijing Guoan", "#2AAA45", "#F5E500"], ["Shandong Taishan", "#F58220", "#FFFFFF"],
  ]),
  ...([
    ["Los Angeles Lakers", "#552583", "#FDB927"], ["Boston Celtics", "#007A33", "#FFFFFF"], ["Chicago Bulls", "#CE1141", "#101010"],
    ["Golden State Warriors", "#1D428A", "#FFC72C"], ["Miami Heat", "#98002E", "#F9A01B"], ["New York Knicks", "#006BB6", "#F58426"],
    ["Dallas Mavericks", "#00538C", "#B8C4CA"], ["Phoenix Suns", "#1D1160", "#E56020"], ["Milwaukee Bucks", "#00471B", "#EEE1C6"],
    ["Brooklyn Nets", "#101010", "#FFFFFF"],
  ] as Array<[string, string, string]>).map(([club, primary, secondary]) => ({
    id: `nba-${club}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"), league: "NBA", club, primary, secondary, sport: "basket" as const,
  })),
];

export const jerseyInitials = (club: string) => club.split(/\s+/).map((word) => word[0]).join("").slice(0, 3).toUpperCase();
export const resolveJersey = (id?: string) => JERSEY_PRESETS.find((preset) => preset.id === id);
