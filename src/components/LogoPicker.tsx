import { useMemo, useRef, useState } from "react";
import { ImagePlus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TEAM_LOGOS, renderTeamLogo, type TeamLogoCategory } from "@/data/teamLogos";

type Props = { value?: string | undefined; onChange: (value: string) => void; size?: "lg" | "md" | "sm"; placeholder?: string };
type Filter = "tutti" | TeamLogoCategory | "calcio";
const FILTERS: Array<{ label: string; value: Filter }> = [
  {label:"Tutti",value:"tutti"},{label:"Animali",value:"animali"},{label:"Volti",value:"volti"},{label:"Calcio",value:"calcio"},{label:"Nazionali",value:"calcio-nazionali"},{label:"Basket",value:"basket"},{label:"Volley/Padel",value:"volley-padel"},
];

export function LogoPicker({ value, onChange, size="lg", placeholder }: Props) {
  const [open,setOpen]=useState(false); const [tab,setTab]=useState<"galleria"|"loghi"|"bandiere">("loghi"); const [q,setQ]=useState(""); const [filter,setFilter]=useState<Filter>("tutti"); const fileRef=useRef<HTMLInputElement>(null);
  const box=size==="lg"?"h-20 w-20":size==="md"?"h-14 w-14":"h-12 w-12";
  const filtered=useMemo(()=>{ const s=q.trim().toLocaleLowerCase("it"); return TEAM_LOGOS.filter((logo)=>{ const category=filter==="tutti"||(filter==="calcio"?logo.category==="calcio-club":logo.category===filter); const search=!s||logo.name.toLocaleLowerCase("it").includes(s)||logo.searchTags.some((tag)=>tag.toLocaleLowerCase("it").includes(s)); return category&&search; }); },[filter,q]);
  const upload=(file?:File)=>{ if(!file?.type.startsWith("image/"))return; const reader=new FileReader(); reader.onload=()=>{if(typeof reader.result==="string"){onChange(reader.result);setOpen(false)}}; reader.readAsDataURL(file); };
  const pill=(active:boolean)=>`flex-shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-bold ${active?"border-primary bg-primary text-primary-foreground":"border-border text-muted-foreground"}`;
  return <>
    <button type="button" aria-label={placeholder??"Scegli logo"} onClick={()=>setOpen(true)} className={`${box} flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-primary/60 bg-background`}>
      {value?<img src={value} alt="Logo scelto" className="h-full w-full object-cover"/>:<ImagePlus className="h-6 w-6 text-primary" aria-hidden="true"/>}
    </button>
    {open&&<div className="fixed inset-0 z-[100] flex items-end justify-center bg-background/90 sm:items-center sm:p-4">
      <div className="flex h-[min(92dvh,52rem)] w-full flex-col rounded-t-2xl border border-primary/30 bg-background sm:max-w-2xl sm:rounded-2xl">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-5 pb-2"><h2 className="truncate text-2xl font-black text-primary">SCEGLI LOGO</h2><Button type="button" variant="ghost" size="icon" aria-label="Chiudi" onClick={()=>setOpen(false)} className="shrink-0 text-muted-foreground"><X aria-hidden="true"/></Button></div>
        <div className="px-4 pb-2"><div className="flex min-h-[65px] gap-2 overflow-x-auto overflow-y-visible py-3 pb-2">
          <button type="button" onClick={()=>setTab("galleria")} className={pill(tab==="galleria")}>📷 Galleria</button><button type="button" onClick={()=>setTab("loghi")} className={pill(tab==="loghi")}>🛡️ 170 loghi</button><button type="button" onClick={()=>setTab("bandiere")} className={pill(tab==="bandiere")}>🏳️ 20 nazionali</button>
        </div></div>
        {tab!=="galleria"&&<div className="relative px-4 pb-3"><Search className="absolute left-8 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true"/><input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Cerca: leone, scudo, fuoco..." className="field pl-11"/></div>}
        {tab==="loghi"&&<div className="px-4 pb-2"><div className="flex min-h-[65px] gap-2 overflow-x-auto overflow-y-visible py-3 pb-2">{FILTERS.map((item)=><button type="button" key={item.value} onClick={()=>setFilter(item.value)} className={pill(filter===item.value)}>{item.label}</button>)}</div></div>}
        {tab==="galleria"?<div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center"><ImagePlus className="h-12 w-12 text-primary" aria-hidden="true"/><p className="text-sm text-muted-foreground">Scegli una foto dal tuo dispositivo.</p><Button type="button" className="btn-gold px-5" onClick={()=>fileRef.current?.click()}>Scegli foto</Button><input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e)=>upload(e.target.files?.[0])}/></div>:<div className="grid flex-1 grid-cols-4 gap-3 overflow-y-auto p-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:grid-cols-6">{(tab==="bandiere"?filtered.filter((logo)=>logo.category==="calcio-nazionali"):filtered).map((logo)=><button type="button" key={logo.id} aria-label={logo.name} title={logo.name} onClick={()=>{onChange(renderTeamLogo(logo));setOpen(false)}} className="flex aspect-square items-center justify-center overflow-hidden rounded-full border-[3px] border-primary bg-secondary text-[2.6rem] leading-none transition-transform active:scale-95" style={{backgroundColor:logo.bgColor,color:logo.textColor}}>{logo.icon}</button>)}</div>}
      </div>
    </div>}
  </>;
}
export default LogoPicker;
