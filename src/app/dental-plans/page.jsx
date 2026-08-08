import PageHero from "@/components/PageHero";
import PricingPlans from "@/components/PricingPlans";
import FAQ from "@/components/FAQ";
import ClinicsSection from "@/components/ClinicsSection";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata = {
  title: "Dental Plans in Gurugram | Annual Family Packages",
  description:
    "Affordable annual dental plans at White Lily Dental Gurugram — from ₹899 per year covering consultations and X-rays for four family members, up to ₹6,499 with scaling and polishing for all four.",
  alternates: { canonical: "/dental-plans" },
  openGraph: {
    title: "Annual Dental Plans | White Lily Dental Gurugram",
    description:
      "Prepaid family dental plans covering consultations, X-rays and professional cleaning at all three Gurugram clinics.",
    url: "/dental-plans",
    type: "website",
    images: ["/og-image.png"],
  },
};

const planFaqs = [
  {
    q: "How long is a dental plan valid?",
    a: "Each plan is valid for one year from the date of purchase and can be used at all three Gurugram clinics.",
  },
  {
    q: "Who can be included in a family plan?",
    a: "Up to four members of the same family. We record each member's name at the time of purchase so any of them can walk in and use the plan.",
  },
  {
    q: "Does the plan cover treatment costs?",
    a: "No. The plans cover consultations, X-rays and — in Packages 2 and 3 — scaling and polishing. Treatments such as fillings, root canals, crowns and implants are billed separately at standard rates.",
  },
  {
    q: "How do I buy a plan?",
    a: "Call us on +91 97118 11272 or send a request through the contact page and select 'Dental Plan enquiry'. You can also sign up at either clinic reception.",
  },
];

export default function DentalPlansPage() {
  return (
    <>
      <PageHero
        title="Annual Dental Plans for Gurugram Families"
        subtitle="Prepaid plans that cover the routine part of dental care — consultations, X-rays and professional cleaning — so nobody in the family postpones a check-up over cost."
        breadcrumbs={[{ name: "Dental Plans", href: "/dental-plans" }]}
      />

      <PricingPlans />

      <FAQ
        className="bg-brand-50/40"
        headingId="plans-faq-heading"
        eyebrow="Plan Details"
        title="Dental Plan Questions"
        subtitle="Validity, coverage and how to sign up."
        items={planFaqs}
      />

      <ClinicsSection />
      <CTASection />

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Dental Plans", href: "/dental-plans" },
        ])}
      />
    </>
  );
}
