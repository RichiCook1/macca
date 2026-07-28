// Generates clearly-labelled DEMONSTRATION image tiles (SVG) for every work, so
// the prototype looks populated before real, rights-cleared photography arrives.
// These are NOT the artworks — each is stamped "immagine dimostrativa · sostituire".
// Replace by dropping a real <work_id>.jpg into public/images/works/ (the .jpg
// becomes the hero); delete the matching .svg when you no longer want the demo tile.
//
//   node scripts/gen-demo-images.mjs          # generate for all works
//   node scripts/gen-demo-images.mjs --clear  # remove all demo .svg tiles
import { readFileSync, writeFileSync, mkdirSync, readdirSync, unlinkSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const IMG_DIR = join(ROOT, "public", "images", "works");
const seed = JSON.parse(readFileSync(join(ROOT, "src", "data", "macca.collection.json"), "utf8"));
mkdirSync(IMG_DIR, { recursive: true });

if (process.argv.includes("--clear")) {
  let n = 0;
  for (const f of readdirSync(IMG_DIR)) if (f.endsWith(".svg")) { unlinkSync(join(IMG_DIR, f)); n++; }
  console.log(`[demo-images] removed ${n} demo tile(s)`);
  process.exit(0);
}

// MACCA palette — quiet base, structural accents.
const palettes = [
  { bg: "#e7e2d6", a: "#c0573a", b: "#4a5d4e" },
  { bg: "#dbe2e1", a: "#4a5d4e", b: "#c0573a" },
  { bg: "#e9e3d4", a: "#c79a2e", b: "#34322d" },
  { bg: "#cdd6d8", a: "#5b7790", b: "#c0573a" },
  { bg: "#e4ded0", a: "#34322d", b: "#c0573a" },
];
const night = { bg: "#283042", a: "#e8c14e", b: "#5b7790" };

const hash = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function tile(w) {
  const isNight = /night/i.test(w.access_type);
  const h = hash(w.work_id);
  const p = isNight ? night : palettes[h % palettes.length];
  const ink = isNight ? "#dfe4ee" : "#34322d";
  const cx = 240 + (h % 700);
  const cy = 180 + ((h >> 3) % 360);
  const r = 120 + ((h >> 6) % 220);
  const rot = -12 + ((h >> 9) % 24);
  // No title/artist baked in — cards overlay their own labels. Keep it an abstract,
  // clearly-marked placeholder so it reads as "demo" wherever it appears.
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
  <rect width="1200" height="900" fill="${p.bg}"/>
  <g opacity="0.45" transform="rotate(${rot} 600 450)">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${p.a}" stroke-width="2" stroke-dasharray="3 10"/>
    <circle cx="${cx}" cy="${cy}" r="${Math.round(r * 0.6)}" fill="none" stroke="${p.b}" stroke-width="2" stroke-dasharray="3 10"/>
    <line x1="-50" y1="${cy + 120}" x2="1250" y2="${cy - 40}" stroke="${p.a}" stroke-width="2" opacity="0.6"/>
  </g>
  <circle cx="${cx}" cy="${cy}" r="22" fill="${p.a}" stroke="${ink}" stroke-width="3"/>
  <rect x="24" y="24" width="1152" height="852" fill="none" stroke="${ink}" stroke-opacity="0.25" stroke-width="2"/>
  <text x="600" y="460" text-anchor="middle" font-family="ui-monospace,monospace" font-size="22" letter-spacing="4" fill="${ink}" opacity="0.55">IMMAGINE DIMOSTRATIVA · SOSTITUIRE</text>
</svg>`;
}

let n = 0;
for (const w of seed.works) {
  writeFileSync(join(IMG_DIR, `${w.work_id}.svg`), tile(w));
  n++;
}
console.log(`[demo-images] wrote ${n} demonstration tile(s) to ${IMG_DIR}`);
