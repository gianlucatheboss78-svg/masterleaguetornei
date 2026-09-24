import { useState } from "react";
import { teamLogos } from "@/data/teamLogos";

export default function LogoPicker({ onSelect }: { onSelect: (url: string) => void }) {
  const [filter, setFilter] = useState("calcio");
  const cats = ["calcio", "volti", "animali", "oggetti"];
  const filtered = teamLogos.filter((l: any) => l.category === filter);
  return (
    <div>
      <div className="flex gap-2 p-2">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={filter === c ? "bg-black text-white px-2 py-1 rounded" : "bg-gray-200 px-2 py-1 rounded"}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-6 gap-2 p-2">
        {filtered.map((logo: any) => (
          <img
            key={logo.id}
            src={logo.url}
            onClick={() => onSelect(logo.url)}
            className="w-16 h-16 bg-white rounded-full p-1 border cursor-pointer"
          />
        ))}
      </div>
    </div>
  );
}
