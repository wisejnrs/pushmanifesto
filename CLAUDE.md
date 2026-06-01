# Claude AI Integration Guide

Claude-specific notes for the Push Manifesto site.

## Project Context

- **Framework:** Next.js 15 (App Router)
- **Deployment:** Vercel (automatic deployments from `main`)
- **Main App Directory:** `Source/Client/`
- **Package Manager:** npm
- **Styling:** Tailwind CSS 3 + shadcn/ui (New York), CSS vars in `src/styles/globals.css`

> **History:** This site was previously a static HTML page (Tabler UI kit) hosted on
> an AWS S3 website bucket behind Cloudflare. The original static source is preserved
> under `Site/pushmanifesto.org/` for reference. The live site is now the Next.js app
> in `Source/Client/`, deployed on Vercel.

## Quick Commands

```bash
cd Source/Client && npm run dev        # development
cd Source/Client && npm run build      # production build (matches Vercel)
cd Source/Client && npm run lint && npm run check-types
```

## Project Structure

```
Source/Client/src/
├── app/
│   ├── (public)/page.tsx   # the manifesto home page
│   └── api/health/route.ts # health check
├── components/ui/          # shadcn/ui components
├── lib/
│   ├── manifesto.ts        # the manifesto principles (content lives here)
│   └── utils.ts
└── styles/globals.css
```

## Editing content

- The manifesto principles and external links live in `src/lib/manifesto.ts`.
- Edit copy there; the page renders the array.

## Environment Variables

- Local: `Source/Client/.env.local` (see `.env.example`).
- Production: Vercel dashboard. **Never commit real secrets** — only `.env.example` is tracked.
