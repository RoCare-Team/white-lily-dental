"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown, Menu, Phone } from "lucide-react";

import Container from "./Container";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import TopBar from "./TopBar";
import { services } from "@/data/services";
import { navLinks } from "@/data/nav";
import { site, telHref } from "@/data/site";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMegaOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMegaOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMegaOpen(false), 140);
  };

  const isActive = (href) => {
    if (href.startsWith("/#")) return false;
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  };

  const linkClass = (href) =>
    `text-[16px] font-medium transition-colors ${
      isActive(href) ? "text-coral" : "text-navy hover:text-coral"
    }`;

  return (
    /* Sticking the whole header with a -40px offset lets the contact strip
       scroll away while the navbar pins itself to the top. A sticky child
       cannot escape its parent's box, so the sticky has to live here. */
    <header className="sticky -top-10 z-50">
      <TopBar />

      <div
        className={`relative bg-[#e8f2f8] transition-shadow duration-300 ${
          scrolled ? "shadow-[0_6px_22px_-18px_rgba(7,83,107,0.65)]" : ""
        }`}
      >
        <Container>
          <nav
            aria-label="Primary"
            className="flex h-[72px] items-center justify-between gap-6 xl:h-[85px]"
          >
            <Logo />

            <ul className="hidden items-center gap-7 xl:flex">
              {navLinks.map((link) =>
                link.hasMenu ? (
                  <li
                    key={link.href}
                    className="relative"
                    onMouseEnter={openMega}
                    onMouseLeave={scheduleClose}
                  >
                    <Link
                      href={link.href}
                      aria-expanded={megaOpen}
                      aria-haspopup="true"
                      onFocus={openMega}
                      className={`inline-flex items-center gap-1.5 ${linkClass(link.href)}`}
                    >
                      {link.label}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-300 ${
                          megaOpen ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ) : (
                  <li key={link.href}>
                    <Link href={link.href} className={linkClass(link.href)}>
                      {link.label}
                    </Link>
                  </li>
                )
              )}
            </ul>

            <div className="flex items-center gap-2 sm:gap-3">
              <a
                href={telHref}
                aria-label={`Call White Lily Dental on ${site.phoneDisplay}`}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-200 bg-white text-brand transition-colors hover:bg-brand-50 xl:hidden"
              >
                <Phone className="h-[18px] w-[18px]" aria-hidden="true" />
              </a>

              <Link
                href="/contact"
                className="hidden h-[42px] items-center gap-2 rounded-full bg-brand px-7 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-dark sm:inline-flex"
              >
                Book Appointment
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>

              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-200 bg-white text-navy transition-colors hover:bg-brand-50 xl:hidden"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </nav>
        </Container>

        {/* Services mega menu */}
        <div
          onMouseEnter={openMega}
          onMouseLeave={scheduleClose}
          className={`absolute inset-x-0 top-full hidden origin-top border-b border-line bg-white shadow-[0_28px_60px_-30px_rgba(10,37,64,0.4)] transition-all duration-200 xl:block ${
            megaOpen
              ? "pointer-events-auto visible translate-y-0 opacity-100"
              : "pointer-events-none invisible -translate-y-2 opacity-0"
          }`}
        >
          <Container className="grid grid-cols-12 gap-8 py-8">
            <div className="col-span-9">
              <div className="mb-5 flex items-end justify-between border-b border-line pb-4">
                <div>
                  <span className="wl-eyebrow">Our Treatments</span>
                  <h2 className="mt-2 text-xl font-bold text-navy">
                    Complete Dental Care Under One Roof
                  </h2>
                </div>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-coral hover:text-coral-dark"
                >
                  View all services
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>

              <ul className="grid grid-cols-2 gap-x-6 gap-y-1">
                {services.map((service) => {
                  const Icon = service.icon;
                  return (
                    <li key={service.slug}>
                      <Link
                        href={`/services/${service.slug}`}
                        className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-brand-50"
                      >
                        <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-white text-brand transition-colors group-hover:border-brand-200 group-hover:bg-brand group-hover:text-white">
                          <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[15px] font-semibold text-navy group-hover:text-brand">
                            {service.menuTitle}
                          </span>
                          <span className="mt-0.5 block truncate text-[14px] text-muted">
                            {service.excerpt}
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="col-span-3">
              <div className="flex h-full flex-col justify-between rounded-2xl bg-deep p-6 text-white">
                <div>
                  <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[14px] font-semibold uppercase tracking-wider text-brand-200">
                    Not sure what you need?
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-white">
                    Talk to a specialist first
                  </h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-brand-100/80">
                    Our MDS specialists will examine, explain your options and
                    give you a written plan before any treatment begins.
                  </p>
                </div>
                <div className="mt-6 space-y-2">
                  <Link
                    href="/contact"
                    className="inline-flex h-11 w-full items-center justify-center rounded-full bg-white text-[15px] font-semibold text-deep transition-colors hover:bg-brand-50"
                  >
                    Book Appointment
                  </Link>
                  <a
                    href={telHref}
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-coral text-[15px] font-semibold text-white transition-colors hover:bg-coral-dark"
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    {site.phoneDisplay}
                  </a>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
