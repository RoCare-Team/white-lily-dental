import Hero from "@/components/Hero";
import ServicesGrid from "@/components/ServicesGrid";
import FeaturedTreatment from "@/components/FeaturedTreatment";
import InvisibleAligners from "@/components/InvisibleAligners";
import WhyChooseUs from "@/components/WhyChooseUs";
import DoctorsSection from "@/components/DoctorsSection";
import Testimonials from "@/components/Testimonials";
import PricingPlans from "@/components/PricingPlans";
import NewPatients from "@/components/NewPatients";
import Associations from "@/components/Associations";
import ClinicsSection from "@/components/ClinicsSection";
import FAQ from "@/components/FAQ";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";

import { homeFaqs } from "@/data/faqs";
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
      "Braces, dental implants, root canals, cosmetic dentistry and preventive care by MDS specialists at our Sector 69 and Sector 77 clinics in Gurugram.",
    url: "/",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesGrid />
      <FeaturedTreatment />
      <InvisibleAligners />
      <WhyChooseUs />
      <DoctorsSection />
      <Testimonials />
      <PricingPlans />
      <NewPatients />
      <Associations />
      <ClinicsSection className="bg-brand-50/40" />
      <FAQ items={homeFaqs} />
      <CTASection />
      <JsonLd data={faqSchema(homeFaqs)} />
    </>
  );
}
