import Image from "next/image";
import {
  BadgeIndianRupee,
  Headset,
  Microscope,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

import Container from "./Container";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { site } from "@/data/site";

const reasons = [
  { icon: Stethoscope, title: "Experienced MDS Dentists" },
  { icon: Microscope, title: "Latest Dental Technology" },
  { icon: ShieldCheck, title: "Strict Sterilisation" },
  { icon: BadgeIndianRupee, title: "No Cost EMI Options" },
  { icon: Headset, title: "Dedicated Patient Counsellor" },
];

export default function WhyChooseUs() {
  return (
    <section
      id="why-us"
      className="relative isolate overflow-hidden bg-white"
      aria-labelledby="why-heading"
    >
      {/* full-bleed photograph, held right back so it reads as texture */}
      <Image
        src="https://images.unsplash.com/photo-1684607633138-6cc13613369b?auto=format&fit=crop&w=1900&q=85"
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-white/92" />

      <Container className="py-12 md:py-14">
        <Reveal>
          <SectionHeading
            eyebrow="Why Choose Us"
            title="Why Patients Choose White Lily"
            subtitle={`Specialist-led treatment, modern technology and ${site.yearsExperience} years of honest, patient-first care.`}
          />
        </Reveal>

        <ul className="mt-9 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          {reasons.map((reason, i) => {
            const Icon = reason.icon;
            return (
              <Reveal
                as="li"
                key={reason.title}
                delay={i * 80}
                variant="scale"
                className="flex flex-col items-center gap-3 rounded-[14px] border border-line bg-white px-4 py-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_16px_30px_-20px_rgba(10,37,64,0.3)]"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-deep">
                  <Icon
                    className="h-[22px] w-[22px]"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </span>
                <span className="text-[15px] font-medium leading-snug text-navy">
                  {reason.title}
                </span>
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
