import Link from "next/link";
import { useTranslations } from "next-intl";
import { Twitter, Linkedin, Github, Rss, ArrowUpRight, Globe } from "lucide-react";
import pkg from "../../package.json";

const socials = [
  { label: "X / Twitter", href: "https://www.twitter.com/michael_wise", icon: Twitter },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/michaelleahywise/", icon: Linkedin },
  { label: "GitHub", href: "https://github.com/wisejnrs/pushmanifesto", icon: Github },
  { label: "RSS", href: "/feed.xml", icon: Rss },
  { label: "wisejnrs.net", href: "https://www.wisejnrs.net", icon: Globe },
];

export function SiteFooter() {
  const t = useTranslations("footer");
  return (
    <footer className="border-t border-border/60">
      <div className="container flex flex-col items-center gap-6 py-12 md:flex-row md:justify-between">
        <div className="flex items-center gap-2.5">
          <img src="/assets/manifesto-ico.svg" alt="" aria-hidden className="h-6 w-6" />
          <p className="text-sm text-muted-foreground">
            {t("tagline")}{" "}
            <span className="px-1 text-muted-foreground/40">·</span>{" "}
            <a
              href="https://www.wisejnrs.net"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 font-medium text-foreground/80 underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              {t("project")}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <span className="px-1 text-muted-foreground/40">·</span>
            <a
              href="https://github.com/wisejnrs/pushmanifesto/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-muted-foreground/60 transition-colors hover:text-foreground"
            >
              v{pkg.version}
            </a>
          </p>
        </div>

        <nav className="flex items-center gap-1">
          {socials.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
              aria-label={s.label}
              className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
            >
              <s.icon className="h-[18px] w-[18px]" />
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
