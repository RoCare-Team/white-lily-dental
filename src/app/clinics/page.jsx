import PageHero from "@/components/PageHero";
import ClinicsSection from "@/components/ClinicsSection";
import FAQ from "@/components/FAQ";
import CTASection from "@/components/CTASection";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import JsonLd from "@/components/JsonLd";

import { getClinics, getSettings } from "@/lib/content";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata = {
  title: "Our Clinics in Gurugram | Sector 69 & 83",
  description:
    "Visit White Lily Dental at Spaze Corporate Park, Sector 69 or Sapphire Mall, Sector 83 in Gurugram. Open Monday to Sunday, 11 AM to 7:30 PM. Call +91 97118 11272.",
  alternates: { canonical: "/clinics" },
  openGraph: {
    title: "Our Dental Clinics in Gurugram | White Lily Dental",
    description:
      "Two fully equipped dental clinics in Gurugram — Sector 69 and 83 — open all seven days.",
    url: "/clinics",
    type: "website",
    images: ["/images/og-image.png"],
  },
};

const clinicFaqs = [
  {
    q: "What are your clinic timings?",
    a: "Both clinics — Sector 69 and Sector 83 — are open Monday to Sunday from 11:00 AM to 7:30 PM. We recommend calling ahead on +91 97118 11272 to confirm a slot.",
  },
  {
    q: "Is parking available at the clinics?",
    a: "Yes. The Sector 69 clinic is inside Spaze Corporate Park, which has visitor parking, and the Sector 83 clinic at Sapphire Mall has mall parking directly outside.",
  },
  {
    q: "Do both clinics offer the same treatments?",
    a: "Yes. The same specialists, the same equipment standards and the same sterilisation protocols apply at both locations. Your records are shared between them, so you can be seen at either.",
  },
  {
    q: "Do I need an appointment or can I walk in?",
    a: "Walk-ins are accepted when a slot is free, but booking ahead is strongly recommended — especially for specialist procedures such as implants, orthodontics or surgical extractions.",
  },
  {
    q: "Do you handle dental emergencies?",
    a: "Yes. Call +91 97118 11272 and describe the problem. We prioritise acute pain, swelling and dental trauma and will fit you in at the earlier available clinic.",
  },
];

export default async function ClinicsPage() {
  const [clinics, site] = await Promise.all([getClinics(), getSettings()]);
  return (
    <>
      <PageHero
        title="Our Dental Clinics in Gurugram"
        subtitle={`Two fully equipped clinics — Sector 69 and 83 — open ${site.hours}. Same specialists, same standards, shared records.`}
        breadcrumbs={[{ name: "Clinics", href: "/clinics" }]}
      />

      <ClinicsSection />

      {/* Map area */}
      <section className="wl-section bg-brand-50/40" aria-labelledby="map-heading">
        <Container>
          <SectionHeading
            eyebrow="Find Us"
            title="Getting to White Lily Dental"
            subtitle="All two clinics are easy to reach from across Gurugram. Tap a location to open directions in Google Maps."
          />

          <ul className="mt-9 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {clinics.map((clinic) => (
              <li key={clinic.id}>
                <a
                  href={clinic.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block overflow-hidden rounded-[16px] border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_28px_50px_-32px_rgba(10,37,64,0.4)]"
                >
                  <div className="relative h-44 overflow-hidden bg-navy">
                    {/* Stylised map panel */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 opacity-30"
                      style={{
                        backgroundImage:
                          "linear-gradient(rgba(255,255,255,.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.25) 1px, transparent 1px)",
                        backgroundSize: "44px 44px",
                      }}
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-y-0 left-1/3 w-10 -rotate-12 bg-brand/40"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-0 top-2/3 h-8 bg-coral/25"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="relative flex h-4 w-4">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
                        <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-white bg-brand" />
                      </span>
                      <span className="mt-4 text-[15px] font-bold text-white">
                        {clinic.shortName}
                      </span>
                      <span className="mt-1 text-[14px] text-brand-100/80">
                        {clinic.landmark}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-[13.5px] leading-relaxed text-muted">
                      {clinic.address}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand">
                      Open in Google Maps →
                    </span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <FAQ
        headingId="clinic-faq-heading"
        eyebrow="Visiting Us"
        title="Clinic Questions, Answered"
        subtitle="Timings, parking, walk-ins and emergencies at our Gurugram clinics."
        items={clinicFaqs}
      />

      <CTASection />

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Clinics", href: "/clinics" },
        ])}
      />
    </>
  );
}
