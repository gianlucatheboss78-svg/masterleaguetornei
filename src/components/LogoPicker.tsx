import { teamLogos } from "@/data/teamLogos";

export default function LogoPicker({ onSelect }: any) {
  return (
    <div className="grid grid-cols-6 gap-4 p-4">
      {teamLogos.map((logo: any) => (
        <img
          key={logo.url}
          src={logo.url}
          onClick={() => onSelect(logo.url)}
          className="w-[72px] h-[72px] bg-white rounded-full p-1 border cursor-pointer"
        />
      ))}
    </div>
  );
}
