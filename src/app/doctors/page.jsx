import PageHero from "@/components/PageHero";
import DoctorsSection from "@/components/DoctorsSection";
import Testimonials from "@/components/Testimonials";
import ClinicsSection from "@/components/ClinicsSection";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata = {
  title: "Our Dentists in Gurugram | MDS Specialists",
  description:
    "Meet the MDS specialists at White Lily Dental Gurugram — Dr. Deepak Tomar (Orthodontics & Implantology), Dr. Meenakshi Singh (Prosthodontics) and Dr. Lakshay Gupta (Oral & Maxillofacial Surgery).",
  alternates: { canonical: "/doctors" },
  openGraph: {
    title: "Meet Our Doctors | White Lily Dental Gurugram",
    description:
      "MDS-qualified orthodontist, prosthodontist and oral surgeon treating patients at our Sector 69 and 83 clinics.",
    url: "/doctors",
    type: "website",
    images: ["/images/og-image.png"],
  },
};

export default function DoctorsPage() {
  return (
    <>
      <PageHero
        title="Meet Our Dental Specialists"
        subtitle="Every treatment at White Lily Dental is planned and performed by an MDS-qualified specialist in that field — not handed to a generalist."
        breadcrumbs={[{ name: "Doctors", href: "/doctors" }]}
      />

      <DoctorsSection
        eyebrow="Our Team"
        title="The Specialists Who Will Treat You"
        subtitle="Three specialists covering orthodontics, implantology, prosthodontics and oral surgery, working on the same cases at both Gurugram clinics."
      />

      <Testimonials />
      <ClinicsSection />
      <CTASection />

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Doctors", href: "/doctors" },
        ])}
      />
    </>
  );
}
