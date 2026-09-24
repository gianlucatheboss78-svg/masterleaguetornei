export type TeamLogoCategory =
  | "animali"
  | "volti"
  | "calcio-club"
  | "calcio-nazionali"
  | "basket"
  | "volley-padel"
  | "generico";
export type TeamLogo = {
  id: string;
  category: TeamLogoCategory;
  name: string;
  searchTags: string[];
  bgColor: string;
  icon: string;
  textColor?: string;
};

const COLORS = [
  ["oro", "#FFD700", "#0A1931"],
  ["blu notte", "#0A1931", "#FFD700"],
  ["royal", "#0057FF", "#FFFFFF"],
  ["rosso", "#CE1126", "#FFFFFF"],
  ["verde", "#009E60", "#FFFFFF"],
  ["nero", "#080808", "#FFD700"],
  ["viola", "#6A0DAD", "#FFFFFF"],
  ["azzurro", "#39A9DB", "#FFFFFF"],
  ["arancione", "#F47C20", "#0A1931"],
  ["grigio", "#747D8C", "#FFFFFF"],
] as const;
const FALLBACK_COLOR = ["oro", "#FFD700", "#0A1931"] as const;
const colorAt = (index: number) => COLORS[index % COLORS.length] ?? FALLBACK_COLOR;

const animals = [
  ["cane", "Cane", "🐶"],
  ["gatto", "Gatto", "🐱"],
  ["leone", "Leone", "🦁"],
  ["tigre", "Tigre", "🐯"],
  ["orso", "Orso", "🐻"],
  ["lupo", "Lupo", "🐺"],
  ["falco", "Falco", "🦅"],
  ["puma-nero", "Puma nero", "🐆"],
  ["giaguaro", "Giaguaro", "🐆"],
  ["cavallo", "Cavallo", "🐴"],
] as const;
const animalLogos: TeamLogo[] = animals.map(([id, name, icon], i) => ({
  id: `animale-${id}`,
  category: "animali",
  name,
  searchTags: [name.toLowerCase(), "animale", "mascotte"],
  bgColor: colorAt(i)[1],
  icon,
  textColor: colorAt(i)[2],
}));

const faces = ["😀", "😎", "🤠", "🥷", "🤖", "👽", "👻", "🤡", "👑", "🔥"];
const faceLogos: TeamLogo[] = Array.from({ length: 30 }, (_, i) => {
  const c = colorAt(i % 9);
  return {
    id: `volto-${i + 1}`,
    category: "volti",
    name: `Volto player ${i + 1}`,
    searchTags: ["volto", "persona", "faccia", "player"],
    bgColor: c[1],
    icon: faces[i % faces.length] ?? "😀",
    textColor: c[2],
  };
});

