import { useState } from "react";
import { teamLogos } from "@/data/teamLogos";

export default function LogoPicker({ onSelect }: { onSelect: (url: string) => void }) {
  const [filter, setFilter] = useState("calcio");
  const categories = ["calcio", "volti", "animali", "oggetti"];
  const filtered = teamLogos.filter((logo: any) => logo.category === filter);
  return (
    <div>
      <div className="flex gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={filter === cat ? "bg-black text-white p-2 rounded" : "bg-gray-200 p-2 rounded"}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {filtered.map((logo: any) => (
          <img
            key={logo.id}
            src={logo.url}
            onClick={() => onSelect(logo.url)}
            className="cursor-pointer border rounded p-1"
          />
        ))}
      </div>
    </div>
  );
}
