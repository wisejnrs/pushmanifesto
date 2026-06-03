import { siteConfig } from "@/lib/site";

interface StructuredDataProps {
  type?: "website" | "person" | "musicGroup" | "article" | "breadcrumb";
  data?: Record<string, any>;
}

export function StructuredData({ type = "website", data = {} }: StructuredDataProps) {
  const getStructuredData = () => {
    const baseData = {
      "@context": "https://schema.org",
    };

    switch (type) {
      case "website":
        return {
          ...baseData,
          "@type": "WebSite",
          name: siteConfig.name,
          alternateName: siteConfig.title,
          description: siteConfig.description,
          url: siteConfig.url,
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
          author: {
            "@type": "Person",
            name: siteConfig.creator.name,
            url: siteConfig.creator.linkedin,
          },
          publisher: {
            "@type": "Organization",
            name: siteConfig.name,
            url: siteConfig.url,
            logo: {
              "@type": "ImageObject",
              url: `${siteConfig.url}/android-chrome-512x512.png`,
            },
          },
          ...data,
        };

      case "person":
        return {
          ...baseData,
          "@type": "Person",
          name: siteConfig.creator.name,
          alternateName: ["Mike", "Michael Leahy", "Michael Wise", "WiseJNRS"],
          description: "CIO at Trilogy Care, technology leader with 30+ years experience in AI healthcare and enterprise architecture. Electronic music producer (WiseJNRS) from Brisbane, Australia. Patent holder (US 11884374) and founder of omniEffect (acquired by TechConnect).",
          url: siteConfig.url,
          image: siteConfig.ogImage,
          email: siteConfig.creator.email,
          sameAs: [
            siteConfig.creator.linkedin,
            siteConfig.links.github,
            siteConfig.links.soundcloud,
            siteConfig.links.spotify,
            siteConfig.links.youtube,
            siteConfig.links.x,
          ],
          jobTitle: "Chief Information Officer",
          worksFor: {
            "@type": "Organization",
            name: "Trilogy Care",
            url: "https://www.trilogycare.com.au",
          },
          address: {
            "@type": "PostalAddress",
            addressLocality: "Brisbane",
            addressRegion: "Queensland",
            addressCountry: "AU",
          },
          knowsAbout: [
            "AI Healthcare",
            "Intelligent Systems",
            "Enterprise Architecture",
            "Product Strategy",
            "Digital Transformation",
            "Cloud Computing",
            "Data Integration",
            "Music Production",
            "Electronic Music",
            "Strategic Advisory",
            "Innovation",
            "Technology Leadership",
          ],
          hasOccupation: [
            {
              "@type": "Occupation",
              name: "Chief Information Officer",
              occupationLocation: {
                "@type": "City",
                name: "Brisbane, Australia",
              },
              skills: "AI Healthcare, Enterprise Architecture, Digital Transformation",
            },
            {
              "@type": "Occupation",
              name: "Electronic Music Producer",
              occupationLocation: {
                "@type": "City",
                name: "Brisbane, Australia",
              },
              skills: "Music Production, Sound Design, Electronic Music",
            },
          ],
          award: [
            "Patent US 11884374 - Systems and methods for universal platform integration",
            "Gartner Cool Vendor recognition (via omniEffect)",
          ],
          alumniOf: [
            {
              "@type": "Organization",
              name: "Queensland Government",
            },
          ],
          ...data,
        };

      case "musicGroup":
        return {
          ...baseData,
          "@type": "MusicGroup",
          name: siteConfig.name,
          alternateName: ["WiseJNRS", "Wise Jnrs", "Michael Wise"],
          description: "Electronic music producer from Brisbane, Australia. Creating ambient techno, lo-fi hip hop, and experimental electronic music. Known for soundtracker compositions and Amiga music heritage.",
          url: siteConfig.url,
          image: siteConfig.ogImage,
          genre: [
            "Electronic",
            "Electronic Music",
            "Ambient",
            "Ambient Techno",
            "Lo-fi Hip Hop",
            "Experimental",
            "Soundtracker",
            "Chiptune",
          ],
          foundingDate: "1990",
          foundingLocation: {
            "@type": "City",
            name: "Brisbane, Australia",
          },
          member: {
            "@type": "Person",
            name: siteConfig.creator.name,
            roleName: "Producer, Composer, Performer",
            url: siteConfig.creator.linkedin,
          },
          sameAs: [
            siteConfig.links.soundcloud,
            siteConfig.links.spotify,
            siteConfig.links.youtube,
            siteConfig.links.x,
          ],
          subjectOf: {
            "@type": "WebSite",
            name: `${siteConfig.name} Official Website`,
            url: siteConfig.url,
          },
          ...data,
        };

      case "breadcrumb":
        return {
          ...baseData,
          "@type": "BreadcrumbList",
          itemListElement: data.items || [],
        };

      case "article":
        return {
          ...baseData,
          "@type": "BlogPosting",
          headline: data.title || siteConfig.title,
          description: data.description || siteConfig.description,
          author: {
            "@type": "Person",
            name: siteConfig.creator.name,
            url: siteConfig.creator.linkedin,
            jobTitle: "Chief Information Officer",
            alumniOf: {
              "@type": "Organization",
              name: "Queensland Government",
            },
          },
          publisher: {
            "@type": "Organization",
            name: siteConfig.name,
            url: siteConfig.url,
            logo: {
              "@type": "ImageObject",
              url: `${siteConfig.url}/android-chrome-512x512.png`,
              width: 512,
              height: 512,
            },
          },
          datePublished: data.datePublished,
          dateModified: data.dateModified || data.datePublished,
          image: {
            "@type": "ImageObject",
            url: data.image || siteConfig.ogImage,
            width: data.imageWidth || 1200,
            height: data.imageHeight || 630,
          },
          url: data.url || siteConfig.url,
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": data.url || siteConfig.url,
          },
          keywords: data.keywords,
          articleSection: data.articleSection,
          wordCount: data.wordCount,
          inLanguage: "en-AU",
          ...data,
        };

      default:
        return baseData;
    }
  };

  const structuredData = getStructuredData();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}

// Individual structured data components for specific use cases
export function WebsiteStructuredData() {
  return <StructuredData type="website" />;
}

export function PersonStructuredData() {
  return <StructuredData type="person" />;
}

export function MusicGroupStructuredData() {
  return <StructuredData type="musicGroup" />;
}

export function BreadcrumbStructuredData({ items }: { items: Array<{ name: string; url: string }> }) {
  const breadcrumbItems = items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  }));

  return <StructuredData type="breadcrumb" data={{ items: breadcrumbItems }} />;
}