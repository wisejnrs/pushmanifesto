import { Metadata } from "next";
import { siteConfig } from "@/lib/site";

/**
 * Helper function to construct consistent metadata across the site
 * Uses site configuration for defaults and allows overrides
 */
export function constructMetadata({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  noIndex?: boolean;
} = {}): Metadata {
  const metaTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.title;
  const metaDescription = description || siteConfig.description;
  const metaKeywords = keywords || siteConfig.keywords;
  const metaImage = image || siteConfig.ogImage;
  const metaUrl = url || siteConfig.url;

  return {
    title: metaTitle,
    description: metaDescription,
    applicationName: siteConfig.name,
    keywords: metaKeywords,
    authors: [
      {
        name: siteConfig.creator.name,
        url: siteConfig.creator.linkedin,
      },
    ],
    creator: siteConfig.creator.name,
    publisher: siteConfig.name,
    openGraph: {
      type,
      locale: "en_AU",
      url: metaUrl,
      title: metaTitle,
      description: metaDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: metaImage,
          width: 500,
          height: 500,
          alt: metaTitle,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      site: siteConfig.social.handles.x,
      creator: siteConfig.social.handles.x,
      images: [metaImage],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    alternates: {
      canonical: metaUrl,
    },
  };
}