import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { getHomeContent } from "@/lib/cms/home-content";
import { getWikiContent } from "@/lib/cms/wiki-content";
import { getProtocolContent } from "@/lib/cms/protocol-content";
import { getShopContent } from "@/lib/cms/shop-content";
import { getGlobalConfig } from "@/lib/cms/global-config";
import { requireAdmin } from "@/lib/auth/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const runtime = "edge";

export default async function AdminDashboardPage() {
  const session = await requireAdmin();
  const homeContent = await getHomeContent();
  const wikiContent = await getWikiContent();
  const protocolContent = await getProtocolContent();
  const shopContent = await getShopContent();
  const globalConfig = await getGlobalConfig();

  return (
    <AdminDashboard
      session={session}
      homeContent={homeContent}
      wikiContent={wikiContent}
      protocolContent={protocolContent}
      shopContent={shopContent}
      globalConfig={globalConfig}
      supabaseConnected={isSupabaseConfigured()}
    />
  );
}
