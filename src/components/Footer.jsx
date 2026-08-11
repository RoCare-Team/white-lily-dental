import Link from "next/link";
import {
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";

import Container from "./Container";
import Logo from "./Logo";
import { getClinics, getContactLinks, getNavigation, getServices } from "@/lib/content";

const socialIcons = {
  Facebook,
  Instagram,
  LinkedIn: Linkedin,
  Twitter,
};

const linkClass =
  "inline-block text-[15px] transition-colors duration-200 hover:text-white";

const headingClass =
  "text-[13px] font-bold uppercase tracking-[0.16em] text-white";

export default async function Footer() {
  const [services, clinics, navigation, { settings: site, telHref }] =
    await Promise.all([
      getServices(),
      getClinics(),
      getNavigation(),
      getContactLinks(),
    ]);
  const quickLinks = navigation.quickLinks ?? [];
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy text-brand-100/75">
      <Container className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:py-14">
        {/* Brand + how to reach us — keeps this column and the others even */}
        <div className="sm:col-span-2 lg:col-span-4">
          <Logo variant="light" />

          <p className="mt-5 max-w-xs text-[15px] leading-[1.65]">
            {site.tagline}. Orthodontics, implants, prosthodontics and oral
            surgery under one roof.
          </p>

          <ul className="mt-6 space-y-3 text-[15px]">
            <li>
              <a
                href={telHref}
                className="flex items-center gap-2.5 transition-colors hover:text-white"
              >
                <Phone className="h-4 w-4 shrink-0 text-coral" aria-hidden="true" />
                {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.email}`}
                className="flex items-start gap-2.5 break-all transition-colors hover:text-white"
              >
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-coral" aria-hidden="true" />
                {site.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-coral" aria-hidden="true" />
              {site.hours}
            </li>
          </ul>

          <div className="mt-6 flex items-center gap-2.5">
            {site.socials.map((social) => {
              const Icon = socialIcons[social.label];
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`White Lily Dental on ${social.label}`}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/12 text-brand-100 transition-all duration-300 hover:-translate-y-0.5 hover:border-coral hover:bg-coral hover:text-white"
                >
                  {Icon ? <Icon className="h-4.5 w-4.5" aria-hidden="true" /> : null}
                </a>
              );
            })}
          </div>
        </div>

        {/* Services */}
        <nav aria-label="Dental services" className="lg:col-span-3">
          <h2 className={headingClass}>Dental Services</h2>
          <ul className="mt-5 space-y-2.5">
            {services.map((service) => (
              <li key={service.slug}>
                <Link href={`/services/${service.slug}`} className={linkClass}>
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Quick links */}
        <nav aria-label="Quick links" className="lg:col-span-2">
          <h2 className={headingClass}>Quick Links</h2>
          <ul className="mt-5 space-y-2.5">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Clinics — each address opens directions */}
        <div className="sm:col-span-2 lg:col-span-3">
          <h2 className={headingClass}>Our Clinics</h2>
          <ul className="mt-5 space-y-4">
            {clinics.map((clinic) => (
              <li key={clinic.id}>
                <a
                  href={clinic.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-2.5 text-[14.5px] leading-[1.6] transition-colors hover:text-white"
                >
                  <MapPin
                    className="mt-0.5 h-4 w-4 shrink-0 text-coral"
                    aria-hidden="true"
                  />
                  <span>
                    <span className="block font-semibold text-white">
                      {clinic.shortName}
                    </span>
                    {clinic.address}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-3 py-5 text-[14px] sm:flex-row">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy-policy" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/contact" className="transition-colors hover:text-white">
              Book Appointment
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
