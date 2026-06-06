import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Push Manifesto",
    short_name: "Push Manifesto",
    description: "A way to do creativity — principles for innovation and progress.",
    start_url: "/",
    display: "standalone",
    background_color: "#05070d",
    theme_color: "#0b1020",
    icons: [
      { src: "/assets/manifesto-ico.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
