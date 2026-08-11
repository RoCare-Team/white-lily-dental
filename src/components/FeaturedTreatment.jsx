import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarCheck, Check, Phone } from "lucide-react";

import Container from "./Container";
import Reveal from "./Reveal";
import { getContactLinks, getDoctors } from "@/lib/content";

const benefits = [
  "Improved appearance",
  "Enhanced functionality",
  "Preservation of oral health",
  "Improved self-confidence",
];

const PHOTO =
  "https://images.unsplash.com/photo-1739902526173-06750b78cfb7?auto=format&fit=crop&w=1100&q=85";
const PHOTO_ALT =
  "Dentist treating a relaxed patient during an implant consultation at White Lily Dental, Gurugram";

/* Same texture as the hero so the dark bands feel like one family */
const PATTERN = {
  backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 1.2px, transparent 1.2px)",
  backgroundSize: "26px 26px",
  opacity: 0.05,
};

/* The implantologist on the team, read from the doctors content */
const pickImplantologist = (doctors) =>
  doctors.find((d) => /implantolog/i.test(d.qualification ?? "")) || doctors[0];

export default async function FeaturedTreatment() {
  const [{ telHref }, doctors] = await Promise.all([getContactLinks(), getDoctors()]);
  const implantologist = pickImplantologist(doctors);
  return (
    <section
      className="relative overflow-hidden bg-deep"
      aria-labelledby="featured-implants-heading"
    >
      <div aria-hidden="true" className="absolute inset-0" style={PATTERN} />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-brand/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 right-1/3 h-72 w-72 rounded-full bg-coral/15 blur-3xl"
      />

      <Container className="relative grid grid-cols-1 items-center gap-10 py-12 lg:grid-cols-12 lg:gap-12 md:py-14">
        {/* Copy */}
        <Reveal variant="left" className="lg:col-span-6">
          <span className="wl-eyebrow">
            <span className="h-px w-6 bg-coral/60" aria-hidden="true" />
            Featured Treatment
          </span>

          <h2
            id="featured-implants-heading"
            className="mt-2.5 text-[28px] font-bold leading-[1.15] text-white sm:text-[32px] lg:text-[36px]"
          >
            Dental Implants
          </h2>

          <p className="mt-3 max-w-150 text-[16px] leading-[1.6] text-white/80">
            A titanium post replaces the missing root and carries a custom
            ceramic crown — the only tooth replacement that also stops the
            jawbone shrinking.
          </p>

          <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <li
                key={benefit}
                className="flex items-center gap-3 rounded-[12px] border border-white/12 bg-white/[0.06] px-4 py-3 transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.1]"
              >
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-coral text-white">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
                </span>
                <span className="text-[15px] font-medium leading-snug text-white/90">
                  {benefit}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[11px] bg-white px-6 text-[15px] font-semibold text-deep transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-50"
            >
              <CalendarCheck className="h-[18px] w-[18px]" aria-hidden="true" />
              Book an Appointment
            </Link>
            <a
              href={telHref}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[11px] bg-coral px-6 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-coral-dark"
            >
              <Phone className="h-[18px] w-[18px]" aria-hidden="true" />
              Call Now
            </a>
          </div>

          <Link
            href="/services/dental-implants"
            className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-coral transition-colors hover:text-white"
          >
            Read more about dental implants
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Reveal>

        {/* Photo */}
        <Reveal variant="right" delay={90} className="lg:col-span-6">
          <div className="relative">
            <div className="relative h-72 overflow-hidden rounded-[20px] border border-white/12 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] sm:h-88 lg:h-100">
              <Image
                src={PHOTO}
                alt={PHOTO_ALT}
                fill
                sizes="(max-width: 1024px) 92vw, 46vw"
                className="object-cover"
              />
            </div>

            <div className="absolute -bottom-5 left-5 rounded-[14px] border border-white/15 bg-deep/90 px-4 py-3 shadow-[0_18px_36px_-20px_rgba(0,0,0,0.7)] backdrop-blur">
              <p className="text-[15px] font-bold leading-none text-white">
                Certified Implantologist
              </p>
              <p className="mt-1.5 text-[13.5px] text-brand-100/75">
                {implantologist.name}
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