const clubs = [
  ["Juve", "Juventus", "#000000", "#FFFFFF"],
  ["Milan", "Milan", "#CE1126", "#000000"],
  ["Inter", "Inter", "#0057FF", "#000000"],
  ["Napoli", "Napoli", "#39A9DB", "#FFFFFF"],
  ["Roma", "Roma", "#8E1F2D", "#FFD700"],
  ["Lazio", "Lazio", "#87D8F7", "#FFFFFF"],
  ["Fiorentina", "Fiorentina", "#5E239D", "#FFFFFF"],
  ["Atalanta", "Atalanta", "#0A1931", "#FFD700"],
  ["Torino", "Torino", "#8B0000", "#FFFFFF"],
  ["Bologna", "Bologna", "#0A1931", "#CE1126"],
  ["Sassuolo", "Sassuolo", "#00B050", "#000000"],
  ["Udinese", "Udinese", "#FFFFFF", "#000000"],
  ["Genoa", "Genoa", "#8B0000", "#0A1931"],
  ["Sampdoria", "Sampdoria", "#0057FF", "#FFFFFF"],
  ["Cagliari", "Cagliari", "#CE1126", "#0A1931"],
  ["Verona", "Verona", "#FFD700", "#0A1931"],
  ["Empoli", "Empoli", "#0057FF", "#FFFFFF"],
  ["Lecce", "Lecce", "#FFD700", "#CE1126"],
  ["Monza", "Monza", "#CE1126", "#FFFFFF"],
  ["Frosinone", "Frosinone", "#FFD700", "#0A1931"],
  ["Palermo", "Palermo", "#FF69B4", "#000000"],
  ["Bari", "Bari", "#FFFFFF", "#CE1126"],
  ["Parma", "Parma", "#FFD700", "#0A1931"],
  ["Como", "Como", "#0057FF", "#FFFFFF"],
  ["Venezia", "Venezia", "#000000", "#00B050"],
  ["Catanzaro", "Catanzaro", "#FFD700", "#CE1126"],
  ["Modena", "Modena", "#FFD700", "#0A1931"],
  ["Pisa", "Pisa", "#000000", "#0057FF"],
  ["Spezia", "Spezia", "#FFFFFF", "#000000"],
  ["Reggiana", "Reggiana", "#8B0000", "#0A1931"],
  ["Cosenza", "Cosenza", "#CE1126", "#0A1931"],
  ["Cremonese", "Cremonese", "#CE1126", "#808080"],
  ["Brescia", "Brescia", "#0057FF", "#FFFFFF"],
  ["Ascoli", "Ascoli", "#000000", "#FFFFFF"],
  ["Ternana", "Ternana", "#CE1126", "#00B050"],
  ["Cittadella", "Cittadella", "#8B0000", "#FFD700"],
  ["Sudtirol", "Sudtirol", "#FFFFFF", "#CE1126"],
  ["Perugia", "Perugia", "#CE1126", "#FFFFFF"],
  ["SPAL", "SPAL", "#FFFFFF", "#0057FF"],
  ["Avellino", "Avellino", "#00B050", "#FFFFFF"],
  ["Arsenal", "Arsenal", "#EF0107", "#FFFFFF"],
  ["Chelsea", "Chelsea", "#034694", "#FFFFFF"],
  ["Liverpool", "Liverpool", "#C8102E", "#FFFFFF"],
  ["Man City", "Man City", "#6CABDD", "#FFFFFF"],
  ["Man Utd", "Man United", "#DA291C", "#FFD700"],
  ["Tottenham", "Tottenham", "#132257", "#FFFFFF"],
  ["Newcastle", "Newcastle", "#241F20", "#FFFFFF"],
  ["Aston Villa", "Aston Villa", "#95BFE5", "#7B1A1A"],
  ["Brighton", "Brighton", "#0057B8", "#FFFFFF"],
  ["West Ham", "West Ham", "#7A263A", "#1BB1E7"],
  ["Everton", "Everton", "#003399", "#FFFFFF"],
  ["Wolves", "Wolves", "#FDB913", "#000000"],
  ["Crystal Palace", "Crystal Palace", "#1B458F", "#C4122E"],
  ["Fulham", "Fulham", "#FFFFFF", "#000000"],
  ["Brentford", "Brentford", "#E30613", "#000000"],
  ["Leeds", "Leeds", "#FFFFFF", "#0057B8"],
  ["Leicester", "Leicester", "#003090", "#FDBE11"],
  ["Southampton", "Southampton", "#D71921", "#FFFFFF"],
  ["Nottm Forest", "Nottm Forest", "#DD0000", "#FFFFFF"],
  ["Burnley", "Burnley", "#6C1D45", "#99D6EA"],
  ["Real Madrid", "Real Madrid", "#FFFFFF", "#00529F"],
  ["Barcelona", "Barcellona", "#A50044", "#004D98"],
  ["Atletico Madrid", "Atletico Madrid", "#CB3524", "#FFFFFF"],
  ["Sevilla", "Siviglia", "#FFFFFF", "#D50000"],
  ["Villarreal", "Villarreal", "#FFE667", "#00529F"],
  ["Real Sociedad", "Real Sociedad", "#00579C", "#FFFFFF"],
  ["Athletic Bilbao", "Athletic Bilbao", "#EE2523", "#FFFFFF"],
  ["Betis", "Betis", "#00A651", "#FFFFFF"],
  ["Valencia", "Valencia", "#FFFFFF", "#000000"],
  ["Osasuna", "Osasuna", "#D50000", "#0A1931"],
  ["Celta Vigo", "Celta Vigo", "#8AC3EE", "#FFFFFF"],
  ["Rayo Vallecano", "Rayo Vallecano", "#FFFFFF", "#D50000"],
  ["Mallorca", "Mallorca", "#E30613", "#000000"],
  ["Getafe", "Getafe", "#00519E", "#FFFFFF"],
  ["Almeria", "Almeria", "#EE2523", "#FFFFFF"],
  ["Cadiz", "Cadiz", "#FFED02", "#004A99"],
  ["Girona", "Girona", "#CE1126", "#FFFFFF"],
  ["Alaves", "Alaves", "#0057FF", "#FFFFFF"],
  ["Las Palmas", "Las Palmas", "#FFED00", "#0057FF"],
  ["Granada", "Granada", "#C8102E", "#FFFFFF"],
  ["Bayern", "Bayern Monaco", "#DC052D", "#FFFFFF"],
  ["Dortmund", "Borussia Dortmund", "#FDE100", "#000000"],
  ["Leverkusen", "Bayer Leverkusen", "#E4002B", "#000000"],
  ["RB Leipzig", "RB Leipzig", "#DD0741", "#FFFFFF"],
  ["Stuttgart", "Stoccarda", "#FFFFFF", "#E30613"],
  ["Eintracht", "Eintracht", "#000000", "#E30613"],
  ["Wolfsburg", "Wolfsburg", "#65B32E", "#FFFFFF"],
  ["M'Gladbach", "M'Gladbach", "#000000", "#FFFFFF"],
  ["Werder", "Werder Brema", "#1D9051", "#FFFFFF"],
  ["Freiburg", "Friburgo", "#E30613", "#000000"],
  ["Hoffenheim", "Hoffenheim", "#1E5B9A", "#FFFFFF"],
  ["Union Berlin", "Union Berlino", "#EB1923", "#FFFFFF"],
  ["Mainz", "Mainz", "#ED1C24", "#FFFFFF"],
  ["Augsburg", "Augsburg", "#BA3733", "#FFFFFF"],
  ["Koln", "Colonia", "#FFFFFF", "#ED1C24"],
  ["Bochum", "Bochum", "#1A4EA0", "#FFFFFF"],
  ["Heidenheim", "Heidenheim", "#E30613", "#004B9C"],
  ["Darmstadt", "Darmstadt", "#1E5B9A", "#FFFFFF"],
  ["PSG", "PSG", "#004170", "#FFFFFF"],
  ["Marseille", "Marsiglia", "#009DDC", "#FFFFFF"],
  ["Lyon", "Lione", "#FFFFFF", "#00205B"],
  ["Ajax", "Ajax", "#FFFFFF", "#D2122E"],
  ["PSV", "PSV", "#E30613", "#FFFFFF"],
  ["Feyenoord", "Feyenoord", "#CC0000", "#FFFFFF"],
  ["Porto", "Porto", "#00428C", "#FFFFFF"],
  ["Benfica", "Benfica", "#EF0000", "#FFFFFF"],
  ["Sporting", "Sporting CP", "#008057", "#FFFFFF"],
  ["Celtic", "Celtic", "#00994C", "#FFFFFF"],
  ["Rangers", "Rangers", "#005EB8", "#FFFFFF"],
  ["Galatasaray", "Galatasaray", "#C8102E", "#FDB913"],
  ["Fenerbahce", "Fenerbahce", "#FFED00", "#0A1931"],
  ["Besiktas", "Besiktas", "#000000", "#FFFFFF"],
  ["Shakhtar", "Shakhtar", "#FF6600", "#000000"],
  ["Dinamo Zagreb", "Dinamo Zagabria", "#004A99", "#FFFFFF"],
  ["Olympiacos", "Olympiacos", "#D20A11", "#FFFFFF"],
  ["Panathinaikos", "Panathinaikos", "#007A33", "#FFFFFF"],
  ["Red Star", "Stella Rossa", "#D50000", "#FFFFFF"],
  ["Sparta Praga", "Sparta Praga", "#A50000", "#FFFFFF"],
  ["Boca Juniors", "Boca Juniors", "#003078", "#FFD700"],
  ["River Plate", "River Plate", "#FFFFFF", "#ED1C24"],
  ["Flamengo", "Flamengo", "#000000", "#C8102E"],
  ["Palmeiras", "Palmeiras", "#006437", "#FFFFFF"],
  ["Corinthians", "Corinthians", "#000000", "#FFFFFF"],
  ["Inter Miami", "Inter Miami", "#F7B5CD", "#000000"],
  ["LAFC", "LAFC", "#000000", "#FFD700"],
  ["LA Galaxy", "LA Galaxy", "#00245D", "#FFD700"],
  ["NY City", "NY City FC", "#6CABDD", "#FFFFFF"],
  ["Al Nassr", "Al Nassr", "#FFED00", "#0057B8"],
  ["Al Hilal", "Al Hilal", "#0057FF", "#FFFFFF"],
  ["Al Ittihad", "Al Ittihad", "#FFED00", "#000000"],
] as const;
const clubLogos: TeamLogo[] = clubs.map(([id, name, bg, text], i) => ({
  id: id.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  category: "calcio-club",
  name,
  searchTags: [name.toLowerCase(), "calcio", "club", id.toLowerCase()],
  bgColor: bg,
  icon: name.slice(0, 3).toUpperCase(),
  textColor: text,
}));

