import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.pushmanifesto.org",
  ),
  title: {
    default: "Push Manifest - A way to do creativity",
    template: "%s · Push Manifesto",
  },
  description:
    "The Push Manifesto is a set of principles and values that guide organisations and individuals in the pursuit of innovation and progress.",
  icons: { shortcut: "/assets/manifesto-ico.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" translate="no">
      <body translate="no">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
