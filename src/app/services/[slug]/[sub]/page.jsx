import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarCheck, ChevronRight, Home, Phone } from "lucide-react";

import Container from "@/components/Container";
import Button from "@/components/Button";
import SectionHeading from "@/components/SectionHeading";
import ServiceBody from "@/components/ServiceBody";
import ServiceEnquiryForm from "@/components/ServiceEnquiryForm";
import ClinicsSection from "@/components/ClinicsSection";
import CTASection from "@/components/CTASection";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";

import {
  getClinics,
  getContactLinks,
  getService,
  getSubService,
  getSubServiceParams,
} from "@/lib/content";
import { breadcrumbSchema, serviceSchema } from "@/lib/schema";
import { getIcon } from "@/lib/icons";

export async function generateStaticParams() {
  return getSubServiceParams();
}

export async function generateMetadata({ params }) {
  const { slug, sub } = await params;
  const [service, subService] = await Promise.all([
    getService(slug),
    getSubService(slug, sub),
  ]);

  if (!service || !subService) return { title: "Treatment Not Found" };

  const url = `/services/${slug}/${sub}`;

  return {
    title: { absolute: subService.seoTitle },
    description: subService.seoDescription,
    alternates: { canonical: url },
    openGraph: {
      title: subService.seoTitle,
      description: subService.seoDescription,
      url,
      type: "article",
      images: [{ url: service.image, width: 1200, height: 630, alt: service.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: subService.seoTitle,
      description: subService.seoDescription,
      images: [service.image],
    },
  };
}

export default async function SubServicePage({ params }) {
  const { slug, sub } = await params;
  const [service, subService] = await Promise.all([
    getService(slug),
    getSubService(slug, sub),
  ]);

  if (!service || !subService) notFound();

  const [clinics, { settings: site, telHref }] = await Promise.all([
    getClinics(),
    getContactLinks(),
  ]);

  const Icon = getIcon(service.icon);
  const siblings = (service.subServices ?? []).filter((s) => s.slug !== sub);

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: service.title, href: `/services/${service.slug}` },
    { name: subService.name, href: `/services/${slug}/${sub}` },
  ];

  return (
    <>
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
                  <Link
                    href={`/services/${service.slug}`}
                    className="transition-colors hover:text-brand"
                  >
                    {service.title}
                  </Link>
                </li>
                <li className="flex items-center gap-1.5">
                  <ChevronRight className="h-3.5 w-3.5 text-line" aria-hidden="true" />
                  <span className="font-medium text-navy" aria-current="page">
                    {subService.name}
                  </span>
                </li>
              </ol>
            </nav>

            <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white px-3.5 py-1.5 text-[14px] font-semibold text-brand-dark">
              <Icon className="h-4 w-4" aria-hidden="true" />
              {service.title}
            </span>

            <h1 className="mt-4 text-[30px] font-bold leading-[1.15] text-navy sm:text-[38px] lg:text-[42px]">
              {subService.name}
            </h1>

            <p className="mt-5 max-w-xl text-[16px] leading-[1.6] text-muted">
              {subService.seoDescription}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button href={`/contact?service=${slug}&sub=${sub}`} size="lg" data-book-appointment>
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

      <section className="wl-section" aria-label="Treatment details">
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <ServiceBody sections={subService.sections} />
          </div>

          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <ServiceEnquiryForm
                treatment={subService.name}
                clinics={clinics}
                site={site}
                telHref={telHref}
              />
            </div>
          </aside>
        </Container>
      </section>

      {siblings.length ? (
        <section className="wl-section bg-brand-50/40" aria-labelledby="sibling-heading">
          <Container>
            <Reveal>
              <SectionHeading
                eyebrow="Other Options"
                title={`More ${service.title} Options`}
                subtitle="Not sure which suits you? Our specialists will guide you at your consultation."
              />
            </Reveal>

            <ul className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {siblings.map((item, i) => (
                <Reveal as="li" key={item.slug} delay={(i % 3) * 90} className="h-full">
                  <Link
                    href={`/services/${service.slug}/${item.slug}`}
                    className="group flex h-full flex-col rounded-[14px] border border-line bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_18px_34px_-20px_rgba(10,37,64,0.3)]"
                  >
                    <h3 className="text-[18px] font-bold leading-snug text-navy transition-colors group-hover:text-brand">
                      {item.name}
                    </h3>
                    <p className="mt-2.5 line-clamp-3 flex-1 text-[15px] leading-[1.6] text-muted">
                      {item.blurb}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-coral">
                      Read more
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </ul>

            <div className="mt-8 text-center">
              <Link
                href={`/services/${service.slug}`}
                className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-coral hover:text-coral-dark"
              >
                Back to {service.title}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </Container>
        </section>
      ) : null}

      <CTASection
        headingId="sub-cta-heading"
        title={`Book Your ${subService.name} Consultation`}
        subtitle="Call us or send a request and our team will confirm a time that works for you."
      />

      <ClinicsSection />

      <JsonLd data={serviceSchema({ ...service, title: subService.name, slug: `${slug}/${sub}`, seoDescription: subService.seoDescription }, site)} />
      <JsonLd data={breadcrumbSchema(crumbs)} />
    </>
  );
}
