import { useState } from "react";
import { TEAM_LOGOS as teamLogos } from "@/data/teamLogos";

type Props = {
  value?: string | undefined;
  onChange?: (id: string) => void;
  onSelect?: (id: string) => void;
  size?: "lg" | "md" | "sm";
  placeholder?: string;
};

export function LogoPicker({ value, onChange, onSelect, placeholder }: Props) {
  const [q, setQ] = useState("");
  const list = teamLogos.filter(
    (l) =>
      l.name.toLowerCase().includes(q.toLowerCase()) ||
      l.searchTags.join(" ").toLowerCase().includes(q.toLowerCase()),
  );
  const pick = (id: string) => {
    onSelect?.(id);
    onChange?.(id);
  };
  return (
    <div className="p-4">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder ?? "Cerca: leone, scudo, fuoco..."}
        className="w-full p-2 rounded border border-yellow-500/30 bg-[#0A1931] text-white"
      />
      <div className="grid grid-cols-4 gap-2 mt-4 max-h-[300px] overflow-auto">
        {list.map((logo) => (
          <button
            key={logo.id}
            onClick={() => pick(logo.id)}
            className="aspect-square rounded-full flex items-center justify-center text-2xl border border-yellow-500/20"
            style={{ background: logo.bgColor }}
          >
            {logo.icon}
          </button>
        ))}
      </div>
    </div>
  );
}

export default LogoPicker;
