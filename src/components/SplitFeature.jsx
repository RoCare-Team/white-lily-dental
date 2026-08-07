import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import Container from "./Container";
import Button from "./Button";

export default function SplitFeature({
  eyebrow,
  title,
  description,
  bullets = [],
  image,
  imageAlt,
  primary,
  secondary,
  moreLink,
  reverse = false,
  className = "",
  headingId,
}) {
  return (
    <section className={`wl-section-sm ${className}`} aria-labelledby={headingId}>
      <Container className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Image — fixed height so it never drives the section */}
        <div className={reverse ? "lg:order-2" : ""}>
          <div className="relative h-60 overflow-hidden rounded-[14px] border border-line sm:h-72 lg:h-88">
            <Image
              src={image}
              alt={imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className={reverse ? "lg:order-1" : ""}>
          {eyebrow ? (
            <span className="wl-eyebrow">
              <span className="h-px w-6 bg-coral/50" aria-hidden="true" />
              {eyebrow}
            </span>
          ) : null}

          <h2
            id={headingId}
            className="mt-2.5 text-[28px] font-bold leading-[1.15] text-navy sm:text-[32px] lg:text-[36px]"
          >
            {title}
          </h2>

          <p className="mt-3 max-w-150 text-[16px] leading-[1.6] text-muted">
            {description}
          </p>

          {bullets.length ? (
            <ul className="mt-5 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
              {bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2.5">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-coral"
                  />
                  <span className="text-[15.5px] font-medium leading-snug text-navy">
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}

          {primary || secondary ? (
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {secondary ? (
                <Button href={secondary.href} variant="coral" size="md">
                  {secondary.icon ? (
                    <secondary.icon className="h-[18px] w-[18px]" aria-hidden="true" />
                  ) : null}
                  {secondary.label}
                </Button>
              ) : null}
              {primary ? (
                <Button href={primary.href} size="md">
                  {primary.icon ? (
                    <primary.icon className="h-[18px] w-[18px]" aria-hidden="true" />
                  ) : null}
                  {primary.label}
                </Button>
              ) : null}
            </div>
          ) : null}

          {moreLink ? (
            <Link
              href={moreLink.href}
              className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-coral transition-colors hover:text-coral-dark"
            >
              {moreLink.label}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
