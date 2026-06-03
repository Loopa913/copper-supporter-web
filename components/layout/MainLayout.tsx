import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import type { GlobalConfig } from "@/lib/cms/global-config";

type MainLayoutProps = {
  children: React.ReactNode;
  config: GlobalConfig;
};

export function MainLayout({ children, config }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar config={config} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
