import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CollectionClient } from "./collection-client";

export const metadata = {
  title: "Collezione · MACCA",
  description:
    "72 opere distribuite nel territorio di Peccioli. Sfoglia la collezione per area, tipo, decennio o accesso.",
};

export default function CollezionePage() {
  return (
    <>
      <SiteHeader />
      <CollectionClient />
      <SiteFooter />
    </>
  );
}
