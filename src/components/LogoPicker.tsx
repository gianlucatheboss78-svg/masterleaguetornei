import { useMemo, useRef, useState } from "react";
import { getCountries } from "@/lib/countries";
import { LOGO_LIBRARY, PALETTES, renderLogo } from "@/lib/logos";
import { useI18n } from "@/lib/i18n";
import { readCircleImage } from "@/lib/media";

type Props = {
  value?: string | undefined;
  onChange: (dataUrl: string) => void;
  size?: "sm" | "lg";
  placeholder?: string;
};

export function LogoPicker({ value, onChange, size = "lg", placeholder }: Props) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const box = size === "lg" ? "h-24 w-24 text-xs" : "h-12 w-12 text-lg";
  const label = placeholder ?? t("lp.logo");

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`${box} shrink-0 overflow-hidden rounded-full border-2 border-primary/50 bg-secondary`}
      >
        {value ? (
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="text-muted-foreground">{size === "lg" ? `${label} 📷` : "📷"}</span>
        )}
      </button>
      {open && (
        <LogoSheet
          onClose={() => setOpen(false)}
          onPick={(d) => {
            onChange(d);
            setOpen(false);
          }}
        />
      )}
    </>
  );
}

function LogoSheet({ onClose, onPick }: { onClose: () => void; onPick: (d: string) => void }) {
  const { t, lang } = useI18n();
  const [tab, setTab] = useState<"galleria" | "loghi" | "bandiere">("loghi");
  const [q, setQ] = useState("");
  const [paletteId, setPaletteId] = useState<string>("all");
  const fileRef = useRef<HTMLInputElement>(null);

  const logos = useMemo(() => {
    const term = q.trim().toLowerCase();
    return LOGO_LIBRARY.filter(
      (l) =>
        (paletteId === "all" || l.palette.id === paletteId) &&
        (!term ||
          l.name.toLowerCase().includes(term) ||
          l.palette.name.toLowerCase().includes(term) ||
          l.icon === term),
    ).slice(0, 180);
  }, [q, paletteId]);

  const flags = useMemo(() => {
    const term = q.trim().toLowerCase();
    return getCountries(lang).filter(
      (c) => !term || c.name.toLowerCase().includes(term) || c.code.toLowerCase() === term,
    );
  }, [q, lang]);

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/75 sm:items-center sm:p-4">
      <div className="card-night flex max-h-[88vh] w-full flex-col p-4 sm:mx-auto sm:max-w-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg gold-text">{t("lp.title")}</h2>
          <button onClick={onClose} className="text-muted-foreground">
            ✕
          </button>
        </div>

        <div className="mt-3 flex gap-2 text-xs">
          {(
            [
              ["galleria", t("lp.gallery")],
              ["loghi", t("lp.logos")],
              ["bandiere", t("lp.flags")],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 py-2 font-bold ${tab === id ? "btn-gold" : "btn-ghost-gold"}`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "galleria" ? (
          <div className="mt-6 pb-4 text-center">
            <button onClick={() => fileRef.current?.click()} className="btn-gold w-full py-3">
              {t("lp.open")}
            </button>
            <p className="mt-2 text-xs text-muted-foreground">{t("lp.crop")}</p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (f) onPick(await readCircleImage(f));
              }}
            />
          </div>
        ) : (
          <>
            <input
              className="field mt-3"
              placeholder={tab === "loghi" ? t("lp.searchLogos") : t("lp.searchFlags")}
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            {tab === "loghi" && (
              <div className="-mx-1 mt-2 flex gap-1 overflow-x-auto px-1 pb-1 text-[10px]">
                <button
                  onClick={() => setPaletteId("all")}
                  className={`shrink-0 px-3 py-1 ${paletteId === "all" ? "btn-gold" : "btn-ghost-gold"}`}
                >
                  {t("lp.all")}
                </button>
                {PALETTES.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPaletteId(p.id)}
                    className={`shrink-0 px-3 py-1 ${paletteId === p.id ? "btn-gold" : "btn-ghost-gold"}`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-3 grid grid-cols-5 gap-2 overflow-y-auto pb-4">
              {tab === "loghi"
                ? logos.map((l) => (
                    <button
                      key={l.id}
                      title={`${l.name} · ${l.palette.name}`}
                      onClick={() => onPick(renderLogo(l.icon, l.palette))}
                      className="flex aspect-square items-center justify-center rounded-full text-xl"
                      style={{
                        background: `linear-gradient(135deg, ${l.palette.from}, ${l.palette.to})`,
                        border: `2px solid ${l.palette.ring}`,
                      }}
                    >
                      {l.icon}
                    </button>
                  ))
                : flags.map((c) => (
                    <button
                      key={c.code}
                      title={c.name}
                      onClick={() => onPick(renderLogo(c.flag, PALETTES[1]!))}
                      className="flex aspect-square flex-col items-center justify-center rounded-full border border-primary/30 bg-secondary/70 text-xl"
                    >
                      {c.flag}
                      <span className="w-full truncate px-1 text-[7px] text-muted-foreground">
                        {c.name}
                      </span>
                    </button>
                  ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
