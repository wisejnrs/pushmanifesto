export const siteConfig = {
  name: "Push Manifesto",
  title: "Push Manifesto — A way to do creativity",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.pushmanifesto.org",
  description: "A way to do creativity — principles for innovation and progress.",
  tagline: "A way to do creativity",
  ogImage: "/img/manifesto-social.png",
  keywords: [
    "Push Manifesto",
    "innovation",
    "creativity",
    "product delivery",
    "ways of working",
    "evidence-based thinking",
    "Michael Wise",
  ],
  author: {
    name: "Michael Wise",
    avatar: "/assets/manifesto-ico.svg",
    bio: "Technology leader writing about creativity, delivery, and the Push philosophy.",
  },
  creator: {
    name: "Michael Wise",
    email: "mikew@trilogycare.com.au",
    linkedin: "https://www.linkedin.com/in/michaelleahywise/",
  },
  links: {
    github: "https://github.com/wisejnrs/pushmanifesto",
    linkedin: "https://www.linkedin.com/in/michaelleahywise/",
    x: "https://twitter.com/michael_wise",
    soundcloud: "",
    spotify: "",
    youtube: "",
  },
  social: {
    x: "@michael_wise",
    handles: {
      x: "@michael_wise",
    },
  },
};

export type SiteConfig = typeof siteConfig;
