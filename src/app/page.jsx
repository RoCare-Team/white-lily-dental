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

// Title, description and keywords are carried over verbatim from the old live
// site so the pages Google already ranks keep the same snippet after launch.
const HOME_TITLE =
  "Best Dental Clinic | Book A Dentist @09711811272 - White Lily Dental";

const HOME_DESCRIPTION =
  "White Lily Dental : Looking for a dentist for teeth related issues? Visit your nearest dental clinic for all oral health concerns. Searching for near by dental clinic in Gurgaon, Call us @9289288848 to book an appointment with our professional Dentists.";

export const metadata = {
  // `absolute` keeps the root layout's "%s | White Lily Dental Gurugram"
  // template from appending the brand name a second time.
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
  keywords: [
    "whitelily dental",
    "dental clinic gurgaon",
    "dental clinic",
    "dentist clinic",
    "book a dentist",
    "dental for kids",
    "dental hospitals",
    "teeth dentist",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: "/",
    type: "website",
    images: ["/images/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
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
