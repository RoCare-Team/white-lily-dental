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
    ];
  },
};

export default nextConfig;
