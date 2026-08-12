import Image from "next/image";
import { CalendarCheck, Phone, Check } from "lucide-react";

import Container from "./Container";
import Reveal from "./Reveal";
import Button from "./Button";
import { getContactLinks } from "@/lib/content";

const points = [
  "Full examination and digital X-rays",
  "Written plan with itemised costs",
  "In-house specialists, one location",
  "Same-day appointments often available",
];

export default async function NewPatients() {
  const { telHref } = await getContactLinks();
  return (
    <section className="wl-section-sm" aria-labelledby="new-patients-heading">
      <Container>
        <Reveal variant="scale" className="overflow-hidden rounded-[16px] border border-line bg-brand-50/50">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image — capped so it never stretches the section */}
            <div className="relative h-56 sm:h-72 lg:h-auto lg:min-h-90">
              <Image
                src="https://images.unsplash.com/photo-1497486443155-158cceb6629a?auto=format&fit=crop&w=1200&q=80"
                alt="Family smiling together after a dental check-up at White Lily Dental Gurugram"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div className="p-6 sm:p-8 lg:p-10">
              <span className="wl-eyebrow">
                <span className="h-px w-6 bg-coral/50" aria-hidden="true" />
                New Patients
              </span>

              <h2
                id="new-patients-heading"
                className="mt-2.5 text-[28px] font-bold leading-[1.15] text-navy sm:text-[32px]"
              >
                Welcoming New Patients
              </h2>

              <p className="mt-3 max-w-150 text-[16px] leading-[1.6] text-muted">
                Modern treatment, experienced MDS specialists and advanced
                technology under one roof. Your first visit starts with a proper
                diagnosis — never a sales pitch.
              </p>

              <ul className="mt-5 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
                {points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-coral-50 text-coral">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
                    </span>
                    <span className="text-[15.5px] leading-snug text-navy/85">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button href="/contact" size="md" data-book-appointment>
                  <CalendarCheck className="h-[18px] w-[18px]" aria-hidden="true" />
                  Book Appointment
                </Button>
                <Button href={telHref} variant="coral" size="md">
                  <Phone className="h-[18px] w-[18px]" aria-hidden="true" />
                  Call Clinic
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
