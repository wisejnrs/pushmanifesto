import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.pushmanifesto.org",
  ),
  title: "Push Manifest - A way to do creativity",
  description:
    "The Push Manifesto is a set of principles and values that guide organisations and individuals in the pursuit of innovation and progress.",
  icons: { shortcut: "/assets/manifesto-ico.svg" },
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
    <html lang="en" translate="no">
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined|Material+Icons"
          rel="stylesheet"
        />
        {/* Original Push Manifesto stylesheet, served verbatim from /public */}
        <link rel="stylesheet" href="/css/style-2021-11-30-5.css" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=no"
        />
      </head>
      <body translate="no">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
