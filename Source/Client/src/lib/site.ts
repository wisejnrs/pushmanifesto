export const siteConfig = {
  name: "Push Manifesto",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.pushmanifesto.org",
  description: "A way to do creativity — principles for innovation and progress.",
  author: {
    name: "Michael Wise",
    avatar: "/assets/manifesto-ico.svg",
    bio: "Technology leader writing about creativity, delivery, and the Push philosophy.",
  },
  social: {
    x: "@michael_wise",
  },
};

export type SiteConfig = typeof siteConfig;
