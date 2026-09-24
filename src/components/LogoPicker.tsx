import { useState } from "react";
import { teamLogos, TeamLogoCategory } from "@/data/teamLogos";

type Filter = TeamLogoCategory;

export default function LogoPicker({ onSelect }: { onSelect: (url: string) => void }) {
  const [filter, setFilter] = useState<Filter>("calcio");
  const categories: Filter[] = ["calcio", "volti", "animali", "oggetti"];
  const filtered = teamLogos.filter((logo) => logo.category === filter);
  return (
    <div>
      <div className="flex gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={filter === cat ? "bg-black text-white px-3 py-1 rounded" : "bg-gray-200 px-3 py-1 rounded"}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {filtered.map((logo) => (
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
