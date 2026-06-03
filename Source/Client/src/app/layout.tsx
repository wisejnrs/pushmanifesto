import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { ThemeProvider } from "@/components/theme-provider";
import "@/styles/globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
});

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
  icons: {
    icon: "/assets/manifesto-ico.svg",
    shortcut: "/assets/manifesto-ico.svg",
    apple: "/assets/manifesto-ico.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0f1a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      translate="no"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable} ${display.variable}`}
    >
      <body translate="no" className="font-sans">
        {/* Apply the saved palette class before paint to avoid a flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('pm-theme');if(t&&t!=='default'){document.documentElement.classList.add(t);}}catch(e){}})();",
          }}
        />
        <a
          href="#main-content"
          className="skip-link glass rounded-full px-4 py-2 text-sm font-medium text-foreground shadow-lg"
        >
          Skip to content
        </a>
        <ThemeProvider attribute="class" forcedTheme="dark">
          {children}
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
