import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Fraunces, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/language-provider";
import { BottomNav } from "@/components/bottom-nav";
import { SITE_URL, SITE_NAME, SITE_TAGLINE, socialImage } from "@/lib/site";

const sans = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Warm editorial serif — used only for titles, quotations and long-form moments.
const serif = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const DESCRIPTION =
  "Un museo diffuso nel paesaggio di Peccioli. Mappa, percorsi, opere e visita di un museo d'arte contemporanea a cielo aperto.";

export const metadata: Metadata = {
  // Absolute URLs for social cards are resolved against this.
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    // Page titles read "Breath — MACCA" rather than repeating the tagline.
    template: `%s — ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "it_IT",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: DESCRIPTION,
    url: "/",
    images: socialImage() ? [socialImage()!] : undefined,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: DESCRIPTION,
    images: socialImage() ? [socialImage()!.url] : undefined,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // safe-area insets for the bottom tab bar / field bars
  themeColor: "#f0ece2",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
      <body>
        <a
          href="#contenuto"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:border focus:border-ink focus:bg-paper focus:px-4 focus:py-2"
        >
          Salta al contenuto
        </a>
        <LanguageProvider>
          <div id="contenuto" tabIndex={-1} className="outline-none">
            {children}
          </div>
          <BottomNav />
        </LanguageProvider>
      </body>
    </html>
  );
}
