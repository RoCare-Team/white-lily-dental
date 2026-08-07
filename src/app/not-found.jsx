import Link from "next/link";
import { ArrowRight, Home, Phone } from "lucide-react";

import Container from "@/components/Container";
import Button from "@/components/Button";
import { services } from "@/data/services";
import { site, telHref } from "@/data/site";

export const metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="wl-section">
      <Container className="flex flex-col items-center text-center">
        <span className="wl-eyebrow">Error 404</span>
        <h1 className="mt-4 max-w-2xl text-[32px] font-bold leading-[1.15] text-navy sm:text-[42px]">
          We couldn’t find that page
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-[1.8] text-muted">
          The page may have moved or the link may be out of date. Try one of our
          treatment pages below, or call the clinic and we’ll point you in the
          right direction.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href="/" size="lg">
            <Home className="h-[18px] w-[18px]" aria-hidden="true" />
            Back to Home
          </Button>
          <Button href={telHref} variant="coral" size="lg">
            <Phone className="h-[18px] w-[18px]" aria-hidden="true" />
            Call {site.phoneDisplay}
          </Button>
        </div>

        <ul className="mt-14 grid w-full max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 6).map((service) => (
            <li key={service.slug}>
              <Link
                href={`/services/${service.slug}`}
                className="group flex items-center justify-between gap-3 rounded-xl border border-line bg-white px-5 py-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:bg-brand-50"
              >
                <span className="text-[14px] font-semibold text-navy group-hover:text-brand">
                  {service.title}
                </span>
                <ArrowRight
                  className="h-4 w-4 shrink-0 text-brand transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
