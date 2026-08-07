import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CalendarCheck,
  Check,
  ChevronRight,
  Home,
  Phone,
  ShieldCheck,
} from "lucide-react";

import Container from "@/components/Container";
import Button from "@/components/Button";
import SectionHeading from "@/components/SectionHeading";
import ServiceCard from "@/components/ServiceCard";
import ClinicsSection from "@/components/ClinicsSection";
import FAQ from "@/components/FAQ";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";

import { services, getService, getRelatedServices } from "@/data/services";
import { site, telHref } from "@/data/site";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/schema";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) {
    return { title: "Service Not Found" };
  }

  const url = `/services/${service.slug}`;

  return {
    title: service.seoTitle,
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
  const service = getService(slug);

  if (!service) notFound();

  const Icon = service.icon;
  const related = getRelatedServices(slug);

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

            <h1 className="mt-4 text-[30px] font-bold leading-[1.15] text-navy sm:text-[38px] lg:text-[46px]">
              {service.title}
            </h1>

            <p className="mt-5 max-w-xl text-[15.5px] leading-[1.8] text-muted sm:text-base">
              {service.intro}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
            <div className="relative aspect-4/3 overflow-hidden rounded-[18px] border border-line shadow-[0_36px_70px_-42px_rgba(10,37,64,0.5)]">
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

      {/* Overview + What is it */}
      <section className="wl-section" aria-labelledby="overview-heading">
        <Container className="grid grid-cols-1 gap-9 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <span className="wl-eyebrow">
              <span className="h-px w-6 bg-coral/50" aria-hidden="true" />
              Overview
            </span>
            <h2
              id="overview-heading"
              className="mt-4 text-[26px] font-bold leading-[1.2] text-navy sm:text-[32px]"
            >
              About {service.title} at White Lily Dental
            </h2>
            <div className="wl-prose mt-5 text-[15px]">
              {service.overview.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>

            <h2 className="mt-9 text-[22px] font-bold text-navy sm:text-[26px]">
              {service.whatIsIt.heading}
            </h2>
            <div className="wl-prose mt-4 text-[15px]">
              {service.whatIsIt.body.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Sticky sidebar */}
          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <div className="rounded-[16px] border border-line bg-brand-50/50 p-6">
                <h2 className="text-[19px] font-bold text-navy">
                  {service.whoNeeds.heading}
                </h2>
                <ul className="mt-5 space-y-3">
                  {service.whoNeeds.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white text-brand">
                        <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
                      </span>
                      <span className="text-[14px] leading-snug text-navy/85">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 rounded-[16px] border border-line bg-navy p-6 text-white">
                <h2 className="text-[17px] font-bold text-white">
                  Not sure if this is right for you?
                </h2>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-brand-100/80">
                  Book a consultation and one of our MDS specialists will examine
                  you and explain every option — including the ones that cost
                  less.
                </p>
                <div className="mt-6 space-y-2">
                  <Button href="/contact" variant="white" size="md" className="w-full">
                    <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                    Book Appointment
                  </Button>
                  <Button href={telHref} variant="coral" size="md" className="w-full">
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    {site.phoneDisplay}
                  </Button>
                </div>
              </div>
            </div>
          </aside>
        </Container>
      </section>

      {/* Benefits */}
      <section className="wl-section bg-brand-50/40" aria-labelledby="benefits-heading">
        <Container>
          <SectionHeading
            eyebrow="Benefits"
            title={`Benefits of ${service.title}`}
            subtitle={`What ${service.title.toLowerCase()} at White Lily Dental does for your oral health, comfort and confidence.`}
          />

          <ul className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {service.benefits.map((benefit, index) => (
              <li
                key={benefit.title}
                className="rounded-[16px] border border-line bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_28px_50px_-32px_rgba(10,37,64,0.4)]"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-[14px] font-bold text-brand">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-[15.5px] font-bold leading-snug text-navy">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-[13.5px] leading-[1.75] text-muted">
                  {benefit.desc}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Process */}
      <section className="wl-section" aria-labelledby="process-heading">
        <Container>
          <SectionHeading
            eyebrow="Treatment Process"
            title={`How ${service.title} Works`}
            subtitle="Every stage is explained before it happens, so you always know what comes next and why."
          />

          <ol className="mx-auto mt-9 max-w-4xl">
            {service.process.map((step, index) => (
              <li key={step.title} className="relative flex gap-5 pb-7 last:pb-0">
                {index !== service.process.length - 1 ? (
                  <span
                    className="absolute left-[23px] top-12 h-[calc(100%-2.5rem)] w-px bg-line"
                    aria-hidden="true"
                  />
                ) : null}

                <span className="relative z-10 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-brand-100 bg-brand-50 text-[15px] font-bold text-brand">
                  {index + 1}
                </span>

                <div className="pt-1.5">
                  <h3 className="text-[16.5px] font-bold text-navy">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-[14px] leading-[1.8] text-muted">
                    {step.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Why us */}
      <section className="wl-section bg-navy" aria-labelledby="why-service-heading">
        <Container className="grid grid-cols-1 gap-9 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <SectionHeading
              align="left"
              light
              eyebrow="Why White Lily Dental"
              title={`Why Choose Us for ${service.title}?`}
              subtitle="Specialist-led treatment, transparent pricing and follow-up care that does not stop when you leave the chair."
            />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/contact" variant="white" size="lg">
                <CalendarCheck className="h-[18px] w-[18px]" aria-hidden="true" />
                Book Appointment
              </Button>
              <Button href={telHref} variant="coral" size="lg">
                <Phone className="h-[18px] w-[18px]" aria-hidden="true" />
                Call Now
              </Button>
            </div>
          </div>

          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
            {service.whyUs.map((reason) => (
              <li
                key={reason}
                className="flex items-start gap-3 rounded-[16px] border border-white/10 bg-white/[0.04] p-5"
              >
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-coral/15 text-coral">
                  <ShieldCheck className="h-[18px] w-[18px]" aria-hidden="true" />
                </span>
                <p className="text-[14px] leading-[1.7] text-brand-100/85">
                  {reason}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Related treatments */}
      {related.length ? (
        <section className="wl-section" aria-labelledby="related-heading">
          <Container>
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <SectionHeading
                align="left"
                eyebrow="Related Treatments"
                title="You Might Also Need"
                subtitle="Treatments that often go together with this one, all available at both our Gurugram clinics."
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
              {related.map((item) => (
                <li key={item.slug} className="h-full">
                  <ServiceCard service={item} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      {/* FAQs */}
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
        subtitle="Call us or send a request and our team will confirm a time that works for you at the Sector 69 or Sector 77 clinic."
      />

      <ClinicsSection />

      <JsonLd data={serviceSchema(service)} />
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <JsonLd data={faqSchema(service.faqs)} />
    </>
  );
}
