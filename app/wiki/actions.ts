"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { getWikiContent } from "@/lib/cms/wiki-content";
import { updateSiteContent } from "@/app/admin/actions";

export async function saveWikiPageContent(pageId: string, contentJson: string) {
  const session = await requireAdmin();
  if (!session) throw new Error("Unauthorized");

  const wikiContent = await getWikiContent();
  
  // Find the page and update its content
  let pageFound = false;
  const updatedPages = wikiContent.pages.map((page) => {
    if (page.id === pageId) {
      pageFound = true;
      return { ...page, content: contentJson };
    }
    return page;
  });

  if (!pageFound) {
    throw new Error("Page not found");
  }

  // Save back to site_content
  await updateSiteContent("wiki", "pages", JSON.stringify(updatedPages));
  
  // Revalidate wiki paths
  revalidatePath("/wiki");
}
