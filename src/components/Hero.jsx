import Image from "next/image";
import { ArrowRight, BadgeIndianRupee, CalendarCheck, Star } from "lucide-react";

import Container from "./Container";
import { getContactLinks, getTestimonials } from "@/lib/content";

/* Rating comes from our own review data — never hard-coded */
const averageRating = (testimonials) =>
  (
    testimonials.reduce((sum, t) => sum + Number(t.rating || 0), 0) /
    (testimonials.length || 1)
  ).toFixed(1);

const PHOTO = "/images/banner4.png";
const PHOTO_ALT =
  "Dentist examining a smiling patient in the treatment chair at White Lily Dental, Gurugram";

/* Molecular dot field — texture only, ~5% */
const PATTERN = {
  backgroundImage:
    "radial-gradient(rgba(255,255,255,0.9) 1.2px, transparent 1.2px)",
  backgroundSize: "26px 26px",
  opacity: 0.05,
};

const HEADING = { fontSize: "clamp(32px, 3vw, 44px)", lineHeight: 1.13 };

/* Both claims are made elsewhere on the site — same-day slots on the booking
   form, no-cost EMI in Why Choose Us — so nothing new is promised here. */
const chips = [
  { icon: CalendarCheck, label: "Same-day", sub: "appointments" },
  { icon: BadgeIndianRupee, label: "No-cost EMI", sub: "on treatments" },
];

export default async function Hero() {
  const [{ waHref }, testimonials] = await Promise.all([
    getContactLinks(),
    getTestimonials(),
  ]);
  const rating = averageRating(testimonials);
  return (
    /* Full-bleed banner — flush against the navbar and both screen edges */
    <section aria-labelledby="hero-heading">
      <div className="relative overflow-hidden bg-deep">
        <div aria-hidden="true" className="absolute inset-0" style={PATTERN} />

        {/* Soft light behind the photo card, so the panel is not flat */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full bg-brand/20 blur-3xl"
        />

        <Container className="relative grid grid-cols-1 items-center gap-9 py-9 lg:grid-cols-12 lg:gap-10 lg:py-12">
          {/* Copy */}
          <div className="lg:col-span-6">
            <span
              className="wl-fade-up inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3.5 py-1.5 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-coral"
              style={{ animationDelay: "60ms" }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-coral" aria-hidden="true" />
              Premium Dental Care in Gurugram
            </span>

            <h1
              id="hero-heading"
              className="wl-fade-up mt-4 font-bold text-white"
              style={{ ...HEADING, animationDelay: "140ms" }}
            >
              Advanced Dental Care
              <br />
              For Your <span className="text-coral">Healthiest Smile</span>
            </h1>

            <p
              className="wl-fade-up mt-4 max-w-lg text-[15.5px] leading-[1.7] text-white/80"
              style={{ animationDelay: "220ms" }}
            >
              Pain-free treatments, advanced technology and MDS specialists —
              across three clinics in Gurugram, open every day of the week.
            </p>

            <div
              className="wl-fade-up mt-5 flex items-center gap-2.5 text-[15px]"
              style={{ animationDelay: "300ms" }}
            >
              <span
                className="flex items-center gap-0.5"
                role="img"
                aria-label={`${rating} out of 5 stars`}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4.25 w-4.25 fill-amber-400 text-amber-400"
                    aria-hidden="true"
                  />
                ))}
              </span>
              <span className="font-semibold text-white">
                Rated {rating} on Google
              </span>
            </div>

            <div
              className="wl-fade-up mt-7 flex flex-col gap-3 sm:flex-row"
              style={{ animationDelay: "380ms" }}
            >
              <a
                href="/contact"
                className="wl-sheen inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-[15px] font-semibold text-deep transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-50"
              >
                Book Appointment
                <ArrowRight className="h-4.5 w-4.5" aria-hidden="true" />
              </a>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border-2 border-white/70 px-6 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white/12"
              >
                WhatsApp Now
                <ArrowRight className="h-4.5 w-4.5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Photo card */}
          <div className="lg:col-span-6">
            <div
              className="wl-fade-up relative mx-auto w-full max-w-140 lg:mx-0 lg:ml-auto"
              style={{ animationDelay: "200ms", animationDuration: "0.9s" }}
            >
              <div className="relative h-80 overflow-hidden rounded-[26px] ring-1 ring-white/15 shadow-[0_40px_70px_-32px_rgba(0,0,0,0.55)] sm:h-88 lg:h-100">
                {/* object-cover scales the picture ABOVE the card width before
                   cropping, so `sizes` has to describe that larger painted
                   width — quoting the card width serves a file that then gets
                   stretched, which is what made this look soft. */}
                <Image
                  src={PHOTO}
                  alt={PHOTO_ALT}
                  fill
                  priority
                  quality={100}
                  sizes="(max-width: 1024px) 150vw, 800px"
                  className="object-cover object-center"
                />
              </div>

              {/* Floating claim chips, half off the card edges */}
              <div className="absolute -left-3 bottom-6 space-y-2.5 sm:-left-5">
                {chips.map((chip, i) => {
                  const Icon = chip.icon;
                  return (
                    <div
                      key={chip.label}
                      className="wl-fade-up flex items-center gap-2.5 rounded-2xl bg-white/95 px-3.5 py-2.5 shadow-[0_18px_34px_-20px_rgba(0,0,0,0.6)] backdrop-blur-sm"
                      style={{ animationDelay: `${480 + i * 110}ms` }}
                    >
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-coral-50 text-coral">
                        <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                      </span>
                      <span className="leading-tight">
                        <span className="block text-[13.5px] font-bold text-navy">
                          {chip.label}
                        </span>
                        <span className="block text-[11.5px] text-muted">
                          {chip.sub}
                        </span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
