import type { Metadata } from "next";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: { absolute: "Push Manifesto — A way to do creativity" },
  openGraph: {
    title: "Push Manifesto — A way to do creativity",
    description:
      "A set of principles for innovation: vision, collaboration, inclusive behaviour, and a pragmatic, evidence-based mindset.",
    url: "https://www.pushmanifesto.org",
    siteName: "Push Manifesto",
    type: "website",
  },
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
