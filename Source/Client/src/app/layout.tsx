import type { ReactNode } from "react";

// The real document shell lives in app/[locale]/layout.tsx (it needs the active
// locale for <html lang>). This root layout is an intentional pass-through.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
