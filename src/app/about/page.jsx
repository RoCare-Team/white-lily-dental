import Image from "next/image";
import { ArrowRight, CalendarCheck, Check } from "lucide-react";

import Button from "@/components/Button";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import WhyChooseUs from "@/components/WhyChooseUs";
import DoctorsSection from "@/components/DoctorsSection";
import Associations from "@/components/Associations";
import ClinicsSection from "@/components/ClinicsSection";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import FAQ from "@/components/FAQ";
import JsonLd from "@/components/JsonLd";

import { getSettings } from "@/lib/content";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata = {
  title: "About White Lily Dental | Trusted Dental Clinic in Gurugram",
  description:
    "White Lily Dental is an emerging dental clinic chain managed by qualified doctors — experts in orthodontics, prosthetic dentistry, implants, restorative, paediatric and cosmetic dentistry, endodontics and oral surgery.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About White Lily Dental | Gurugram",
    description:
      "A multi-specialist dental chain in Gurugram with MDS specialists across orthodontics, prosthodontics, implantology and oral surgery.",
    url: "/about",
    type: "website",
    images: ["/images/og-image.png"],
  },
};

/**
 * Copy on this page is the live whitelilydental.in /about-us page, kept word
 * for word — this site replaces that one, so the existing wording and its
 * search rankings carry over.
 */
const differentiators = [
  "Specialists from all fields of dentistry. Our detailed selection methods ensure that you get the best skills and expertise available.",
  "All dental procedures, right from basic cavities to advanced full mouth reconstructions, are done under one roof by a team of specialists.",
  "Best and latest equipment, absolute sterilization, and hygiene.",
  "Lowest radiation exposure possible.",
  "Specialized dental healthcare for children, pregnant women, patients with heart conditions, and disabilities.",
];

const aboutFaqs = [
  {
    q: "What makes White Lily Dental different from other dental clinics in Gurugram?",
    a: "White Lily Dental stands out for its patient-first approach, advanced dental technology, and ethical treatment practices. We emphasise accurate diagnosis, transparent consultations, and personalised treatment plans using modern cosmetic and aligner dentistry to deliver long-lasting results.",
  },
  {
    q: "What dental services are offered at White Lily Dental?",
    a: "White Lily Dental offers a complete range of dental services, including cosmetic dentistry, invisible aligners, braces, dental implants, root canal treatment, crowns and bridges, restorations, preventive care, and smile makeover solutions under one roof.",
  },
  {
    q: "Does White Lily Dental follow strict hygiene and safety protocols?",
    a: "Absolutely. White Lily Dental follows stringent sterilization, hygiene, and safety protocols in line with dental healthcare standards. Every procedure is carried out in a clean, safe, and well-sanitized clinical environment to ensure patient safety and comfort.",
  },
];

const specialities = [
  "Orthodontics and clear aligners",
  "Implantology and full-arch rehabilitation",
  "Prosthetic dentistry and smile design",
  "Endodontics and root canal treatment",
  "Oral and maxillofacial surgery",
  "Paediatric and preventive dentistry",
];

