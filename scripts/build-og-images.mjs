// Prebuild step: derive share-card images for social previews.
//
// WhatsApp (and to a lesser degree iMessage/Telegram) silently drops link
// previews whose image is too heavy — most of the collection's photography is
// 600KB–13MB, so sharing an artwork produced a card with no picture. This
// renders a 1200x630 JPEG per photographed work into public/images/og/,
// typically 80–200KB, and writes a manifest the metadata layer reads so it
// only ever points at a card that actually exists.
//
// Deliberately picture-only: the title and artist are supplied by the Open
// Graph tags themselves, so there is no text to render — which also keeps this
// independent of whatever fonts happen to exist on the build machine.
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync, readdirSync } from "node:fs";
import { join, basename, extname } from "node:path";

const ROOT = process.cwd();
const SRC_DIR = join(ROOT, "public", "images", "works");
const OUT_DIR = join(ROOT, "public", "images", "og");
const MANIFEST = join(ROOT, "src", "data", "macca.og.generated.json");

const WIDTH = 1200;
const HEIGHT = 630; // 1.91:1 — the ratio WhatsApp/Facebook crop to
const QUALITY = 78;

let sharp;
try {
  ({ default: sharp } = await import("sharp"));
} catch {
  console.warn(
    "[og-images] sharp unavailable — skipping share-card generation. " +
      "Link previews will fall back to the site-level image."
  );
  writeFileSync(MANIFEST, "{}\n");
  process.exit(0);
}

mkdirSync(OUT_DIR, { recursive: true });

const sources = existsSync(SRC_DIR)
  ? readdirSync(SRC_DIR).filter((f) => extname(f).toLowerCase() === ".jpg")
  : [];

const manifest = {};
let built = 0;
let reused = 0;
let failed = 0;

for (const file of sources) {
  const id = basename(file, ".jpg");
  // Additional images (macca-010__2.jpg) are not the hero — skip them.
  if (id.includes("__")) continue;

  const src = join(SRC_DIR, file);
  const out = join(OUT_DIR, `${id}.jpg`);
  const rel = `/images/og/${id}.jpg`;

  // Only rebuild when the source is newer than the card.
  if (existsSync(out) && statSync(out).mtimeMs >= statSync(src).mtimeMs) {
    manifest[id] = rel;
    reused++;
    continue;
  }

  try {
    await sharp(src)
      .rotate() // honour EXIF orientation
      .resize(WIDTH, HEIGHT, { fit: "cover", position: "attention" })
      .jpeg({ quality: QUALITY, progressive: true, mozjpeg: true })
      .toFile(out);
    manifest[id] = rel;
    built++;
  } catch (err) {
    failed++;
    console.warn(`[og-images] could not build a card for ${id}: ${err.message}`);
  }
}

writeFileSync(MANIFEST, JSON.stringify(manifest, null, 1) + "\n");

const sizes = Object.values(manifest)
  .map((p) => {
    try {
      return statSync(join(ROOT, "public", p.replace(/^\//, ""))).size;
    } catch {
      return 0;
    }
  })
  .filter(Boolean);
const maxKb = sizes.length ? Math.round(Math.max(...sizes) / 1024) : 0;
const avgKb = sizes.length
  ? Math.round(sizes.reduce((a, b) => a + b, 0) / sizes.length / 1024)
  : 0;

console.log(
  `[og-images] ${Object.keys(manifest).length} share card(s) — ${built} built, ${reused} reused` +
    (failed ? `, ${failed} failed` : "") +
    ` · avg ${avgKb}KB, max ${maxKb}KB`
);
if (maxKb > 600) {
  console.warn("[og-images] WARNING: a card exceeds 600KB — WhatsApp may skip it.");
}
