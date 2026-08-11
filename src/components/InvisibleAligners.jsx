import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarCheck, Check, Phone } from "lucide-react";

import Container from "./Container";
import Reveal from "./Reveal";
import { getAssociations, getContactLinks } from "@/lib/content";

const benefits = ["Invisible", "No wires, no discomfort", "No pain", "Removable"];

const PHOTO =
  "https://images.unsplash.com/photo-1694675236489-d73651370688?auto=format&fit=crop&w=1100&q=85";
const PHOTO_ALT =
  "Clear invisible aligner trays in their case at White Lily Dental, Gurugram";

/* Pulled from the associations we actually list */
const pickProvider = (associations) =>
  associations.find((a) => /invisalign/i.test(a.name ?? "")) || associations[0];

export default async function InvisibleAligners() {
  const [{ telHref }, associations] = await Promise.all([
    getContactLinks(),
    getAssociations(),
  ]);
  const provider = pickProvider(associations);
  return (
    <section className="wl-section bg-white" aria-labelledby="aligners-heading">
      <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Photo — sits on the left so it alternates with the section above */}
        <Reveal variant="left">
          <div className="relative">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-6 -top-6 h-40 w-40 rounded-full bg-brand-100/70 blur-2xl"
            />
            <div className="relative h-72 overflow-hidden rounded-[18px] border border-line shadow-[0_26px_50px_-30px_rgba(10,37,64,0.4)] sm:h-80 lg:h-88">
              <Image
                src={PHOTO}
                alt={PHOTO_ALT}
                fill
                sizes="(max-width: 1024px) 92vw, 46vw"
                className="object-cover"
              />
            </div>

            <div className="absolute -bottom-5 right-5 rounded-[14px] border border-line bg-white px-4 py-3 shadow-[0_18px_36px_-22px_rgba(10,37,64,0.45)]">
              <p className="text-[15px] font-bold leading-none text-navy">
                {provider.abbr} Provider
              </p>
              <p className="mt-1.5 text-[13.5px] text-muted">{provider.note}</p>
            </div>
          </div>
        </Reveal>

        {/* Copy */}
        <Reveal variant="right" delay={90}>
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
            noticing — planned by our MDS orthodontist.
          </p>

          <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <li
                key={benefit}
                className="flex items-center gap-3 rounded-[12px] border border-line bg-white px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-[0_14px_26px_-18px_rgba(10,37,64,0.3)]"
              >
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-coral text-white">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
                </span>
                <span className="text-[15px] font-medium leading-snug text-navy">
                  {benefit}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href={telHref}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[11px] bg-coral px-6 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-coral-dark"
            >
              <Phone className="h-[18px] w-[18px]" aria-hidden="true" />
              Call Now
            </a>
            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[11px] bg-deep px-6 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-deep-600"
            >
              <CalendarCheck className="h-[18px] w-[18px]" aria-hidden="true" />
              Book an Appointment
            </Link>
          </div>

          <Link
            href="/services/braces-treatment"
            className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-coral transition-colors hover:text-coral-dark"
          >
            Learn more about orthodontic options
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
