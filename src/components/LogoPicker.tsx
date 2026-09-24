import { teamLogos } from "@/data/teamLogos";
export default function LogoPicker({ onSelect }: any) {
  return (
    <div className="grid grid-cols-6 gap-4 p-4">
      {teamLogos.map((l: any) => (
        <img
          key={l.url}
          src={l.url}
          onClick={() => onSelect(l.url)}
          className="w-16 h-16 bg-white rounded-full p-1 border"
        />
      ))}
    </div>
  );
}
