import PageHero from "@/components/PageHero";
import ServicesGrid from "@/components/ServicesGrid";
import WhyChooseUs from "@/components/WhyChooseUs";
import ClinicsSection from "@/components/ClinicsSection";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata = {
  title: "Dental Services in Gurugram | All Treatments",
  description:
    "Braces, dental implants, cosmetic dentistry, root canal treatment, crowns and bridges, dentures, extractions, wisdom tooth removal, gum treatment and preventive dentistry in Gurugram.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Dental Services in Gurugram | White Lily Dental",
    description:
      "Explore all dental treatments offered at White Lily Dental's Sector 69 and 77 clinics in Gurugram.",
    url: "/services",
    type: "website",
    images: ["/images/og-image.png"],
  },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Complete Dental Care Under One Roof"
        subtitle="Ten specialist treatments, three MDS specialists and two Gurugram clinics — everything from a routine check-up to full-mouth rehabilitation in one place."
        breadcrumbs={[{ name: "Services", href: "/services" }]}
      />

      <ServicesGrid
        eyebrow="All Treatments"
        title="Explore Our Dental Treatments"
        subtitle="Explore our specialized dental treatments designed for healthy, confident smiles."
      />

      <WhyChooseUs />
      <ClinicsSection className="bg-brand-50/40" />
      <CTASection />

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
        ])}
      />
    </>
  );
}