const nationals = [
  "Italia",
  "Francia",
  "Germania",
  "Spagna",
  "Inghilterra",
  "Portogallo",
  "Olanda",
  "Belgio",
  "Brasile",
  "Argentina",
  "Uruguay",
  "Colombia",
  "Croazia",
  "Marocco",
  "Giappone",
  "USA",
  "Messico",
  "Senegal",
  "Svizzera",
  "Polonia",
  "Ucraina",
  "Turchia",
  "Austria",
  "Danimarca",
  "Svezia",
  "Norvegia",
  "Irlanda",
  "Scozia",
  "Galles",
  "Nigeria",
] as const;
const nationalLogos: TeamLogo[] = nationals.map((name, i) => {
  const c = colorAt(i);
  return {
    id: `nazionale-${name.toLowerCase()}`,
    category: "calcio-nazionali",
    name: `${name}`,
    searchTags: ["nazionale", "calcio", "bandiera", name.toLowerCase()],
    bgColor: c[1],
    icon: name.slice(0, 2).toUpperCase(),
    textColor: c[2],
  };
});

const basketTeams = [
  "Lakers",
  "Warriors",
  "Bulls",
  "Celtics",
  "Heat",
  "Knicks",
  "Nets",
  "Mavericks",
  "Bucks",
  "76ers",
  "Suns",
  "Nuggets",
  "Clippers",
  "Hawks",
  "Raptors",
  "Grizzlies",
  "Kings",
  "Pelicans",
  "Cavaliers",
  "Timberwolves",
  "Thunder",
  "Pacers",
  "Magic",
  "Hornets",
  "Pistons",
  "Wizards",
  "Rockets",
  "Spurs",
  "Jazz",
  "Trail Blazers",
] as const;
const basketLogos: TeamLogo[] = basketTeams.map((name, i) => {
  const c = colorAt(i + 1);
  return {
    id: `basket-${name.toLowerCase().replace(/ /g, "-")}`,
    category: "basket",
    name,
    searchTags: ["basket", "nba", "canottiera", name.toLowerCase()],
    bgColor: c[1],
    icon: name.slice(0, 3).toUpperCase(),
    textColor: c[2],
  };
});

