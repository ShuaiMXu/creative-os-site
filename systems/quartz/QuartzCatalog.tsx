import { SystemCatalog } from "../../packages/ui/SystemCatalog";
import registry from "./catalog.json";
export function QuartzCatalog({ lang }: { lang: string }) {
  return <SystemCatalog lang={lang} system="quartz" registry={registry} />;
}
