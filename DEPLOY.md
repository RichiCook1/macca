# Deploying the MACCA live demo

The app is a standard **Next.js 15** project — Vercel auto-detects everything, no
config required. The build runs `npm run build`, which first regenerates the image
manifest (`prebuild` hook) and then `next build`.

## Option A — GitHub → Vercel (recommended)

1. **Create an empty GitHub repo** (e.g. `macca-prototype`). Don't add a README.
2. **Push this branch** from the project root:
   ```bash
   git remote add origin https://github.com/<you>/macca-prototype.git
   git push -u origin implement-macca-app        # or: git push origin HEAD:main
   ```
3. **Import to Vercel:** vercel.com → *Add New… → Project* → pick the repo.
   - Framework preset: **Next.js** (auto)
   - Build command: `npm run build` (default)
   - Output: `.next` (default)
   - Environment variables: optional — add `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
     (Google Cloud → Maps JavaScript API) to enable the embedded real map
     ("Reale · Google" toggle in Esplora). Everything else works without it:
     the stylized map and the external Google Maps direction links need no key.
4. Click **Deploy**. You'll get a public `*.vercel.app` URL. Every push redeploys.

## Option B — Vercel CLI (deploy straight from here)

If you give me a **Vercel token** (`VERCEL_TOKEN`), I can deploy from this
environment:
```bash
npx vercel deploy --prebuilt --token $VERCEL_TOKEN
```
(Outbound network is restricted in this sandbox, so this may need the network
policy to allow `vercel.com` / `api.vercel.com`.)

## Notes
- **Images** in `public/images/works/` (incl. the demo tiles) are committed, so
  they deploy as-is. Replace them with real photos anytime — see `CONTENT_PACK.md`.
- `src/data/macca.images.generated.json` is regenerated at build, so it's always
  in sync with whatever images are present.
- No database, no secrets, no server runtime config — it's fully static/SSG.
- To strip the demo tiles before a public launch: `npm run demo:clear` then commit.
