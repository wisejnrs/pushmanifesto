import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { Bricolage_Grotesque } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import { ThemeProvider } from "@/components/theme-provider";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/site";
import "@/styles/globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const ogLocale: Record<string, string> = {
    en: "en_US",
    es: "es_ES",
    fr: "fr_FR",
    de: "de_DE",
    zh: "zh_CN",
    ja: "ja_JP",
  };
  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.url,
    ),
    title: { default: t("title"), template: `%s · ${siteConfig.name}` },
    description: t("description"),
    applicationName: siteConfig.name,
    keywords: siteConfig.keywords,
    authors: [{ name: siteConfig.author.name }],
    creator: siteConfig.creator.name,
    publisher: siteConfig.creator.name,
    alternates: { canonical: "/" },
    icons: {
      icon: "/assets/manifesto-ico.svg",
      shortcut: "/assets/manifesto-ico.svg",
      apple: "/assets/manifesto-ico.svg",
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: t("title"),
      description: t("description"),
      url: siteConfig.url,
      locale: ogLocale[locale] ?? "en_US",
      images: [{ url: siteConfig.ogImage, width: 1280, height: 641, alt: siteConfig.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      site: siteConfig.social.handles.x,
      creator: siteConfig.social.handles.x,
      images: [siteConfig.ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    // Set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION in Vercel to emit the Search
    // Console HTML-tag verification meta (omitted when unset).
    verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0f1a" },
  ],
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations("common");

  return (
    <html
      lang={locale}
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
          {t("skipToContent")}
        </a>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider attribute="class" forcedTheme="dark">
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
