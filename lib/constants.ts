import type { AccessClass, MapConfidence, DataConfidence } from "./collection";

export { COLLECTION_TOTAL } from "./collection";

// Access-class hierarchy. State is communicated by text + a colour/shape token,
// never colour alone. The work's exact `accessRaw` string is shown alongside.
export const accessMeta: Record<
  AccessClass,
  { label: string; labelEn: string; dot: string; shape: "dot" | "square" | "pill" }
> = {
  "public-exterior": {
    label: "All'aperto · libero accesso",
    labelEn: "Open air · free access",
    dot: "#4a5d4e",
    shape: "dot",
  },
  "dependent-hours": {
    label: "Orari dipendenti · da verificare",
    labelEn: "Dependent hours · to confirm",
    dot: "#5b7790",
    shape: "dot",
  },
  booking: {
    label: "Su prenotazione / accesso controllato",
    labelEn: "Booking / controlled access",
    dot: "#c79a2e",
    shape: "dot",
  },
  church: {
    label: "Contesto chiesa / oratorio",
    labelEn: "Church / oratory context",
    dot: "#34322d",
    shape: "square",
  },
  "semi-public": {
    label: "Semi-pubblico · contesto dipendente",
    labelEn: "Semi-public · dependent context",
    dot: "#5b7790",
    shape: "pill",
  },
  mixed: {
    label: "Misto interno/esterno",
    labelEn: "Mixed indoor/outdoor",
    dot: "#c0573a",
    shape: "square",
  },
  confirm: {
    label: "Accesso da confermare",
    labelEn: "Access to confirm",
    dot: "#9a957f",
    shape: "pill",
  },
};

// Map-confidence labels — the honesty rule. None of the seed records is a verified
// exact pin, so every state communicates approximation or site-level anchoring.
export const confidenceMeta: Record<
  MapConfidence,
  { label: string; labelEn: string; hint: string }
> = {
  exact: {
    label: "Posizione esatta",
    labelEn: "Exact location",
    hint: "Coordinate verificate · avvicinamento sicuro",
  },
  site: {
    label: "Coordinate a livello di sito",
    labelEn: "Site-level coordinates",
    hint: "Punta al sito o all'ingresso, non alla singola opera",
  },
  address: {
    label: "Geolocalizzazione su indirizzo",
    labelEn: "Address-level geocode",
    hint: "Posizione indicativa, da verificare sul campo",
  },
  cluster: {
    label: "Cluster di sito",
    labelEn: "Site cluster",
    hint: "Più opere sullo stesso sito; nessuna posizione per singola opera",
  },
  area: {
    label: "Solo a livello di area",
    labelEn: "Area-level only",
    hint: "Posizione in verifica · nessun pin preciso",
  },
  external: {
    label: "Coordinate da fonte esterna",
    labelEn: "External-source coordinates",
    hint: "In attesa di conferma MACCA",
  },
};

export const dataConfidenceMeta: Record<DataConfidence, { label: string; tone: string }> = {
  High: { label: "Dati: alta affidabilità", tone: "#4a5d4e" },
  Medium: { label: "Dati: media affidabilità", tone: "#c79a2e" },
  Low: { label: "Dati: bassa affidabilità", tone: "#c0573a" },
};

export const categories = [
  "Scultura",
  "Pittura/Colore",
  "Luce",
  "Voce/Suono",
  "Installazione",
  "Architettura",
  "Video",
] as const;

export const decades = ["1991-2000", "2001-2010", "2011-2020", "2021-oggi"] as const;

export const decadeLabel: Record<string, string> = {
  "1991-2000": "1991–2000",
  "2001-2010": "2001–2010",
  "2011-2020": "2011–2020",
  "2021-oggi": "2021–oggi",
};
