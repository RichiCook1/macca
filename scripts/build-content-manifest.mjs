// Prebuild data step (runs before `dev` and `build`):
//   1. Scans public/images/works → src/data/macca.images.generated.json
//      (drop <work_id>.jpg to add a hero image; <work_id>__2.jpg etc. for extras)
//   2. Emits src/data/macca.client.json — the CLIENT-SAFE subset of the seed.
//      The full seed (asset_rights_register, verification_queue, internal build
//      notes) stays server-only via lib/governance.ts and never ships to browsers.
//   3. Validates: image filenames must match real work_ids; seed enum values the
//      classifiers rely on are checked so seed drift fails loudly at build time.
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, extname, basename } from "node:path";

const ROOT = process.cwd();
const IMG_DIR = join(ROOT, "public", "images", "works");
const OUT_IMAGES = join(ROOT, "src", "data", "macca.images.generated.json");
const OUT_CLIENT = join(ROOT, "src", "data", "macca.client.json");
const EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".svg"]);

const seed = JSON.parse(readFileSync(join(ROOT, "src", "data", "macca.collection.json"), "utf8"));
const workIds = new Set(seed.works.map((w) => w.work_id));

// ---- 1. image manifest ----
if (!existsSync(IMG_DIR)) mkdirSync(IMG_DIR, { recursive: true });
const map = {};
const orphans = [];
for (const file of readdirSync(IMG_DIR)) {
  const ext = extname(file).toLowerCase();
  if (!EXT.has(ext)) continue;
  // Filename → work_id. work_ids end in "-NNN", so additional images for a work
  // use a "__N" suffix (double underscore): macca-010.jpg, macca-010__2.jpg, …
  const stem = basename(file, ext);
  const workId = stem.split("__")[0];
  if (!workIds.has(workId)) {
    orphans.push(file);
    continue;
  }
  (map[workId] ??= []).push(`/images/works/${file}`);
}
for (const k of Object.keys(map)) map[k].sort();
writeFileSync(OUT_IMAGES, JSON.stringify(map, null, 2) + "\n");
const total = Object.values(map).reduce((n, a) => n + a.length, 0);
console.log(`[content-manifest] ${total} image(s) across ${Object.keys(map).length} work(s)`);
if (orphans.length) {
  console.warn(
    `[content-manifest] WARNING: ${orphans.length} image(s) don't match any work_id and were IGNORED: ${orphans.slice(0, 8).join(", ")}${orphans.length > 8 ? "…" : ""}`
  );
}

// ---- 2. client-safe seed subset ----
const client = {
  schema_version: seed.schema_version,
  generated_at: seed.generated_at,
  works: seed.works,
  locations: seed.locations,
  routes: seed.routes,
  // Flagship: only the fields the UI renders — build notes and page-module
  // instructions are internal and stay server-side.
  flagship_content: seed.flagship_content.map((f) => ({
    feature_id: f.feature_id,
    work_id: f.work_id,
    story_lens: f.story_lens,
    publication_state: f.publication_state,
  })),
};
writeFileSync(OUT_CLIENT, JSON.stringify(client) + "\n");
console.log(
  `[content-manifest] client seed: ${(Buffer.byteLength(JSON.stringify(client)) / 1024).toFixed(0)} KB (full seed stays server-only)`
);

// ---- 3. seed validation (loud, not silent) ----
const problems = [];
const conf = new Set(["High", "Medium", "Low"]);
for (const w of seed.works) {
  if (!conf.has(w.data_confidence)) problems.push(`${w.work_id}: data_confidence "${w.data_confidence}"`);
  if (typeof w.year !== "number") problems.push(`${w.work_id}: year is not a number`);
  if (!w.title_it) problems.push(`${w.work_id}: missing title_it`);
}
const idCount = seed.works.length;
if (workIds.size !== idCount) problems.push(`duplicate work_id detected (${idCount} works, ${workIds.size} unique ids)`);
if (problems.length) {
  console.error(`[content-manifest] SEED VALIDATION FAILED:\n  - ${problems.join("\n  - ")}`);
  process.exit(1);
}
console.log("[content-manifest] seed validation OK");
