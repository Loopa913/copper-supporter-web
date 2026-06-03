"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { getWikiContent } from "@/lib/cms/wiki-content";
import { updateSiteContent } from "@/app/admin/actions";

export async function saveWikiPageContent(pageId: string, contentJson: string) {
  const session = await requireAdmin();
  if (!session) throw new Error("Unauthorized");

  const wikiContent = await getWikiContent();
  
  let found = false;
  
  // First, check if it's a page
  const updatedPages = wikiContent.pages.map((page) => {
    if (page.id === pageId) {
      found = true;
      return { ...page, content: contentJson };
    }
    return page;
  });

  if (found) {
    // Save back to site_content
    await updateSiteContent("wiki", "pages", JSON.stringify(updatedPages));
  } else {
    // Check if it's a category
    const updatedCategories = wikiContent.categories.map((cat) => {
      if (cat.id === pageId) {
        found = true;
        return { ...cat, content: contentJson };
      }
      return cat;
    });

    if (found) {
      await updateSiteContent("wiki", "categories", JSON.stringify(updatedCategories));
    } else {
      throw new Error("Page or Category not found");
    }
  }
  
  // Revalidate wiki paths
  revalidatePath("/wiki");
}
