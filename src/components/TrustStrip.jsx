import { Award, CalendarClock, MapPin, Stethoscope } from "lucide-react";

import Container from "./Container";
import Reveal from "./Reveal";
import { site } from "@/data/site";
import { clinics } from "@/data/clinics";
import { doctors } from "@/data/doctors";

/* Every figure is read from project data, never hard-coded */
const items = [
  {
    icon: Award,
    value: site.yearsExperience,
    label: "Years of practice",
  },
  {
    icon: Stethoscope,
    value: `${doctors.length} MDS`,
    label: "Specialist dentists",
  },
  {
    icon: MapPin,
    value: `${clinics.length} Clinics`,
    label: "Across Gurugram",
  },
  {
    icon: CalendarClock,
    value: "7 Days",
    label: "Open every week",
  },
];

export default function TrustStrip() {
  return (
    <section className="border-b border-line bg-white" aria-label="Why patients trust us">
      <Container>
        <ul className="grid grid-cols-2 divide-line lg:grid-cols-4 lg:divide-x">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal
                as="li"
                key={item.label}
                delay={i * 80}
                variant="fade"
                className="flex items-center gap-3.5 px-1 py-6 lg:justify-center lg:px-6"
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-deep">
                  <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-[19px] font-bold leading-none text-navy">
                    {item.value}
                  </span>
                  <span className="mt-1 block text-[14px] text-muted">{item.label}</span>
                </span>
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
