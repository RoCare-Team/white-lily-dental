import { Inter, Manrope } from "next/font/google";

import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import SiteChrome from "@/components/SiteChrome";
import {
  getClinics,
  getContactLinks,
  getNavigation,
  getServices,
  getSettings,
} from "@/lib/content";
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

export async function generateMetadata() {
  const site = await getSettings();
  return {
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
          url: "/images/og-image.png",
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
      images: ["/images/og-image.png"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export const viewport = {
  themeColor: "#07536b",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }) {
  const [services, navigation, clinics, { settings, telHref }] = await Promise.all([
    getServices(),
    getNavigation(),
    getClinics(),
    getContactLinks(),
  ]);

  return (
    <html lang="en-IN" className={`${inter.variable} ${manrope.variable}`}>
      <head>
        {/* Without JS the observer never runs, so nothing should stay hidden */}
        <noscript>
          <style>{`.wl-reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <SiteChrome>
          <Header
            services={services}
            navLinks={navigation.navLinks ?? []}
            site={settings}
            telHref={telHref}
          />
        </SiteChrome>
        <main id="main">{children}</main>
        <SiteChrome>
          <Footer />
          <JsonLd data={dentistSchema(settings, clinics)} />
        </SiteChrome>
      </body>
    </html>
  );
}
