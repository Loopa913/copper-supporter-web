import { createClientIfConfigured } from "@/lib/supabase/server";

export type GlobalConfig = {
  logoUrl: string | null;
};

export function getDefaultGlobalConfig(): GlobalConfig {
  return {
    logoUrl: null,
  };
}

function parseJsonValue<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  }
  return value as T;
}

export async function getGlobalConfig(): Promise<GlobalConfig> {
  const supabase = await createClientIfConfigured();
  if (!supabase) return getDefaultGlobalConfig();

  const { data, error } = await supabase
    .from("site_content")
    .select("section, key, value")
    .eq("section", "global");

  if (error || !data?.length) {
    return getDefaultGlobalConfig();
  }

  const map = new Map(data.map((r) => [r.key, r.value]));
  const defaults = getDefaultGlobalConfig();

  return {
    logoUrl: parseJsonValue(map.get("logoUrl"), defaults.logoUrl),
  };
}
