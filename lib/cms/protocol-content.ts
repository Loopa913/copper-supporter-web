import { PROTOCOL_TABS, type ProtocolTabKey } from "@/lib/data/protocol";
import { createClientIfConfigured } from "@/lib/supabase/server";

export type ProtocolContent = {
  processImageUrl: string | null;
  tabs: typeof PROTOCOL_TABS;
};

export function getDefaultProtocolContent(): ProtocolContent {
  return {
    processImageUrl: null,
    tabs: PROTOCOL_TABS,
  };
}

function parseJsonValue<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  }
  return value as T;
}

export async function getProtocolContent(): Promise<ProtocolContent> {
  const supabase = await createClientIfConfigured();
  if (!supabase) return getDefaultProtocolContent();

  const { data, error } = await supabase
    .from("site_content")
    .select("section, key, value")
    .eq("section", "protocol");

  if (error || !data?.length) {
    return getDefaultProtocolContent();
  }

  const map = new Map(data.map((r) => [r.key, r.value]));
  const defaults = getDefaultProtocolContent();

  return {
    processImageUrl: parseJsonValue(map.get("processImageUrl"), defaults.processImageUrl),
    tabs: parseJsonValue(map.get("tabs"), defaults.tabs),
  };
}
