"use client";

import { usePathname } from "next/navigation";

/**
 * Hides the public site header/footer on /admin, which has its own shell.
 * Children are rendered on the server and passed through as a slot, so wrapping
 * a server component (Footer) in this client component is fine.
 */
export default function SiteChrome({ children }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return children;
}
