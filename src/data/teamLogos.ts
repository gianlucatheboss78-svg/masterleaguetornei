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

const PRO_PALETTES = [
  ["#1746A2", "#E5FF00"], ["#CE1126", "#F5F7FA"], ["#552583", "#FDB927"],
  ["#007A33", "#FFFFFF"], ["#F36C21", "#0A1931"], ["#00A9CE", "#0A1931"],
  ["#111111", "#E5FF00"], ["#862633", "#FFB81C"], ["#00471B", "#EEE1C6"],
  ["#1D428A", "#FFC72C"], ["#C8102E", "#041E42"], ["#702F8A", "#FFFFFF"],
] as const;

const hash = (value: string) =>
  [...value.toLocaleUpperCase()].reduce((total, char) => (total * 31 + char.charCodeAt(0)) >>> 0, 7);

export const teamInitials = (name: string) => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  return (words.length > 1 ? `${words[0]?.[0] ?? ""}${words.at(-1)?.[0] ?? ""}` : words[0]?.slice(0, 2) ?? "ML").toLocaleUpperCase();
};

export function createTeamLogo(name: string): TeamLogo {
  const paletteIndex = hash(name) % PRO_PALETTES.length;
  const [bgColor, textColor] = PRO_PALETTES[paletteIndex] ?? PRO_PALETTES[0];
  return {
    id: `initials:${encodeURIComponent(name.trim() || "Master League")}`,
    category: "generico",
    name: name.trim() || "Master League",
    searchTags: ["iniziali", "automatico", "pro"],
    bgColor,
    textColor,
    icon: teamInitials(name),
  };
}

export const TEAM_LOGOS: TeamLogo[] = [
  "Milano", "Roma", "Torino", "Napoli", "Bologna", "Firenze", "Palermo", "Bari",
  "Venezia", "Genova", "Verona", "Cagliari",
].map(createTeamLogo);
export const teamLogos = TEAM_LOGOS;

const svgUrl = (svg: string) => `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;

export function renderTeamLogo(logo: TeamLogo): string {
  const initials = logo.icon || teamInitials(logo.name);
  return svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><circle cx="80" cy="80" r="76" fill="${logo.bgColor}" stroke="#E5FF00" stroke-width="7"/><circle cx="80" cy="80" r="62" fill="none" stroke="${logo.textColor ?? "#FFFFFF"}" stroke-opacity=".35" stroke-width="2"/><text x="80" y="92" text-anchor="middle" font-family="Arial,sans-serif" font-size="54" font-weight="900" fill="${logo.textColor ?? "#FFFFFF"}">${initials}</text></svg>`);
}

export function resolveTeamLogo(value?: string, fallbackName = "Master League"): TeamLogo {
  if (value?.startsWith("initials:")) return createTeamLogo(decodeURIComponent(value.slice(9)));
  return TEAM_LOGOS.find((logo) => logo.id === value) ?? createTeamLogo(fallbackName);
}

export function teamColor(name: string): string {
  return createTeamLogo(name).bgColor;
}

export function renderPlayerAvatar(id: string, name: string, country: string): string {
  const seed = hash(`${id}:${name}:${country}`);
  const skins = ["#F2D3B1", "#D6A071", "#A86F47", "#70452E"];
  const hairs = ["#17120F", "#4B2E21", "#D3A45B", "#1B1B1B"];
  const skin = skins[seed % skins.length] ?? skins[0];
  const hair = hairs[(seed >> 2) % hairs.length] ?? hairs[0];
  const longHair = seed % 2 === 0;
  return svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><circle cx="60" cy="60" r="58" fill="#0A1931" stroke="#E5FF00" stroke-width="4"/><path d="M20 112c4-28 20-40 40-40s36 12 40 40" fill="#1746A2"/><ellipse cx="60" cy="52" rx="27" ry="32" fill="${skin}"/><path d="M33 50c0-31 54-38 56 2-8-12-16-18-29-18-12 0-20 6-27 16Z" fill="${hair}"/>${longHair ? `<path d="M33 48c-5 13-4 35 5 45l8-17V48Zm54 0c5 13 4 35-5 45l-8-17V48Z" fill="${hair}"/>` : ""}<circle cx="50" cy="54" r="3" fill="#111"/><circle cx="70" cy="54" r="3" fill="#111"/><path d="M50 67q10 8 20 0" fill="none" stroke="#7A3F35" stroke-width="3" stroke-linecap="round"/></svg>`);
}

export function renderTeamKit(sportId: string, color: string, number = 10): string {
  const accent = color.toLowerCase() === "#e5ff00" ? "#0A1931" : "#E5FF00";
  const basket = sportId === "basket";
  const technical = ["padel", "tennis", "volley", "pallavolo", "beachvolley"].includes(sportId);
  const body = basket
    ? `<path d="M42 20h14c0 12 8 12 8 0h14l15 17-12 13-7-7v58H46V43l-7 7-12-13Z" fill="${color}" stroke="${accent}" stroke-width="4"/>`
    : `<path d="M40 22h16l4 8 4-8h16l19 16-12 16-9-8v57H42V46l-9 8-12-16Z" fill="${color}" stroke="${accent}" stroke-width="4"/><path d="M52 22l8 12 8-12" fill="none" stroke="${accent}" stroke-width="4"/>`;
  return svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">${body}<text x="60" y="73" text-anchor="middle" font-family="Arial,sans-serif" font-size="${basket ? 32 : 26}" font-weight="900" fill="${accent}">${number}</text><text x="60" y="91" text-anchor="middle" font-family="Arial,sans-serif" font-size="7" font-weight="700" fill="${accent}">${technical ? "ML TECH" : basket ? "MASTER" : "ML SPORT"}</text></svg>`);
}
