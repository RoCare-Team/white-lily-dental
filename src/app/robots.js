import { getSettings } from "@/lib/content";

export default async function robots() {
  const site = await getSettings();

  // While the site is hidden, keep crawlers off it entirely and publish no
  // sitemap — the per-page noindex tag is the belt to this pair of braces.
  if (site.noindex) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
      host: site.url,
    };
  }

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