const sportsIcons = ["🏀", "🏐", "🏈", "🎾", "🏓"];
const volleyLogos: TeamLogo[] = Array.from({ length: 20 }, (_, i) => {
  const c = colorAt(i);
  return {
    id: `volley-padel-${i + 1}`,
    category: "volley-padel",
    name: `${i % 2 === 0 ? "Volley" : "Padel"} ${i + 1}`,
    searchTags: ["volley", "padel", "beach", `team${i + 1}`],
    bgColor: c[1],
    icon: sportsIcons[i % sportsIcons.length] ?? "🏐",
    textColor: c[2],
  };
});

const genericIcons = ["🛡️", "👑", "🔥", "⚡", "⭐", "💎", "🔰", "🎯", "🚀", "🏆"];
const genericNames = [
  "Scudo",
  "Corona",
  "Fuoco",
  "Fulmine",
  "Stella",
  "Trofeo",
  "Scudo royal",
  "Corona viola",
  "Fuoco arancio",
  "Trofeo grigio",
];
const genericLogos: TeamLogo[] = genericIcons.map((icon, i) => {
  const c = colorAt(i);
  const name = genericNames[i] ?? `Simbolo ${i + 1}`;
  return {
    id: `generico-${i + 1}`,
    category: "generico",
    name,
    searchTags: ["generico", name.toLowerCase(), "simbolo"],
    bgColor: c[1],
    icon,
    textColor: c[2],
  };
});

export const TEAM_LOGOS: TeamLogo[] = [
  ...animalLogos,
  ...faceLogos,
  ...clubLogos,
  ...nationalLogos,
  ...basketLogos,
  ...volleyLogos,
  ...genericLogos,
];

export function renderTeamLogo(logo: TeamLogo): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><circle cx="128" cy="128" r="128" fill="${logo.bgColor}" stroke="#0A4F37" stroke-width="12"/><foreignObject x="50" y="52" width="156" height="156"><div xmlns="http://www.w3.org/1999/xhtml" style="width:156px;height:156px;display:flex;align-items:center;justify-content:center;font-size:${logo.icon.length > 3 ? "44px" : "58px"};line-height:1;font-family:Arial,sans-serif;font-weight:900;color:${logo.textColor ?? "#FFFFFF"}">${logo.icon}</div></foreignObject></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
