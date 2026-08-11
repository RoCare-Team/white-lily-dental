import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarCheck, ChevronRight, Home, Phone } from "lucide-react";

import Container from "@/components/Container";
import Button from "@/components/Button";
import SectionHeading from "@/components/SectionHeading";
import ServiceCard from "@/components/ServiceCard";
import ServiceBody from "@/components/ServiceBody";
import ServiceEnquiryForm from "@/components/ServiceEnquiryForm";
import SubServiceGrid from "@/components/SubServiceGrid";
import ClinicsSection from "@/components/ClinicsSection";
import FAQ from "@/components/FAQ";
import CTASection from "@/components/CTASection";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";

import {
  getContactLinks,
  getClinics,
  getRelatedServices,
  getService,
  getServices,
} from "@/lib/content";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/schema";
import { getIcon } from "@/lib/icons";

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) return { title: "Service Not Found" };

  const url = `/services/${service.slug}`;

  return {
    title: { absolute: service.seoTitle },
    description: service.seoDescription,
    alternates: { canonical: url },
    openGraph: {
      title: service.seoTitle,
      description: service.seoDescription,
      url,
      type: "article",
      images: [{ url: service.image, width: 1200, height: 630, alt: service.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: service.seoTitle,
      description: service.seoDescription,
      images: [service.image],
    },
  };
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) notFound();

  const Icon = getIcon(service.icon);
  const [related, clinics, { settings: site, telHref }] = await Promise.all([
    getRelatedServices(slug),
    getClinics(),
    getContactLinks(),
  ]);

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: service.title, href: `/services/${service.slug}` },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line bg-brand-50/50">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -right-40 -top-40 h-[420px] w-[420px] rounded-full bg-white/70" />
        </div>

        <Container className="relative grid grid-cols-1 items-center gap-9 py-9 lg:grid-cols-12 lg:gap-12 lg:py-12">
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
                  <Link href="/services" className="transition-colors hover:text-brand">
                    Services
                  </Link>
                </li>
                <li className="flex items-center gap-1.5">
                  <ChevronRight className="h-3.5 w-3.5 text-line" aria-hidden="true" />
                  <span className="font-medium text-navy" aria-current="page">
                    {service.title}
                  </span>
                </li>
              </ol>
            </nav>

            <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white px-3.5 py-1.5 text-[14px] font-semibold text-brand-dark">
              <Icon className="h-4 w-4" aria-hidden="true" />
              Treatment in Gurugram
            </span>

            <h1 className="mt-4 text-[30px] font-bold leading-[1.15] text-navy sm:text-[38px] lg:text-[44px]">
              {service.title}
            </h1>

            <p className="mt-5 max-w-xl text-[16px] leading-[1.6] text-muted">
              {service.seoDescription}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
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

          <div className="lg:col-span-5">
            <div className="relative aspect-4/3 overflow-hidden rounded-[14px] border border-line shadow-[0_24px_48px_-30px_rgba(10,37,64,0.45)]">
              <Image
                src={service.image}
                alt={service.imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 92vw, 42vw"
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Live-site copy on the left, enquiry form alongside */}
      <section className="wl-section" aria-label="Treatment details">
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <ServiceBody tagline={service.tagline} sections={service.sections} />
          </div>

          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <ServiceEnquiryForm
                treatment={service.title}
                clinics={clinics}
                site={site}
                telHref={telHref}
              />
            </div>
          </aside>
        </Container>
      </section>

      <SubServiceGrid service={service} className="bg-brand-50/40" />

      {/* Related treatments */}
      {related.length ? (
        <section className="wl-section" aria-labelledby="related-heading">
          <Container>
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <Reveal>
                <SectionHeading
                  align="left"
                  eyebrow="Related Treatments"
                  title="You Might Also Need"
                  subtitle="Treatments that often go together with this one, at all three of our Gurugram clinics."
                />
              </Reveal>
              <Link
                href="/services"
                className="inline-flex shrink-0 items-center gap-1.5 text-[14.5px] font-semibold text-coral hover:text-coral-dark"
              >
                View all services
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item, i) => (
                <Reveal as="li" key={item.slug} delay={i * 90} className="h-full">
                  <ServiceCard service={item} />
                </Reveal>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      <FAQ
        className="bg-brand-50/40"
        headingId="service-faq-heading"
        eyebrow="FAQ"
        title={`${service.title} — Frequently Asked Questions`}
        subtitle="Common questions our Gurugram patients ask about this treatment."
        items={service.faqs}
      />

      <CTASection
        headingId="service-cta-heading"
        title={`Book Your ${service.title} Consultation`}
        subtitle="Call us or send a request and our team will confirm a time that works for you."
      />

      <ClinicsSection />

      <JsonLd data={serviceSchema(service, site)} />
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <JsonLd data={faqSchema(service.faqs)} />
    </>
  );
}
