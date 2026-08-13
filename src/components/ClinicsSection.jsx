import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, Navigation, Phone } from "lucide-react";

import Container from "./Container";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { getClinics } from "@/lib/content";

export default async function ClinicsSection({ className = "" }) {
  const clinics = await getClinics();
  return (
    <section className={`wl-section ${className}`} aria-labelledby="clinics-heading">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Our Locations"
          title="Visit Us at Our Gurugram Clinics"
            subtitle="Three fully equipped clinics across Gurugram, open Monday to Sunday, with the same specialists and the same standard of care at each."
          />
        </Reveal>

        {/* Three columns only once there are three clinics to fill them —
            otherwise the row is capped and centred rather than leaving a hole
            on the right. */}
        <ul
          className={`mx-auto mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2 ${
            clinics.length >= 3 ? "lg:grid-cols-3" : "lg:max-w-4xl"
          }`}
        >
          {clinics.map((clinic, i) => (
            <Reveal as="li" key={clinic.id} delay={i * 120} className="h-full">
              <article className="group flex h-full flex-col overflow-hidden rounded-[14px] border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_18px_34px_-20px_rgba(10,37,64,0.3)]">
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={clinic.image}
                    alt={clinic.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 92vw, 46vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[13px] font-semibold text-navy backdrop-blur">
                    <MapPin className="h-3.5 w-3.5 text-coral" aria-hidden="true" />
                    {clinic.shortName}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5 sm:p-7">
                  <h3 className="text-[18px] font-bold leading-snug text-navy">
                    {clinic.name}
                  </h3>

                  <ul className="mt-4 flex-1 space-y-2.5 text-[15px]">
                    <li className="flex items-start gap-2.5 leading-relaxed text-muted">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-coral" aria-hidden="true" />
                      {clinic.address}
                    </li>
                    <li>
                      <a
                        href={`tel:${clinic.phone}`}
                        className="flex items-center gap-2.5 font-semibold text-navy transition-colors hover:text-brand"
                      >
                        <Phone className="h-4 w-4 shrink-0 text-coral" aria-hidden="true" />
                        {clinic.phoneDisplay}
                      </a>
                    </li>
                    <li className="flex items-center gap-2.5 text-muted">
                      <Clock className="h-4 w-4 shrink-0 text-coral" aria-hidden="true" />
                      {clinic.hours}
                    </li>
                  </ul>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <a
                      href={clinic.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-line px-4 text-[14.5px] font-semibold text-navy transition-colors hover:border-brand-200 hover:bg-brand-50"
                    >
                      <Navigation className="h-4 w-4 text-coral" aria-hidden="true" />
                      Get Directions
                    </a>
                    <Link
                      href={`/contact?clinic=${clinic.id}`}
                      data-book-appointment
                      className="inline-flex h-11 items-center rounded-xl bg-deep px-4 text-[14.5px] font-semibold text-white transition-colors hover:bg-deep-600"
                    >
                      Book Appointment
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
        
      </Container>
    </section>
  );
}
