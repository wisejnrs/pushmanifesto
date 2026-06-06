import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

// Open to all crawlers, including AI search/answer engines — public writing we
// want discoverable and citable. Only /api is excluded.
export default function robots(): MetadataRoute.Robots {
  const url = siteConfig.url;
  return {
    rules: [
      {
        userAgent: [
          "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "anthropic-ai",
          "Claude-Web", "PerplexityBot", "Google-Extended", "CCBot",
          "Applebot-Extended", "Amazonbot", "cohere-ai", "Meta-ExternalAgent", "YouBot",
        ],
        allow: "/",
        disallow: "/api/",
      },
      { userAgent: "*", allow: "/", disallow: "/api/" },
    ],
    sitemap: `${url}/sitemap.xml`,
    host: url,
  };
}
