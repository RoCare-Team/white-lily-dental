import Link from "next/link";
import { Clock, Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";

import Container from "./Container";
import Logo from "./Logo";
import { services } from "@/data/services";
import { clinics } from "@/data/clinics";
import { quickLinks } from "@/data/nav";
import { site, telHref } from "@/data/site";

const socialIcons = {
  Facebook,
  Instagram,
  LinkedIn: Linkedin,
  Twitter,
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy text-brand-100/80">
      <Container className="grid grid-cols-1 gap-8 py-11 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:py-14">
        {/* Brand */}
        <div className="lg:col-span-4">
          <Logo variant="light" />
          <p className="mt-5 max-w-sm text-[15px] leading-[1.65]">
            {site.intro}
          </p>
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
                  {Icon ? <Icon className="h-[17px] w-[17px]" aria-hidden="true" /> : null}
                </a>
              );
            })}
          </div>
        </div>

        {/* Services */}
        <nav aria-label="Dental services" className="lg:col-span-3">
          <h2 className="text-[13px] font-bold uppercase tracking-[0.16em] text-white">
            Dental Services
          </h2>
          <ul className="mt-5 space-y-2.5">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className="inline-block text-[15px] transition-colors hover:text-white"
                >
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Quick links */}
        <nav aria-label="Quick links" className="lg:col-span-2">
          <h2 className="text-[13px] font-bold uppercase tracking-[0.16em] text-white">
            Quick Links
          </h2>
          <ul className="mt-5 space-y-2.5">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-block text-[15px] transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/privacy-policy"
                className="inline-block text-[15px] transition-colors hover:text-white"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </nav>

        {/* Clinics + contact */}
        <div className="sm:col-span-2 lg:col-span-3">
          <h2 className="text-[13px] font-bold uppercase tracking-[0.16em] text-white">
            Our Clinics
          </h2>
          <ul className="mt-5 space-y-5">
            {clinics.map((clinic) => (
              <li key={clinic.id}>
                <p className="flex items-start gap-2.5 text-[15px] leading-relaxed">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-coral" aria-hidden="true" />
                  <span>
                    <span className="block font-semibold text-white">
                      {clinic.shortName}
                    </span>
                    {clinic.address}
                  </span>
                </p>
              </li>
            ))}
          </ul>

          <h2 className="mt-8 text-[13px] font-bold uppercase tracking-[0.16em] text-white">
            Contact
          </h2>
          <ul className="mt-5 space-y-3 text-[15px]">
            <li>
              <a href={telHref} className="flex items-center gap-2.5 transition-colors hover:text-white">
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
