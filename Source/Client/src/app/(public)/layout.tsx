import type { Metadata } from "next";

// The landing page keeps the original pushmanifesto.org look. The original
// stylesheet + Material Icons are scoped to this route group only, so they
// never leak into the (Tailwind-based) /blog routes.
export const metadata: Metadata = {
  title: "Push Manifest - A way to do creativity",
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
    <>
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined|Material+Icons"
        rel="stylesheet"
      />
      <link rel="stylesheet" href="/css/style-2021-11-30-5.css" />
      {children}
    </>
  );
}
