import { teamLogos } from "@/data/teamLogos";

export default function LogoPicker({ onSelect }: { onSelect: (url: string) => void }) {
  return (
    <div className="grid grid-cols-6 gap-4 p-4 max-h-[380px] overflow-y-auto">
      {teamLogos.map((logo: any) => (
        <div
          key={logo.url}
          onClick={() => onSelect(logo.url)}
          className="w-[72px] h-[72px] bg-white rounded-full flex items-center justify-center overflow-hidden border cursor-pointer hover:scale-110"
        >
          <img src={logo.url} alt="" className="w-full h-full object-contain p-1" />
        </div>
      ))}
    </div>
  );
}
