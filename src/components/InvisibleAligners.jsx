import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarCheck, Phone } from "lucide-react";

import Container from "./Container";
import Button from "./Button";
import { telHref } from "@/data/site";

const bullets = ["Invisible", "No wires, no discomfort", "No pain", "Removable"];

function Triangle() {
  return (
    <span
      aria-hidden="true"
      className="mt-1.5 shrink-0"
      style={{
        width: 0,
        height: 0,
        borderTop: "5px solid transparent",
        borderBottom: "5px solid transparent",
        borderLeft: "7px solid var(--color-coral)",
      }}
    />
  );
}

export default function InvisibleAligners() {
  return (
    <section className="wl-section-sm bg-white" aria-labelledby="aligners-heading">
      <Container className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Copy */}
        <div>
          <span className="wl-eyebrow">
            <span className="h-px w-6 bg-coral/50" aria-hidden="true" />
            Clear Aligner Treatment
          </span>

          <h2
            id="aligners-heading"
            className="mt-2.5 text-[28px] font-bold leading-[1.15] text-navy sm:text-[32px] lg:text-[36px]"
          >
            Invisible Aligners
          </h2>

          <p className="mt-3 max-w-150 text-[16px] leading-[1.6] text-muted">
            Clear, custom-made trays that straighten your teeth without anyone
            noticing — planned by our MDS orthodontist at both Gurugram clinics.
          </p>

          <ul className="mt-5 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
            {bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3">
                <Triangle />
                <span className="text-[15.5px] font-medium leading-snug text-navy">
                  {bullet}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button href={telHref} variant="coral" size="md">
              <Phone className="h-[18px] w-[18px]" aria-hidden="true" />
              Call Now
            </Button>
            <Button href="/contact" size="md">
              <CalendarCheck className="h-[18px] w-[18px]" aria-hidden="true" />
              Book an Appointment
            </Button>
          </div>

          <Link
            href="/services/braces-treatment"
            className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-coral transition-colors hover:text-coral-dark"
          >
            Learn more about orthodontic options
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Image — fixed height so it never drives the section */}
        <div className="relative h-60 overflow-hidden rounded-[14px] border border-line sm:h-72 lg:h-88">
          <Image
            src="https://images.unsplash.com/photo-1611695434369-a8f5d76ceb7b?auto=format&fit=crop&w=1200&q=80"
            alt="Smiling patient holding a clear invisible aligner tray at White Lily Dental Gurugram"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-brand/10"
            style={{ clipPath: "polygon(45% 0, 100% 0, 100% 48%)" }}
          />
        </div>
      </Container>
    </section>
  );
}
