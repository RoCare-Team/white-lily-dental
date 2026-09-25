/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: import.meta.dirname,
  // A dev server and a production build cannot share one output folder — the
  // build overwrites the chunks dev is serving. Set NEXT_DIST_DIR to build
  // into a scratch folder while `npm run dev` keeps running.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  // One host, one set of URLs. Every canonical, the sitemap and robots.txt all
  // point at www, so the bare domain must not serve a second copy of the site.
  // Localhost is untouched — the rule only fires for the apex domain.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "whitelilydental.in" }],
        destination: "https://www.whitelilydental.in/:path*",
        permanent: true,
      },
      // URLs from the old website that Google still has indexed. Without
      // these they land on the 404 page instead of passing their ranking on.
      {
        source: "/:page(dental-clinic-near-me.*|dentist-near-me.*)",
        destination: "/clinics",
        permanent: true,
      },
      { source: "/our-services", destination: "/services", permanent: true },
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },
      { source: "/gallery", destination: "/contact", permanent: true },
      { source: "/booknow", destination: "/dental-plans", permanent: true },
      // Old blog posts were /blog/<id>/<slug>; none carried over, so send
      // them to the blog index rather than a 404.
      { source: "/blog/:id/:slug", destination: "/blog", permanent: true },
      // Old sub-treatment pages, e.g. /services/cosmetic-dentistry/veneer.
      {
        source: "/services/:slug/:sub+",
        destination: "/services/:slug",
        permanent: true,
      },
      {
        source: "/service/braces",
        destination: "/services/braces-treatment",
        permanent: true,
      },
      {
        source: "/service/:slug",
        destination: "/services/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
