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

export const teamLogos: TeamLogo[] = [
  { id: "inter", category: "calcio-club", name: "Inter", searchTags: ["inter","serie a"], bgColor: "#0A1931", icon: "🔵⚫", textColor: "#FFFFFF" },
  { id: "milan", category: "calcio-club", name: "Milan", searchTags: ["milan","serie a"], bgColor: "#CE1126", icon: "🔴⚫", textColor: "#FFFFFF" },
  { id: "juventus", category: "calcio-club", name: "Juventus", searchTags: ["juve"], bgColor: "#000000", icon: "⚪⚫", textColor: "#FFFFFF" },
  { id: "napoli", category: "calcio-club", name: "Napoli", searchTags: ["napoli"], bgColor: "#12A0D6", icon: "💙", textColor: "#FFFFFF" },
  { id: "roma", category: "calcio-club", name: "Roma", searchTags: ["roma"], bgColor: "#8C1A17", icon: "❤️💛", textColor: "#FFD700" },
  { id: "maglia-rossa", category: "calcio-club", name: "Maglia Rossa", searchTags: ["rossa"], bgColor: "#E30613", icon: "👕", textColor: "#FFFFFF" },
  { id: "maglia-blu", category: "calcio-club", name: "Maglia Blu", searchTags: ["blu"], bgColor: "#0057FF", icon: "👕", textColor: "#FFFFFF" },
  { id: "maglia-verde", category: "calcio-club", name: "Maglia Verde", searchTags: ["verde"], bgColor: "#009E60", icon: "👕", textColor: "#FFFFFF" },
  { id: "maglia-gialla", category: "calcio-club", name: "Maglia Gialla", searchTags: ["gialla"], bgColor: "#FFE600", icon: "👕", textColor: "#000000" },
  { id: "maglia-nera", category: "calcio-club", name: "Maglia Nera", searchTags: ["nera"], bgColor: "#000000", icon: "👕", textColor: "#FFFFFF" },
  { id: "maglia-bianca", category: "calcio-club", name: "Maglia Bianca", searchTags: ["bianca"], bgColor: "#FFFFFF", icon: "👕", textColor: "#000000" },
  { id: "italia", category: "calcio-nazionali", name: "Italia", searchTags: ["italia"], bgColor: "#0057FF", icon: "🇮🇹", textColor: "#FFFFFF" },
  { id: "brasile", category: "calcio-nazionali", name: "Brasile", searchTags: ["brasile"], bgColor: "#FFE600", icon: "🇧🇷", textColor: "#009E60" },
  { id: "argentina", category: "calcio-nazionali", name: "Argentina", searchTags: ["argentina"], bgColor: "#74ACDF", icon: "🇦🇷", textColor: "#FFFFFF" },
  { id: "nigeria", category: "calcio-nazionali", name: "Nigeria", searchTags: ["nigeria","africa"], bgColor: "#008751", icon: "🇳🇬", textColor: "#FFFFFF" },
  { id: "senegal", category: "calcio-nazionali", name: "Senegal", searchTags: ["senegal","africa"], bgColor: "#00853F", icon: "🇸🇳", textColor: "#FFE600" },
  { id: "giappone", category: "calcio-nazionali", name: "Giappone", searchTags: ["giappone","asia"], bgColor: "#FFFFFF", icon: "🇯🇵", textColor: "#CE1126" },
  { id: "lakers", category: "basket", name: "Lakers", searchTags: ["lakers","nba"], bgColor: "#552583", icon: "💜💛", textColor: "#FDB927" },
  { id: "bulls", category: "basket", name: "Bulls", searchTags: ["bulls"], bgColor: "#CE1141", icon: "🐂", textColor: "#FFFFFF" },
  { id: "canotta-rossa", category: "basket", name: "Canotta Rossa", searchTags: ["canotta","rossa"], bgColor: "#E30613", icon: "🎽", textColor: "#FFFFFF" },
  { id: "canotta-nera", category: "basket", name: "Canotta Nera", searchTags: ["canotta"], bgColor: "#000000", icon: "🎽", textColor: "#FFFFFF" },
  { id: "canotta-blu", category: "basket", name: "Canotta Blu", searchTags: ["canotta"], bgColor: "#0057FF", icon: "🎽", textColor: "#FFFFFF" },
  { id: "padel-fluo", category: "volley-padel", name: "Padel Fluo Pro", searchTags: ["padel","fluo"], bgColor: "#CCFF00", icon: "🎾", textColor: "#000000" },
  { id: "padel-nero", category: "volley-padel", name: "Padel Nera", searchTags: ["padel"], bgColor: "#111111", icon: "🎾", textColor: "#CCFF00" },
  { id: "padel-bianca", category: "volley-padel", name: "Padel Bianca", searchTags: ["padel"], bgColor: "#FFFFFF", icon: "👚", textColor: "#000000" },
  { id: "volto-ita-uomo", category: "volti", name: "Uomo Italiano", searchTags: ["italiano","uomo"], bgColor: "#FFDBAC", icon: "👨🏻", textColor: "#000000" },
  { id: "volto-ita-donna", category: "volti", name: "Donna Italiana", searchTags: ["italiana","donna"], bgColor: "#FFDBAC", icon: "👩🏻", textColor: "#000000" },
  { id: "volto-afro-uomo", category: "volti", name: "Uomo Afro", searchTags: ["africano","afro","uomo"], bgColor: "#8D5524", icon: "👨🏾", textColor: "#FFFFFF" },
  { id: "volto-afro-donna", category: "volti", name: "Donna Afro", searchTags: ["africana","donna"], bgColor: "#8D5524", icon: "👩🏾", textColor: "#FFFFFF" },
  { id: "volto-latino-uomo", category: "volti", name: "Uomo Latino", searchTags: ["latino"], bgColor: "#C68642", icon: "👨🏽", textColor: "#FFFFFF" },
  { id: "volto-latina-donna", category: "volti", name: "Donna Latina", searchTags: ["latina"], bgColor: "#C68642", icon: "👩🏽", textColor: "#FFFFFF" },
  { id: "volto-asian-uomo", category: "volti", name: "Uomo Asiatico", searchTags: ["asiatico","asia"], bgColor: "#FFDBAC", icon: "👨🏻‍🦱", textColor: "#000000" },
  { id: "volto-asian-donna", category: "volti", name: "Donna Asiatica", searchTags: ["asiatica"], bgColor: "#FFDBAC", icon: "👩🏻‍🦱", textColor: "#000000" },
  { id: "generico-fire", category: "generico", name: "Team Fire", searchTags: ["fuoco"], bgColor: "#FF4500", icon: "🔥", textColor: "#FFFFFF" },
  { id: "generico-ice", category: "generico", name: "Team Ice", searchTags: ["ghiaccio"], bgColor: "#00BFFF", icon: "❄️", textColor: "#FFFFFF" },
  { id: "leoni", category: "animali", name: "Leoni", searchTags: ["leone"], bgColor: "#FFA500", icon: "🦁", textColor: "#000000" },
];
