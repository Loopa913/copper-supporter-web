import { WikiShell } from "@/components/wiki/WikiShell";
import { checkIsAdmin } from "@/lib/auth/admin";
import { getWikiContent } from "@/lib/cms/wiki-content";

export const runtime = "edge";

export default async function WikiPage() {
  const isAdmin = await checkIsAdmin();
  const wikiContent = await getWikiContent();
  return (
    <div className="min-w-[1024px]">
      <WikiShell isAdmin={isAdmin} initialContent={wikiContent} />
    </div>
  );
}
