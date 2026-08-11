import { getSettings } from "@/lib/content";

export default async function robots() {
  const site = await getSettings();
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
