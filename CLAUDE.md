# Claude AI Integration Guide

Working notes for the **pushmanifesto.org** site. See `README.md` for the
public overview; this file is the developer/agent-facing reference.

## Project context

- **Framework:** Next.js 15 (App Router, React 19, TypeScript)
- **App directory:** `Source/Client/` · **Package manager:** npm
- **Styling:** Tailwind CSS 3 + shadcn/ui (New York); CSS-variable theming in `src/styles/globals.css`
- **i18n:** next-intl — `[locale]` route segment, `localePrefix: "as-needed"` (English keeps bare URLs)
- **Fonts:** Bricolage Grotesque (display, `--font-display`) + Geist Sans/Mono
- **Deployment:** Vercel, **auto-deploys from `main`**. Public repo — keep secrets out.

> **History:** Originally a static Tabler/HTML page on an S3 bucket behind
> Cloudflare; preserved under `Site/pushmanifesto.org/`. Now a Next.js app in
> `Source/Client/`.

## Quick commands

```bash
cd Source/Client
npm run dev                       # http://localhost:3000
npm run build                     # production build (matches Vercel)
npm run lint && npm run check-types
```

## Structure

```
Source/Client/src/
├── app/
│   ├── layout.tsx               # root: pass-through (locale needs the [locale] layout)
│   ├── [locale]/
│   │   ├── layout.tsx           # <html lang>, fonts, ThemeProvider (forced dark),
│   │   │                        #   NextIntlClientProvider, palette FOUC script, skip link
│   │   ├── (public)/page.tsx    # landing (hero, manifesto, principles, voices, CTA)
│   │   └── blog/{page,[slug]}    # blog list + post
│   ├── feed.xml/route.ts        # RSS · api/health · music/playback-context (audio hook)
├── components/                  # site-header/footer, theme-switcher, language-switcher,
│                                #   mobile-menu, hero-astronaut, reveal, blog/*, ui/* (shadcn)
├── content/blog/<locale>/*.md   # posts per language; en is canonical, others fall back to en
├── i18n/{routing,navigation,request}.ts
├── lib/{blog,blog-server,site,utils,...}.ts
├── messages/<locale>.json       # UI catalogs (deep-merged over en)
└── styles/globals.css           # tokens, 9 palette themes, brand gradient, grain, focus, etc.
```

## Conventions

- **Dark only.** `ThemeProvider forcedTheme="dark"`. There is no light/dark toggle — a **palette switcher** (`theme-switcher.tsx`) sets a class on `<html>` (`.aqua`, `.webber`, …) saved to `localStorage` (`pm-theme`); a pre-paint script in the locale layout applies it without flash.
- **Brand:** gradient `#eeaa52 → #e73c6f → #2394d5 → #2af3b7` via `.text-gradient-brand` / `.bg-gradient-brand`; astronaut `public/img/manifesto.png`; favicon/logo `public/assets/manifesto-ico.svg`.
- **i18n:** locales/`as-needed` in `i18n/routing.ts`; UI strings in `messages/<locale>.json` (missing keys fall back to English via the deep-merge in `i18n/request.ts`). Use the locale-aware `Link`/`useRouter` from `@/i18n/navigation`. Server pages call `setRequestLocale(locale)`.
- **Blog:** `blog-server.ts` is locale-aware (per-locale dirs, en fallback). Add a post in `content/blog/en/`; translations go in `content/blog/<locale>/` with `aiTranslated: true` (shows the "machine-translated" banner).
- **Motion:** Framer Motion; everything respects `prefers-reduced-motion` (see `reveal.tsx`).
- **Vendored from wisejnrs-website:** the blog engine + many `components/blog`, `hooks`, `ui` files. `.eslintrc.json` relaxes a few rules for those paths only; app code stays strict. The editor/auth/MCP/save endpoints were intentionally **excluded** (public repo, no write surface).

## Workflow

Branch → PR → Vercel preview → review → squash-merge → tag `vX.Y.Z`. Pushing to
`main` deploys to production. Version is bumped in `Source/Client/package.json`
and shown in the site footer.

## Known follow-ups

- Non-English translations (UI + blog) are **AI-drafted — pending native review** (banner flags this to visitors).
- Blog in-post **audio** uses a real `<audio>` player (`app/music/playback-context.tsx`); worth a real-device check.

## Environment variables

- Local: `Source/Client/.env.local` (gitignored). Production: Vercel dashboard.
- `NEXT_PUBLIC_SITE_URL` overrides the canonical URL. **Never commit secrets.**
