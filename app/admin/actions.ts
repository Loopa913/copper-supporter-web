"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { createClientIfConfigured } from "@/lib/supabase/server";

export async function updateSiteContent(section: string, key: string, value: unknown) {
  const session = await requireAdmin();
  if (!session) throw new Error("Unauthorized");

  const supabase = await createClientIfConfigured();
  if (!supabase) throw new Error("Supabase is not configured");

  // Upsert the content (insert if not exists, update if exists)
  const { error } = await supabase
    .from("site_content")
    .upsert(
      { section, key, value },
      { onConflict: "section,key" }
    );

  if (error) {
    console.error("Error updating site content:", error);
    throw new Error("Failed to update content");
  }

  // Revalidate the home page so changes reflect immediately
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
  revalidatePath("/wiki");
}
