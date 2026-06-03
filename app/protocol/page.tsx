import { ProtocolTabs } from "@/components/protocol/ProtocolTabs";
import { getProtocolContent } from "@/lib/cms/protocol-content";

export const runtime = "edge";

export default async function ProtocolPage() {
  const content = await getProtocolContent();
  return <ProtocolTabs content={content} />;
}
