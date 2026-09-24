import React from "react";

export default function LogoPicker({ onSelect, logos }: any) {
  const allLogos = logos || [];

  return (
    <div className="grid grid-cols-6 gap-3 p-4 max-h-[400px] overflow-y-auto">
      {allLogos.map((logo: any, i: number) => (
        <button
          key={i}
          onClick={() => onSelect && onSelect(logo)}
          className="w-16 h-16 rounded-full bg-white flex items-center justify-center hover:scale-110 transition p-1 border"
        >
          <img src={logo.url || logo} alt="logo" className="w-full h-full object-contain rounded-full" />
        </button>
      ))}
    </div>
  );
}
