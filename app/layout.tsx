import type { Metadata, Viewport } from "next";
import { Inter, Fraunces, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/language-provider";
import { BottomNav } from "@/components/bottom-nav";

const sans = Inter({
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

export const metadata: Metadata = {
  title: "MACCA — Museo d'Arte Contemporanea a Cielo Aperto",
  description:
    "Un museo diffuso nel paesaggio di Peccioli. Mappa, percorsi, opere e visita di un museo d'arte contemporanea a cielo aperto.",
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
