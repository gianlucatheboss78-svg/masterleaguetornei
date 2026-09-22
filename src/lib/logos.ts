/** Libreria loghi: 100 emblemi x 10 palette = 1000 loghi ricercabili. */

export type Emblem = { icon: string; name: string };

export const EMBLEMS: Emblem[] = [
  { icon: "🦁", name: "Leone" }, { icon: "🐯", name: "Tigre" }, { icon: "🐺", name: "Lupo" },
  { icon: "🦅", name: "Aquila" }, { icon: "🐻", name: "Orso" }, { icon: "🐗", name: "Cinghiale" },
  { icon: "🐂", name: "Toro" }, { icon: "🐎", name: "Cavallo" }, { icon: "🦈", name: "Squalo" },
  { icon: "🐬", name: "Delfino" }, { icon: "🐉", name: "Drago" }, { icon: "🦂", name: "Scorpione" },
  { icon: "🐍", name: "Serpente" }, { icon: "🦉", name: "Gufo" }, { icon: "🦊", name: "Volpe" },
  { icon: "🐆", name: "Ghepardo" }, { icon: "🦏", name: "Rinoceronte" }, { icon: "🐘", name: "Elefante" },
  { icon: "🦍", name: "Gorilla" }, { icon: "🐊", name: "Coccodrillo" }, { icon: "🦌", name: "Cervo" },
  { icon: "🐓", name: "Gallo" }, { icon: "🦇", name: "Pipistrello" }, { icon: "🐝", name: "Ape" },
  { icon: "🦀", name: "Granchio" }, { icon: "🐙", name: "Piovra" }, { icon: "🦑", name: "Calamaro" },
  { icon: "🐧", name: "Pinguino" }, { icon: "🦢", name: "Cigno" }, { icon: "🕊️", name: "Colomba" },
  { icon: "⚽", name: "Pallone calcio" }, { icon: "🏀", name: "Basket" }, { icon: "🏐", name: "Volley" },
  { icon: "🎾", name: "Tennis" }, { icon: "🏓", name: "Ping pong" }, { icon: "🤾", name: "Pallamano" },
  { icon: "🏉", name: "Rugby" }, { icon: "🎯", name: "Freccette" }, { icon: "🥅", name: "Porta" },
  { icon: "🏆", name: "Trofeo" },
  { icon: "🥇", name: "Oro medaglia" }, { icon: "🏅", name: "Medaglia" }, { icon: "👑", name: "Corona" },
  { icon: "⭐", name: "Stella" }, { icon: "🌟", name: "Stella brillante" }, { icon: "✨", name: "Scintille" },
  { icon: "⚡", name: "Fulmine" }, { icon: "🔥", name: "Fuoco" }, { icon: "💥", name: "Esplosione" },
  { icon: "🌊", name: "Onda" }, { icon: "❄️", name: "Ghiaccio" }, { icon: "☀️", name: "Sole" },
  { icon: "🌙", name: "Luna" }, { icon: "🌍", name: "Mondo" }, { icon: "🌋", name: "Vulcano" },
  { icon: "🏔️", name: "Montagna" }, { icon: "🌵", name: "Cactus" }, { icon: "🍀", name: "Quadrifoglio" },
  { icon: "🌹", name: "Rosa" }, { icon: "🌻", name: "Girasole" }, { icon: "🌲", name: "Pino" },
  { icon: "🛡️", name: "Scudo" }, { icon: "⚔️", name: "Spade" }, { icon: "🗡️", name: "Spada" },
  { icon: "🏹", name: "Arco" }, { icon: "🪓", name: "Ascia" }, { icon: "🔱", name: "Tridente" },
  { icon: "⚓", name: "Ancora" }, { icon: "🚀", name: "Razzo" }, { icon: "🛰️", name: "Satellite" },
  { icon: "🏎️", name: "Auto da corsa" }, { icon: "🏍️", name: "Moto" }, { icon: "🚲", name: "Bici" },
  { icon: "⛵", name: "Barca" }, { icon: "✈️", name: "Aereo" }, { icon: "🚂", name: "Treno" },
  { icon: "🎸", name: "Chitarra" }, { icon: "🥁", name: "Tamburo" }, { icon: "🎺", name: "Tromba" },
  { icon: "🎭", name: "Maschere" }, { icon: "🎮", name: "Gaming" }, { icon: "🕹️", name: "Joystick" },
  { icon: "💎", name: "Diamante" }, { icon: "💰", name: "Oro soldi" }, { icon: "🔔", name: "Campana" },
  { icon: "🧿", name: "Occhio" }, { icon: "☠️", name: "Teschio" }, { icon: "👻", name: "Fantasma" },
  { icon: "🤖", name: "Robot" }, { icon: "👽", name: "Alieno" }, { icon: "🦸", name: "Supereroe" },
  { icon: "🥊", name: "Boxe" }, { icon: "🧤", name: "Guanto" }, { icon: "🏁", name: "Traguardo" },
  { icon: "🚩", name: "Bandiera" }, { icon: "🍕", name: "Pizza" }, { icon: "☕", name: "Caffè" },
  { icon: "🍺", name: "Birra" },
];

export type Palette = { id: string; name: string; from: string; to: string; ring: string };

export const PALETTES: Palette[] = [
  { id: "oro", name: "Oro Champions", from: "#F6D97A", to: "#C9972B", ring: "#0E1633" },
  { id: "notte", name: "Blu notte", from: "#27356F", to: "#0C1230", ring: "#D4AF37" },
  { id: "royal", name: "Royal", from: "#3A5BD9", to: "#16215C", ring: "#F6D97A" },
  { id: "rosso", name: "Rosso fuoco", from: "#F0635C", to: "#8E1212", ring: "#F6D97A" },
  { id: "verde", name: "Verde prato", from: "#5BD98A", to: "#11603A", ring: "#0E1633" },
  { id: "nero", name: "Nero oro", from: "#3A3A3A", to: "#0B0B0B", ring: "#D4AF37" },
  { id: "viola", name: "Viola", from: "#A277F0", to: "#3B1E75", ring: "#F6D97A" },
  { id: "azzurro", name: "Azzurro", from: "#6FD3F5", to: "#0E5C8A", ring: "#0E1633" },
  { id: "arancio", name: "Arancio", from: "#FFB25C", to: "#B45309", ring: "#0E1633" },
  { id: "argento", name: "Argento", from: "#E7ECF5", to: "#8A93A8", ring: "#0E1633" },
];

export type LogoItem = { id: string; icon: string; name: string; palette: Palette };

export const LOGO_LIBRARY: LogoItem[] = EMBLEMS.flatMap((e) =>
  PALETTES.map((p) => ({ id: `${e.icon}-${p.id}`, icon: e.icon, name: e.name, palette: p })),
);

/** Disegna il logo su canvas e restituisce un dataURL PNG tondo. */
export function renderLogo(icon: string, palette: Palette, size = 256): string {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  if (!ctx) return "";
  const g = ctx.createLinearGradient(0, 0, size, size);
  g.addColorStop(0, palette.from);
  g.addColorStop(1, palette.to);
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - 6, 0, Math.PI * 2);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.lineWidth = 10;
  ctx.strokeStyle = palette.ring;
  ctx.stroke();
  ctx.font = `${size * 0.5}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(icon, size / 2, size * 0.55);
  return c.toDataURL("image/png");
}
