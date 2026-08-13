import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import ServicesSlider from "@/components/ServicesSlider";
import FeaturedTreatment from "@/components/FeaturedTreatment";
import InvisibleAligners from "@/components/InvisibleAligners";
import WhyChooseUs from "@/components/WhyChooseUs";
import DoctorsSection from "@/components/DoctorsSection";
import Testimonials from "@/components/Testimonials";
import PricingPlans from "@/components/PricingPlans";
import Associations from "@/components/Associations";
import ClinicsSection from "@/components/ClinicsSection";
import FAQ from "@/components/FAQ";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";

import { getHomeFaqs, getServices } from "@/lib/content";
import { faqSchema } from "@/lib/schema";

export const metadata = {
  title:
    "White Lily Dental | Best Dental Clinic in Gurugram — Sector 69 & 77",
  description:
    "White Lily Dental is a multi-specialist dental clinic in Gurugram offering braces, dental implants, root canal treatment, cosmetic dentistry and preventive care. 21+ years of experience, MDS specialists, open all 7 days.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "White Lily Dental | Best Dental Clinic in Gurugram",
    description:
      "Braces, dental implants, root canals, cosmetic dentistry and preventive care by MDS specialists at our Sector 69 and 77 clinics in Gurugram.",
    url: "/",
    type: "website",
    images: ["/images/og-image.png"],
  },
};

export default async function HomePage() {
  const [homeFaqs, services] = await Promise.all([getHomeFaqs(), getServices()]);
  return (
    <>
      <Hero />
      <TrustStrip />
      <ServicesSlider items={services} />
      <FeaturedTreatment />
      <InvisibleAligners />
      <WhyChooseUs />
      <DoctorsSection />
      <Testimonials />
      <PricingPlans />
      <Associations />
      <ClinicsSection className="bg-brand-50/40" />
      <FAQ items={homeFaqs} />
      <CTASection />
      <JsonLd data={faqSchema(homeFaqs)} />
    </>
  );
}
