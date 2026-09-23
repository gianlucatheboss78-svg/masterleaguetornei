
import { useState, useMemo } from "react"
import { LOGO_LIBRARY, PALETTES, renderLogo } from "@/data/logoLibrary"

type Props = {
  value: string
  onChange: (v: string) => void
  size?: "lg" | "md"
  placeholder?: string
}

export default function LogoPicker({ value, onChange, size = "lg", placeholder }: Props) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<"galleria" | "loghi" | "bandiere">("loghi")
  const [q, setQ] = useState("")
  const [palette, setPalette] = useState("Tutti")

  const box = size === "lg" ? "h-20 w-20 text-3xl" : "h-12 w-12 text-xl"

  const filtered = useMemo(() => {
    let list = LOGO_LIBRARY
    if (q) {
      const s = q.toLowerCase()
      list = list.filter(l => l.name.toLowerCase().includes(s) || l.tags?.some(t=>t.toLowerCase().includes(s)))
    }
    if (palette !== "Tutti" && tab === "loghi") {
      list = list.filter(l => l.palette === palette)
    }
    return list
  }, [q, palette, tab])

  return (
    <>
      <div onClick={() => setOpen(true)} className={`${box} shrink-0 overflow-hidden rounded-full border-2 border-[#D4AF37]/50 bg-[#0A1931] flex items-center justify-center cursor-pointer`}>
        {value ? <div className="scale-75">{value}</div> : <span className="text-2xl">📷</span>}
      </div>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 sm:items-center sm:p-4">
          <div className="w-full max-h-[90vh] overflow-hidden rounded-t-3xl bg-[#0A1931] border border-[#D4AF37]/30 sm:rounded-3xl sm:max-w-2xl flex flex-col">
            
            <div className="flex items-center justify-between p-5 pb-3">
              <h2 className="text-2xl font-black text-[#D4AF37]">SCEGLI LOGO</h2>
              <button onClick={() => setOpen(false)} className="text-white/60 text-3xl">✕</button>
            </div>

            {/* RIGA 1 - FIX TAGLIO */}
            <div className="px-4 pb-2">
              <div className="flex gap-2 overflow-x-auto overflow-y-hidden scrollbar-none py-2">
                <button onClick={()=>setTab("galleria")} className={`shrink-0 whitespace-nowrap rounded-full px-5 py-3 text-sm font-bold border ${tab==="galleria"?"bg-[#D4AF37] text-black border-[#D4AF37]":"border-white/20 text-white/70"}`}>📷 Galleria</button>
                <button onClick={()=>setTab("loghi")} className={`shrink-0 whitespace-nowrap rounded-full px-5 py-3 text-sm font-bold border ${tab==="loghi"?"bg-[#D4AF37] text-black border-[#D4AF37]":"border-white/20 text-white/70"}`}>🛡️ 1000 loghi</button>
                <button onClick={()=>setTab("bandiere")} className={`shrink-0 whitespace-nowrap rounded-full px-5 py-3 text-sm font-bold border ${tab==="bandiere"?"bg-[#D4AF37] text-black border-[#D4AF37]":"border-white/20 text-white/70"}`}>🏳️ 195 bandiere</button>
              </div>
            </div>

            <div className="px-4 pb-3">
              <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Cerca: leone, scudo, fuoco..." className="w-full rounded-2xl bg-black/40 border border-white/10 px-5 py-4 text-white outline-none" />
            </div>

            {/* RIGA 2 - FIX TAGLIO */}
            {tab==="loghi" && (
              <div className="px-4 pb-2">
                <div className="flex gap-2 overflow-x-auto overflow-y-hidden scrollbar-none py-2">
                  {["Tutti", ...PALETTES.map(p=>p.name)].map(name=>(
                    <button key={name} onClick={()=>setPalette(name)} className={`shrink-0 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-bold border ${palette===name?"bg-[#D4AF37] text-black border-[#D4AF37]":"border-white/20 text-white/70"}`}>{name}</button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-4 gap-3 sm:grid-cols-6">
              {filtered.map((logo, i)=>(
                <button key={i} onClick={()=>{onChange(renderLogo(logo) as any); setOpen(false)}} className="aspect-square rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-3xl hover:bg-[#D4AF37]/20">
                  {logo.emoji || "🛡️"}
                </button>
              ))}
            </div>

          </div>
        </div>
      )}
    </>
  )
                }
