import Link from "next/link";
import { ArrowRight } from "lucide-react";

import Container from "./Container";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

export default function SubServiceGrid({ service, className = "" }) {
  const subs = service.subServices || [];
  if (!subs.length) return null;

  return (
    <section className={`wl-section ${className}`} aria-labelledby="sub-services-heading">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Treatment Options"
            title={`Types of ${service.title}`}
            subtitle={`Choose the option that suits you — our specialists will help you decide.`}
          />
        </Reveal>

        <ul className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {subs.map((sub, i) => (
            <Reveal as="li" key={sub.slug} delay={(i % 3) * 90} className="h-full">
              <Link
                href={`/services/${service.slug}/${sub.slug}`}
                className="group flex h-full flex-col rounded-[14px] border border-line bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_18px_34px_-20px_rgba(10,37,64,0.3)]"
              >
                <h3 className="text-[18px] font-bold leading-snug text-navy transition-colors group-hover:text-brand">
                  {sub.name}
                </h3>
                <p className="mt-2.5 line-clamp-3 flex-1 text-[15px] leading-[1.6] text-muted">
                  {sub.blurb}
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
      </Container>
    </section>
  );
}
