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
};

export default nextConfig;
