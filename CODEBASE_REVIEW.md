# MACCA — piattaforma: review multi-agente e risoluzioni

**Metodo.** Review a 29 agenti in due fasi: 5 revisori paralleli (architettura,
correttezza, UX/accessibilità, coerenza di design, onestà-dei-dati/performance)
hanno prodotto 55 finding; ogni finding critico/maggiore è stato verificato
adversarialmente da un agente indipendente istruito a *confutarlo* leggendo il
codice e il seed reale. Esito: **21 confermati, 3 confutati, 29 minori**.
Tutti i confermati e la maggior parte dei minori sono stati risolti; le
risoluzioni sono state ri-verificate con test headless su build di produzione.

## Confermati → risolti

| # | Gravità | Finding | Risoluzione |
|---|---|---|---|
| C1 | critico | Il jitter della mappa collassava: 53 opere di Peccioli impilate in ~13px (hash di id sequenziali quasi identici) | Spirale phyllotaxis (angolo aureo) indicizzata per area: spaziatura minima garantita; verificate 72 posizioni distinte |
| C2 | maggiore | Lista Esplora: `Link` dentro `button` (HTML invalido; la selezione navigava via) | `MapResultCard` ha una variante `onSelect` che rende un vero `button`; selezione senza navigazione verificata |
| C3 | maggiore | Bottom sheet non usabile da tastiera | Enter/Space/frecce cambiano lo snap; `aria-expanded` + label di stato; token `rounded-t-sheet` |
| C4 | maggiore | 4 link `/luoghi/*` in 404 (collisione AreaSlug ↔ location_id) + lookup QR sempre nullo | Helper `locationForArea()`; link Visita e QR risolti (verificato: tutti 200) |
| C5 | maggiore | L'intero seed (109 KB, incl. registro diritti e coda verifiche interne) finiva nel bundle client | Prebuild emette `macca.client.json` (66 KB, senza dati interni); `lib/governance.ts` è server-only (`server-only`); verificato: stringhe interne assenti dai chunk |
| C6 | minore | Seed caricato con double-cast senza validazione | Validazione a build-time nel prebuild (enum, id duplicati, titoli mancanti → build fallisce) |
| C7/C8 | maggiore | Match tappe→opere per titolo esatto: falliva su troncamenti/ellissi e collideva sui 4 "Senza titolo" | Matcher a 3 livelli (esatto → prefisso univoco → primo segmento), rifiuta i match ambigui |
| C9 | maggiore | "Public / confirm access" (Breath) classificato libero accesso | `confirm` valutato per primo nel classificatore |
| C10 | maggiore | Traccia percorso (SVG `slice`) e marker (percentuali CSS) su due mappature diverse | Traccia in SVG dedicato con `preserveAspectRatio="none"` — coincide coi marker a ogni aspect ratio |
| C11 | maggiore | Drawer filtri senza focus management/Escape/scroll-lock | Hook condiviso `useModalBehavior` (trap, Escape, lock, restore) su Collezione ed Esplora |
| C12 | maggiore | `Chip` senza `aria-pressed` | Aggiunto quando `active` è definito |
| C13 | maggiore | Percorso attivo: CTA "Continua" e "Aggiungi" senza handler | Continua avanza (stato locale) fino a "Percorso completato ✓"; picker inline per aggiungere tappe; traccia ricalcolata dalla lista corrente |
| C14 | minore | "Salva"/"Avvia" del costruttore erano span finti, nascosti su mobile | Salva → localStorage con feedback; Avvia → link reale Google Maps multi-tappa; visibili ovunque |
| C15 | maggiore | `ink-60` 4.13:1 e `ink-40` 2.74:1 sotto AA | Token ricalibrati: `#615e54` (≥5.5:1) e `#6f6b5f` (≥4.5:1) su paper/stone/tint |
| C16 | maggiore | Marker interattivi con hit-area 14–18px | Area di tocco estesa (`p-2 -m-2`, ≥32px) senza spostare il glifo |
| C17 | maggiore | Nessun link "salta al contenuto" | Skip-link in layout + target `#contenuto` focusable |
| C19 | maggiore | Modalità EN con badge solo in italiano (`labelEn` mai usato) | Badge di accesso/confidenza localizzati via `useLang`; stringa raw del seed conservata nel `title` |
| C20 | maggiore | Numeri dei marker mappa ≠ numeri della lista tappe (4 rotte su 5) | `routeStops` porta il numero della lista completa; allineato anche nel percorso attivo |
| C21 | minore | Tempo a piedi del costruttore senza marcatore di stima | "A piedi (stima)", asterischi e nota "stime dimostrative su mappa astratta" |
| C18 | minore | 6 CTA terracotta re-implementate a mano con drift | Unificate sulle classi di `Button`/design system |

**Minori risolti in corsa:** normalizzazione ricerca (accenti/apostrofi tipografici),
stato-vuoto Salvati con slug obsoleti, `document.lang` ripristinato al load,
menu mobile con Escape+`aria-controls`, "Ricerche frequenti"→"Suggerimenti",
copy Visita senza capacità inventate, descrizione overlay mostrata nel pannello
Esplora, ordine scultura/architettura nel classificatore categorie, destinazione
reale nei link Google Maps >10 tappe, `FALLBACK_EN` morto rimosso, manifest
immagini valida i work_id (file orfani segnalati, non ignorati in silenzio).

## Confutati (comportamento corretto, nessuna azione)
- Loop di back-fill delle route su `works`: sicuro per semantica ESM.
- Tile dimostrative: feature documentata e reversibile (`npm run demo:clear`), non foto finte.
- Giallo notturno `#e8c14e`: proviene dallo handoff di design.

## Limitazioni note (accettate e documentate)
- I testi editoriali restano Italian-first (il toggle EN copre chrome e badge);
  contenuti EN curati arriveranno col content pack.
- Tempi/distanze del costruttore restano stime dimostrative finché non esistono
  tracciati GPS verificati (il seed le marca "TBD after GPS trace").
- `playwright-core` in devDependencies serve alla verifica headless del progetto.
