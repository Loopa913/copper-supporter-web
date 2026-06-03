import { ShopGallery } from "@/components/shop/ShopGallery";
import { getShopContent } from "@/lib/cms/shop-content";

export const runtime = "edge";

export default async function ShopPage() {
  const content = await getShopContent();
  return <ShopGallery content={content} />;
}
