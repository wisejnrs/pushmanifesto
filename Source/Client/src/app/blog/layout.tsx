import Link from "next/link";

// Tailwind + theme tokens are imported here so they apply ONLY to /blog,
// keeping the landing page's original stylesheet untouched.
import "@/styles/globals.css";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link href="/" className="font-semibold tracking-tight text-slate-900">
            Push Manifesto
          </Link>
          <nav className="flex items-center gap-5 text-sm text-slate-500">
            <Link href="/blog" className="hover:text-teal-700">
              Blog
            </Link>
            <a href="/feed.xml" className="hover:text-teal-700">
              RSS
            </a>
            <Link href="/" className="hover:text-teal-700">
              Home
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-12">{children}</main>
      <footer className="border-t border-slate-200 py-8 text-center text-xs text-slate-400">
        Push Manifesto — a WiseJNRS project.
      </footer>
    </div>
  );
}
