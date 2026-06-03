import { redirect } from "next/navigation";
import { createClientIfConfigured } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type AdminSession = {
  userId: string;
  email: string;
  role: string;
};

export async function requireAdmin(): Promise<AdminSession> {
  if (!isSupabaseConfigured()) {
    redirect("/admin/login?error=supabase_not_configured");
  }

  const supabase = await createClientIfConfigured();
  if (!supabase) {
    redirect("/admin/login?error=supabase_not_configured");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("role, email")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) {
    redirect("/admin/login?error=not_admin");
  }

  return {
    userId: user.id,
    email: profile.email ?? user.email ?? "",
    role: profile.role,
  };
}

export async function checkIsAdmin(): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  
  const supabase = await createClientIfConfigured();
  if (!supabase) return false;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  return !!profile;
}
