import { SHOP_INTRO, GOODS_ITEMS, SHOP_CTA, type GoodsItem } from "@/lib/data/shop";
import type { SiteContentRow } from "@/lib/cms/types";
import { createClientIfConfigured } from "@/lib/supabase/server";

export type ShopContent = {
  intro: typeof SHOP_INTRO;
  goods: GoodsItem[];
  cta: typeof SHOP_CTA;
};

export function getDefaultShopContent(): ShopContent {
  return {
    intro: SHOP_INTRO,
    goods: GOODS_ITEMS,
    cta: SHOP_CTA,
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

export async function getShopContent(): Promise<ShopContent> {
  const supabase = await createClientIfConfigured();
  if (!supabase) return getDefaultShopContent();

  const { data, error } = await supabase
    .from("site_content")
    .select("section, key, value")
    .eq("section", "shop");

  if (error || !data?.length) {
    return getDefaultShopContent();
  }

  const map = new Map(data.map((r) => [r.key, r.value]));
  const defaults = getDefaultShopContent();

  return {
    intro: parseJsonValue(map.get("intro"), defaults.intro),
    goods: parseJsonValue(map.get("goods"), defaults.goods),
    cta: parseJsonValue(map.get("cta"), defaults.cta),
  };
}
