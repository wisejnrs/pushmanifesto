import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.pushmanifesto.org",
  ),
  title: {
    default: "Push Manifesto — A way to do creativity",
    template: "%s · Push Manifesto",
  },
  description:
    "The Push Manifesto is a set of principles and values that guide organisations and individuals in the pursuit of innovation and progress.",
  openGraph: {
    title: "Push Manifesto — A way to do creativity",
    description:
      "A set of principles for innovation: vision, collaboration, inclusive behaviour, and a pragmatic, evidence-based mindset.",
    url: "https://www.pushmanifesto.org",
    siteName: "Push Manifesto",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
