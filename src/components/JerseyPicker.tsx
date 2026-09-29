import { useMemo, useState } from "react";
import { JERSEY_PRESETS, jerseyInitials, type JerseyPreset } from "@/data/jerseys";
import { renderTeamKit } from "@/data/teamLogos";

export function JerseyPicker({ sportId, value, onChange }: { sportId: string; value?: string | undefined; onChange: (preset: JerseyPreset) => void }) {
  const sport = sportId === "basket" ? "basket" : "football";
  const leagues = useMemo(() => [...new Set(JERSEY_PRESETS.filter((item) => item.sport === sport).map((item) => item.league))], [sport]);
  const [league, setLeague] = useState(leagues[0] ?? "");
  const list = JERSEY_PRESETS.filter((item) => item.sport === sport && item.league === league);
  return <div className="space-y-4">
    <div className="flex min-h-12 gap-2 overflow-x-auto pb-2">
      {leagues.map((item) => <button key={item} type="button" onClick={() => setLeague(item)} className={`shrink-0 whitespace-nowrap px-4 py-2 text-xs font-bold ${league === item ? "btn-gold" : "btn-ghost-gold"}`}>{item}</button>)}
    </div>
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {list.map((preset) => <button key={preset.id} type="button" onClick={() => onChange(preset)} className={`league-panel flex min-h-24 flex-col items-center justify-center gap-1 p-2 text-center ${value === preset.id ? "ring-2 ring-primary" : ""}`}>
        <div className="relative h-14 w-14">
          <img src={renderTeamKit(sportId, preset.primary, 10, preset.secondary, jerseyInitials(preset.club))} alt="" className="h-full w-full object-contain" />
        </div>
        <span className="line-clamp-2 text-[10px] font-bold">{preset.club}</span>
      </button>)}
    </div>
  </div>;
}