export default async function AboutPage() {
  const site = await getSettings();
  return (
    <>
      <PageHero
        title="About White Lily Dental | Trusted Dental Clinic in Gurugram"
        subtitle="An emerging dental clinic chain managed by qualified doctors, across two clinics in Gurugram — Sector 69 and 83."
        breadcrumbs={[{ name: "About Us", href: "/about" }]}
      />

      {/* Story */}
      <section className="wl-section" aria-label="Who we are">
        <Container className="grid grid-cols-1 items-center gap-9 lg:grid-cols-2 lg:gap-12">
          <div className="relative">
            <div className="relative aspect-4/3 overflow-hidden rounded-[18px] border border-line shadow-[0_36px_70px_-42px_rgba(10,37,64,0.5)]">
              <Image
                src="https://images.unsplash.com/photo-1643660527098-559f89e45a92?auto=format&fit=crop&w=1200&q=80"
                alt="Interior of the White Lily Dental clinic in Gurugram with modern dental equipment"
                fill
                priority
                sizes="(max-width: 1024px) 92vw, 46vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 left-4 rounded-2xl border border-line bg-white px-5 py-4 shadow-[0_20px_44px_-24px_rgba(10,37,64,0.55)] lg:-left-8">
              <p className="text-[24px] font-bold leading-none text-navy">21+</p>
              <p className="mt-1.5 text-[12px] text-muted">Years of clinical practice</p>
            </div>
          </div>

          <div>
            <SectionHeading
              align="left"
              as="h2"
              eyebrow="Who We Are"
              title="We Believe Dentistry Goes Beyond Teeth"
            />

            <div className="wl-prose mt-6 text-[15px]">
              <p>
                White Lily Dental is an emerging dental clinic chain managed by
                qualified Doctors. These Dental clinic doctors are experts in
                Orthodontics (braces), Prosthetic Dentistry, and Dental
                Implants, Restorative Dentistry, Pediatric Dentistry, Cosmetic
                Dentistry, Endodontics, and Oral and Maxillofacial Surgery. All
                these areas are interrelated and require a comprehensive
                approach to deal with the problem.
              </p>
              <p>
                The organization assures you of an unparalleled experience in
                dental care. We believe dentistry goes beyond teeth. So whether
                it is our highly skilled and experienced esteemed panel of
                dentists, the painless dental treatment, the perfect hygiene,
                and cutting-edge equipment and instruments, soothing ambiance,
                or a friendly voice over the phone, one thing is sure – What you
                are about to experience is the best in dental care.
              </p>
            </div>

          </div>
        </Container>
      </section>

      {/* Why patients choose us — the five points from the live site */}
      <section className="wl-section bg-brand-50/40" aria-label="How we work">
        <Container>
          <SectionHeading
            eyebrow="How We Work"
            title="What You Are About to Experience Is the Best in Dental Care"
            subtitle="Five things that shape every treatment we plan at both Gurugram clinics."
          />

          <ol className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {differentiators.map((point, index) => (
              <li
                key={point}
                className="rounded-[16px] border border-line bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_28px_50px_-32px_rgba(10,37,64,0.4)]"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-[16px] font-bold text-brand">
                  {index + 1}
                </span>
                <p className="mt-4 text-[14.5px] leading-[1.7] text-navy/85">{point}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Founder */}
      <section className="wl-section" aria-label="Our founder">
        <Container className="max-w-3xl">
          <SectionHeading
            as="h2"
            align="left"
            eyebrow="Our Founder"
            title={
              <>
                From Preventive Care to Smile Makeovers —{" "}
                <span className="text-brand">Explore Our Dental Services</span>
              </>
            }
          />

          <div className="wl-prose mt-6 text-[15px]">
            <p>
              Dr. Deepak Tomar, founder of White Lily Dental Clinic, has over{" "}
              {site.yearsExperience} years of experience in orthodontics and
              implant dentistry. He mainly works on invisible braces, dental
              implants, and complex smile correction cases where precision is
              important.
            </p>
            <p>
              He leads two branches in Gurugram — White Lily Dental Clinic,
              Sector 69, and White Lily Dental Clinic, Sector 83. Both clinics
              focus on modern dental treatments such as clear aligners, smile
              design, and full-mouth rehabilitation.
            </p>
            <p>
              His approach is simple and practical. Clear advice, proper
              planning, and treatments that are meant to last.
            </p>
          </div>

          <ul className="mt-8 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
            {specialities.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-coral-50 text-coral">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
                </span>
                <span className="text-[14px] leading-snug text-navy/85">{item}</span>
              </li>
            ))}
          </ul>

          {/* Booking callout, as on the live page */}
          <div className="mt-9 rounded-r-[14px] border-l-4 border-brand bg-brand-50/60 p-6">
            <h3 className="text-[18px] font-bold text-brand">
              Book Your Appointment
            </h3>
            <p className="mt-2.5 text-[15px] leading-[1.75] text-navy/85">
              Get expert consultation for invisible braces, dental implants, and
              smile correction at our Gurugram clinics. Simple process. Clear
              guidance.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button href="/contact" size="md" data-book-appointment>
                <CalendarCheck className="h-[18px] w-[18px]" aria-hidden="true" />
                Book Appointment
              </Button>
              <Button href="/services" variant="outline" size="md">
                Explore Our Dental Services
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <WhyChooseUs />
      <DoctorsSection />
      <Associations />
      <Testimonials />
      <ClinicsSection />

      <FAQ
        headingId="about-faq-heading"
        eyebrow="Good to Know"
        title="About White Lily Dental"
        subtitle="The questions patients ask us most before their first visit."
        items={aboutFaqs}
      />

      <CTASection />

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "About Us", href: "/about" },
        ])}
      />
    </>
  );
}
