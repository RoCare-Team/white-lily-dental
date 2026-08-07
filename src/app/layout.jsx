import { Inter, Manrope } from "next/font/google";

import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyContactBar from "@/components/StickyContactBar";
import JsonLd from "@/components/JsonLd";
import { site } from "@/data/site";
import { dentistSchema } from "@/lib/schema";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default:
      "White Lily Dental | Best Dental Clinic in Gurugram — Sector 69 & 77",
    template: "%s | White Lily Dental Gurugram",
  },
  description: site.intro,
  applicationName: site.name,
  authors: [{ name: site.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: site.url,
    siteName: site.name,
    title: "White Lily Dental | Best Dental Clinic in Gurugram",
    description: site.intro,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "White Lily Dental — advanced dental care in Gurugram",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "White Lily Dental | Best Dental Clinic in Gurugram",
    description: site.intro,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: "#07536b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${manrope.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        {/* Bottom padding clears the fixed contact bar: 64px mobile, 96px desktop */}
        <div className="pb-22 md:pb-26">
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </div>
        <StickyContactBar />
        <JsonLd data={dentistSchema()} />
      </body>
    </html>
  );
}
