import Link from "next/link";
import { Twitter, Linkedin, Github, Rss } from "lucide-react";

const socials = [
  { label: "X / Twitter", href: "https://www.twitter.com/michael_wise", icon: Twitter },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/michaelleahywise/", icon: Linkedin },
  { label: "GitHub", href: "https://github.com/wisejnrs/pushmanifesto", icon: Github },
  { label: "RSS", href: "/feed.xml", icon: Rss },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="container flex flex-col items-center gap-6 py-12 md:flex-row md:justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid h-6 w-6 place-items-center rounded-md bg-gradient-to-br from-[#D247BF] to-[#FF6B35] text-[11px] font-bold text-white">
            P
          </span>
          <p className="text-sm text-muted-foreground">
            Push Manifesto — a way to do creativity.
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
