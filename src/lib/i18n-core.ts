export type Lang = "it" | "en" | "es" | "fr" | "pt" | "zh";

export const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "pt", label: "Português", flag: "🇵🇹" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
];

export const LANG_KEY = "mlt.lang.v1";

export function detectLang(): Lang {
  if (typeof window === "undefined") return "it";
  const saved = window.localStorage.getItem(LANG_KEY) as Lang | null;
  if (saved && LANGS.some((l) => l.code === saved)) return saved;
  const prefs = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const p of prefs) {
    const base = (p || "").slice(0, 2).toLowerCase() as Lang;
    if (LANGS.some((l) => l.code === base)) return base;
  }
  return "en";
}
