import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CalendarCheck,
  Check,
  ChevronRight,
  GraduationCap,
  Home,
  Phone,
} from "lucide-react";

import Container from "@/components/Container";
import Button from "@/components/Button";
import SectionHeading from "@/components/SectionHeading";
import ServiceCard from "@/components/ServiceCard";
import ClinicsSection from "@/components/ClinicsSection";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";

import { doctors, getDoctor } from "@/data/doctors";
import { getService } from "@/data/services";
import { site, telHref } from "@/data/site";
import { breadcrumbSchema } from "@/lib/schema";

export function generateStaticParams() {
  return doctors.map((doctor) => ({ slug: doctor.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const doctor = getDoctor(slug);

  if (!doctor) return { title: "Doctor Not Found" };

  const title = `${doctor.name} — ${doctor.qualification}`;
  const description = `${doctor.name}, ${doctor.qualification}, treats patients at White Lily Dental's Sector 69 and Sector 77 clinics in Gurugram. ${doctor.bio}`;

  return {
    title,
    description,
    alternates: { canonical: `/doctors/${doctor.slug}` },
    openGraph: {
      title: `${doctor.name} | White Lily Dental Gurugram`,
      description,
      url: `/doctors/${doctor.slug}`,
      type: "profile",
      images: [{ url: doctor.image, alt: doctor.imageAlt }],
    },
  };
}

export default async function DoctorPage({ params }) {
  const { slug } = await params;
  const doctor = getDoctor(slug);

  if (!doctor) notFound();

  const doctorServices = doctor.services.map(getService).filter(Boolean);

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: doctor.name,
    medicalSpecialty: "Dentistry",
    description: doctor.bio,
    image: doctor.image,
    url: `${site.url}/doctors/${doctor.slug}`,
    worksFor: { "@type": "Dentist", name: site.name, telephone: site.phone },
  };

  return (
    <>
      <section className="border-b border-line bg-brand-50/50">
        <Container className="grid grid-cols-1 items-center gap-9 py-9 lg:grid-cols-12 lg:gap-12 lg:py-12">
          <div className="lg:col-span-5">
            <div className="relative aspect-1/1 overflow-hidden rounded-[18px] border border-line shadow-[0_36px_70px_-42px_rgba(10,37,64,0.5)]">
              <Image
                src={doctor.image}
                alt={doctor.imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 92vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-7">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-1.5 text-[14px] text-muted">
                <li>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 transition-colors hover:text-brand"
                  >
                    <Home className="h-3.5 w-3.5" aria-hidden="true" />
                    Home
                  </Link>
                </li>
                <li className="flex items-center gap-1.5">
                  <ChevronRight className="h-3.5 w-3.5 text-line" aria-hidden="true" />
                  <Link href="/doctors" className="transition-colors hover:text-brand">
                    Doctors
                  </Link>
                </li>
                <li className="flex items-center gap-1.5">
                  <ChevronRight className="h-3.5 w-3.5 text-line" aria-hidden="true" />
                  <span className="font-medium text-navy" aria-current="page">
                    {doctor.name}
                  </span>
                </li>
              </ol>
            </nav>

            <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white px-3.5 py-1.5 text-[14px] font-semibold text-brand-dark">
              <GraduationCap className="h-4 w-4" aria-hidden="true" />
              {doctor.specialty}
            </span>

            <h1 className="mt-4 text-[30px] font-bold leading-[1.15] text-navy sm:text-[38px] lg:text-[44px]">
              {doctor.name}
            </h1>

            <p className="mt-2 text-[15px] font-semibold text-brand">
              {doctor.qualification}
            </p>

            <p className="mt-5 max-w-xl text-[15px] leading-[1.8] text-muted">
              {doctor.bio}
            </p>

            <h2 className="mt-8 text-[16px] font-bold text-navy">
              Areas of focus
            </h2>
            <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              {doctor.focus.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white text-coral">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
                  </span>
                  <span className="text-[14px] leading-snug text-navy/85">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button href="/contact" size="lg">
                <CalendarCheck className="h-[18px] w-[18px]" aria-hidden="true" />
                Book Appointment
              </Button>
              <Button href={telHref} variant="coral" size="lg">
                <Phone className="h-[18px] w-[18px]" aria-hidden="true" />
                Call {site.phoneDisplay}
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {doctorServices.length ? (
        <section className="wl-section" aria-labelledby="doctor-services-heading">
          <Container>
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <SectionHeading
                align="left"
                eyebrow="Treatments"
                title={`Treatments by ${doctor.name}`}
                subtitle="Book directly for any of these treatments at the Sector 69 or Sector 77 clinic."
              />
              <Link
                href="/services"
                className="inline-flex shrink-0 items-center gap-1.5 text-[13.5px] font-semibold text-coral hover:text-coral-dark"
              >
                View all services
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {doctorServices.map((service) => (
                <li key={service.slug} className="h-full">
                  <ServiceCard service={service} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      <ClinicsSection className="bg-brand-50/40" />
      <CTASection
        headingId="doctor-cta-heading"
        title={`Book a Consultation with ${doctor.name}`}
        subtitle="Call us or send an appointment request and our team will confirm a suitable time at either Gurugram clinic."
      />

      <JsonLd data={personSchema} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Doctors", href: "/doctors" },
          { name: doctor.name, href: `/doctors/${doctor.slug}` },
        ])}
      />
    </>
  );
}
