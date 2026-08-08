import PortfolioManager from "@/components/admin/PortfolioManager";
import { getPortfolioItems } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminPortfolioPage() {
  const items = await getPortfolioItems();
  return <PortfolioManager initialItems={items} />;
}
