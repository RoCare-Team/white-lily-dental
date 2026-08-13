"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck, ChevronDown, Mail, MapPin, Phone, X } from "lucide-react";

import Logo from "./Logo";
import Button from "./Button";
import { getIcon } from "@/lib/icons";

export default function MobileMenu({
  open,
  onClose,
  services,
  navLinks,
  site,
  telHref,
}) {
  const waHref = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
    "Hello White Lily Dental, I would like to book a dental appointment."
  )}`;
  const pathname = usePathname();
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div className="lg:hidden" aria-hidden={!open}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-navy/50 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={`fixed inset-y-0 right-0 z-50 flex w-[88%] max-w-[400px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-[68px] shrink-0 items-center justify-between border-b border-line px-5">
          <Logo />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line text-navy transition-colors hover:bg-brand-50"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 py-5">
          <ul className="space-y-1">
            {navLinks.map((link) =>
              link.hasMenu ? (
                <li key={link.href}>
                  <button
                    type="button"
                    onClick={() => setServicesOpen((v) => !v)}
                    aria-expanded={servicesOpen}
                    className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-[15px] font-semibold transition-colors ${
                      isActive(link.href)
                        ? "bg-brand-50 text-brand"
                        : "text-navy hover:bg-brand-50"
                    }`}
                  >
                    Services
                    <ChevronDown
                      className={`h-4.5 w-4.5 transition-transform duration-300 ${
                        servicesOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      servicesOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <ul className="ml-4 mt-1 space-y-0.5 border-l border-line pl-3">
                        <li>
                          <Link
                            href="/services"
                            onClick={onClose}
                            className="block rounded-lg px-3 py-2.5 text-[13.5px] font-semibold text-brand hover:bg-brand-50"
                          >
                            All Services
                          </Link>
                        </li>
                        {services.map((service) => {
                          const Icon = getIcon(service.icon);
                          return (
                            <li key={service.slug}>
                              <Link
                                href={`/services/${service.slug}`}
                                onClick={onClose}
                                className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13.5px] text-navy/80 transition-colors hover:bg-brand-50 hover:text-brand"
                              >
                                {service.iconImage ? (
                                  <Image
                                    src={service.iconImage}
                                    alt=""
                                    width={80}
                                    height={80}
                                    aria-hidden="true"
                                    className="h-5 w-5 shrink-0"
                                  />
                                ) : (
                                  <Icon
                                    className="h-4 w-4 shrink-0 text-brand"
                                    aria-hidden="true"
                                  />
                                )}
                                {service.menuTitle}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </li>
              ) : (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className={`block rounded-xl px-4 py-3 text-[15px] font-semibold transition-colors ${
                      isActive(link.href)
                        ? "bg-brand-50 text-brand"
                        : "text-navy hover:bg-brand-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            )}
          </ul>

          <div className="mt-6 space-y-3 rounded-2xl border border-line bg-brand-50/60 p-5">
            <a
              href={telHref}
              className="flex items-center gap-3 text-[14px] font-semibold text-navy"
            >
              <Phone className="h-4 w-4 text-coral" aria-hidden="true" />
              {site.phoneDisplay}
            </a>
            <a
              href={`mailto:${site.email}`}
              className="flex items-center gap-3 break-all text-[13.5px] text-muted"
            >
              <Mail className="h-4 w-4 shrink-0 text-coral" aria-hidden="true" />
              {site.email}
            </a>
            <p className="flex items-start gap-3 text-[13.5px] text-muted">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-coral" aria-hidden="true" />
              Sector 69 &amp; 77, Gurugram
            </p>
          </div>
        </nav>

        <div className="shrink-0 space-y-2 border-t border-line p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <Button href="/contact" size="md" className="w-full" onClick={onClose} data-book-appointment>
            <CalendarCheck className="h-4 w-4" aria-hidden="true" />
            Book Appointment
          </Button>
          <Button href={waHref} variant="outline" size="md" className="w-full">
            WhatsApp Us
          </Button>
        </div>
      </div>
    </div>
  );
}
