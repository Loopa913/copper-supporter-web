import { PROTOCOL_TABS, type ProtocolTabKey, RECRUITING_BOX_TEXT, RECRUITING_BOX_LINK, PROCESS_SECTION_DESCRIPTION, PROTOCOL_SECTION_DESCRIPTION, PROTOCOL_PROCESS_TRACKS, type ProcessTrack, type ProcessTrackStep } from "@/lib/data/protocol";
import { createClientIfConfigured } from "@/lib/supabase/server";

export type ProtocolContent = {
  processImageUrl: string | null;
  recruitingBoxText: string;
  recruitingBoxLink: string;
  processSectionDescription: string;
  protocolSectionDescription: string;
  processTracks: ProcessTrack[];
  tabs: typeof PROTOCOL_TABS;
};

export function getDefaultProtocolContent(): ProtocolContent {
  return {
    processImageUrl: null,
    recruitingBoxText: RECRUITING_BOX_TEXT,
    recruitingBoxLink: RECRUITING_BOX_LINK,
    processSectionDescription: PROCESS_SECTION_DESCRIPTION,
    protocolSectionDescription: PROTOCOL_SECTION_DESCRIPTION,
    processTracks: PROTOCOL_PROCESS_TRACKS,
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
    recruitingBoxText: parseJsonValue(map.get("recruitingBoxText"), defaults.recruitingBoxText),
    recruitingBoxLink: parseJsonValue(map.get("recruitingBoxLink"), defaults.recruitingBoxLink),
    processSectionDescription: parseJsonValue(map.get("processSectionDescription"), defaults.processSectionDescription),
    protocolSectionDescription: parseJsonValue(map.get("protocolSectionDescription"), defaults.protocolSectionDescription),
    processTracks: parseJsonValue(map.get("processTracks"), defaults.processTracks),
    tabs: parseJsonValue(map.get("tabs"), defaults.tabs),
  };
}
