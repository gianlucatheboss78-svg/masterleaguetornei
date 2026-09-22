import { useEffect, useRef, useState } from "react";
import { LANGS, useI18n } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0]!;

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={ref} className="relative z-[60]" aria-label={t("lang.title")}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="btn-ghost-gold flex items-center gap-1 px-3 py-1.5 text-sm"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="text-[10px] font-bold uppercase tracking-widest">{current.code}</span>
      </button>

      {open && (
        <ul className="card-night absolute right-0 mt-2 w-40 overflow-hidden p-1">
          {LANGS.map((l) => (
            <li key={l.code}>
              <button
                type="button"
                onClick={() => {
                  setLang(l.code);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                  l.code === lang ? "bg-primary/15 text-primary" : "text-foreground"
                }`}
              >
                <span className="text-base">{l.flag}</span>
                {l.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
