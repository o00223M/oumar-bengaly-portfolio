import PartnersManager from "@/components/admin/PartnersManager";
import { getPartners } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminPartnersPage() {
  const partners = await getPartners();
  return <PartnersManager initialPartners={partners} />;
}
