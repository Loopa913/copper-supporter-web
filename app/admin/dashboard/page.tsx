import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { getHomeContent } from "@/lib/cms/home-content";
import { getWikiContent } from "@/lib/cms/wiki-content";
import { requireAdmin } from "@/lib/auth/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const runtime = "edge";

export default async function AdminDashboardPage() {
  const session = await requireAdmin();
  const homeContent = await getHomeContent();
  const wikiContent = await getWikiContent();

  return (
    <AdminDashboard
      session={session}
      homeContent={homeContent}
      wikiContent={wikiContent}
      supabaseConnected={isSupabaseConfigured()}
    />
  );
}
