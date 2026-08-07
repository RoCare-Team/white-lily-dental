import Image from "next/image";
import { Award, Check, HeartHandshake, Microscope, Users } from "lucide-react";

import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import WhyChooseUs from "@/components/WhyChooseUs";
import DoctorsSection from "@/components/DoctorsSection";
import Associations from "@/components/Associations";
import ClinicsSection from "@/components/ClinicsSection";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";

import { site } from "@/data/site";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata = {
  title: "About Us | Multi-Specialist Dental Clinic in Gurugram",
  description:
    "Learn about White Lily Dental — a multi-specialist dental chain in Gurugram with 21+ years of experience, MDS specialists and advanced technology across Sector 69 and Sector 77.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About White Lily Dental | Gurugram",
    description:
      "A multi-specialist dental chain in Gurugram with MDS specialists across orthodontics, prosthodontics, implantology and oral surgery.",
    url: "/about",
    type: "website",
    images: ["/og-image.png"],
  },
};

const values = [
  {
    icon: Users,
    title: "Multi-specialist by design",
    desc: "Orthodontics, prosthodontics and oral surgery under one roof, so complex cases never get passed around between clinics.",
  },
  {
    icon: Microscope,
    title: "Diagnosis before treatment",
    desc: "Digital X-rays, photographs and a written plan come first. You approve the plan before anything begins.",
  },
  {
    icon: HeartHandshake,
    title: "Support after the chair",
    desc: "A dedicated patient counsellor follows up on healing, aftercare and review appointments.",
  },
  {
    icon: Award,
    title: "Consistent standards",
    desc: "Both Gurugram clinics run the same protocols, the same sterilisation standard and the same specialist team.",
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

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="A Multi-Specialist Dental Chain Built Around Gurugram Families"
        subtitle="White Lily Dental brings specialist dentistry, modern technology and honest treatment planning to two clinics in Gurugram — Sector 69 and Sector 77."
        breadcrumbs={[{ name: "About Us", href: "/about" }]}
      />

      {/* Story */}
      <section className="wl-section" aria-labelledby="story-heading">
        <Container className="grid grid-cols-1 items-center gap-9 lg:grid-cols-2 lg:gap-12">
          <div className="relative">
            <div className="relative aspect-4/3 overflow-hidden rounded-[18px] border border-line shadow-[0_36px_70px_-42px_rgba(10,37,64,0.5)]">
              <Image
                src="https://images.unsplash.com/photo-1600170311833-c2cf5280ce49?auto=format&fit=crop&w=1200&q=80"
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
              title="Specialist Dentistry, Without the Runaround"
            />

            <div className="wl-prose mt-6 text-[15px]">
              <p>{site.intro}</p>
              <p>
                Most dental problems get referred from clinic to clinic — braces
                at one place, implants at another, surgery somewhere else. We
                built White Lily Dental so that a patient could be diagnosed,
                planned and treated by the right specialist in one place, with
                one set of records and one point of contact.
              </p>
              <p>
                That means an MDS orthodontist plans your braces, an MDS
                prosthodontist designs your crowns and dentures, and an MDS oral
                surgeon handles the surgical work — all coordinating on the same
                case.
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
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="wl-section bg-brand-50/40" aria-labelledby="values-heading">
        <Container>
          <SectionHeading
            eyebrow="How We Work"
            title="What Guides Every Treatment We Plan"
            subtitle="Four principles that shape how we diagnose, explain and deliver dental care at both Gurugram clinics."
          />

          <ul className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <li
                  key={value.title}
                  className="rounded-[16px] border border-line bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_28px_50px_-32px_rgba(10,37,64,0.4)]"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-[15.5px] font-bold leading-snug text-navy">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-[13.5px] leading-[1.75] text-muted">
                    {value.desc}
                  </p>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      <WhyChooseUs />
      <DoctorsSection />
      <Associations />
      <Testimonials />
      <ClinicsSection />
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
