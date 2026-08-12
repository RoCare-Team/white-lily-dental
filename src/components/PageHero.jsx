import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

import Container from "./Container";

export default function PageHero({ title, subtitle, breadcrumbs = [], children }) {
  // A long page title at the full display size swamps the page, so it steps
  // down a notch. Short titles keep the original scale.
  const isLong = typeof title === "string" && title.length > 46;
  const titleSize = isLong
    ? "text-[23px] sm:text-[28px] lg:text-[33px]"
    : "text-[30px] sm:text-[38px] lg:text-[46px]";

  return (
    <section className="wl-page-hero relative overflow-hidden border-b border-line bg-brand-50/50">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/70" />
        <div className="absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-coral-50/60 blur-3xl" />
      </div>

      <Container className="relative py-9 md:py-12">
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
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <li key={crumb.href} className="flex items-center gap-1.5">
                  <ChevronRight className="h-3.5 w-3.5 text-line" aria-hidden="true" />
                  {isLast ? (
                    <span className="font-medium text-navy" aria-current="page">
                      {crumb.name}
                    </span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="transition-colors hover:text-brand"
                    >
                      {crumb.name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        <h1
          className={`mt-5 max-w-3xl font-bold leading-[1.2] text-navy ${titleSize}`}
        >
          {title}
        </h1>

        {subtitle ? (
          <p className="mt-4 max-w-2xl text-[15px] leading-[1.8] text-muted sm:text-base">
            {subtitle}
          </p>
        ) : null}

        {children}
      </Container>
    </section>
  );
}
