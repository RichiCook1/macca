import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { FeedClient } from "./feed-client";

export const metadata = {
  title: "Esplora le opere · MACCA",
  description:
    "72 opere nel territorio. Lasciati guidare dalle immagini, poi apri la scheda o trovala sulla mappa.",
};

export default function OperePage() {
  return (
    <>
      <SiteHeader />
      <FeedClient />
      <SiteFooter />
    </>
  );
}
