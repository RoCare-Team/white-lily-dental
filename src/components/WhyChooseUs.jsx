import Image from "next/image";
import {
  BadgeIndianRupee,
  Headset,
  Microscope,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

const reasons = [
  { icon: Stethoscope, title: "Experienced and Knowledgeable MDS Dentists" },
  { icon: Microscope, title: "Latest Technology Dental Equipment" },
  { icon: ShieldCheck, title: "Strict Sterilisation and Friendly Staff" },
  { icon: BadgeIndianRupee, title: "No Cost EMI (Finance) Payment Option" },
  { icon: Headset, title: "Dedicated Patient Counsellor — Post Treatment" },
];

export default function WhyChooseUs() {
  return (
    <section id="why-us" aria-labelledby="why-heading">
      {/* Centred rule heading */}
      <div className="wl-container pb-7 pt-11 md:pb-8 md:pt-14">
        <div className="flex items-center justify-center gap-4 sm:gap-6">
          <span className="h-px w-10 bg-line sm:w-20" aria-hidden="true" />
          <h2
            id="why-heading"
            className="text-center text-[26px] font-bold uppercase tracking-[0.08em] text-navy sm:text-[30px]"
          >
            Why Choose Us
          </h2>
          <span className="h-px w-10 bg-line sm:w-20" aria-hidden="true" />
        </div>
      </div>

      {/* Full-bleed split: tinted list panel + photo */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="flex bg-brand-50 lg:justify-end">
          <div className="w-full max-w-155 px-4 py-9 sm:px-6 md:py-11 lg:pl-6 lg:pr-12">
            <ul className="space-y-5">
              {reasons.map((reason) => {
                const Icon = reason.icon;
                return (
                  <li key={reason.title} className="flex items-center gap-4">
                    <Icon
                      className="h-7 w-7 shrink-0 text-brand"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    <span className="text-[16.5px] font-medium leading-snug text-navy">
                      {reason.title}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="relative min-h-70 lg:min-h-0">
          <Image
            src="https://images.unsplash.com/photo-1667133295352-ef4c83620e8e?auto=format&fit=crop&w=1400&q=80"
            alt="Patient smiling during a dental check-up at White Lily Dental in Gurugram"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
