import Image from "next/image";
import { ArrowRight, Star } from "lucide-react";

import { waHref } from "@/data/site";
import { testimonials } from "@/data/testimonials";

/* Rating comes from our own review data — never hard-coded */
const rating = (
  testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length
).toFixed(1);

/* Banner artwork — carries its own deep-teal background, so it sits flush
   against the panel instead of being a cutout laid over it */
const PHOTO = "/images/banner2.png";
const PHOTO_ALT =
  "Smiling patient pointing to her healthy teeth at White Lily Dental, Gurugram";

/* Molecular dot field — texture only, ~5% */
const PATTERN = {
  backgroundImage:
    "radial-gradient(rgba(255,255,255,0.9) 1.2px, transparent 1.2px)",
  backgroundSize: "26px 26px",
  opacity: 0.05,
};

const HEADING = { fontSize: "clamp(34px, 3.1vw, 46px)", lineHeight: 1.12 };

export default function Hero() {
  return (
    /* Full-bleed banner — flush against the navbar and both screen edges */
    <section aria-labelledby="hero-heading">
      {/* Panel colour is sampled from banner2.png so the artwork edge is
         invisible — the image carries its own baked-in background */}
      <div
        className="relative overflow-hidden"
        style={{ backgroundColor: "#0f4c5f" }}
      >
        <div aria-hidden="true" className="absolute inset-0" style={PATTERN} />

        {/* Patient artwork — a fixed 660px keeps the box wider than the
           artwork's 1.42 aspect at every desktop width, so she is always
           scaled by the banner height and stays flush with its bottom edge.
           A percentage width would shrink her on 1024–1366 laptops. */}
        <div
          className="wl-fade-up absolute inset-y-0 right-0 hidden lg:block"
          style={{
            width: "660px",
            animationDelay: "120ms",
            animationDuration: "0.9s",
          }}
        >
          <Image
            src={PHOTO}
            alt={PHOTO_ALT}
            fill
            priority
            quality={100}
            sizes="660px"
            className="object-contain object-bottom"
          />
        </div>

        <div className="relative lg:h-115">
          {/* Copy — held to the page container so it lines up with the navbar */}
          <div className="wl-container flex h-full flex-col justify-center">
            <div className="w-full pb-7 pt-8 lg:w-1/2 lg:max-w-142 lg:pb-0 lg:pr-8 lg:pt-0">
              <span
                className="wl-fade-up block text-[14px] font-semibold uppercase tracking-[0.15em] text-coral"
                style={{ animationDelay: "60ms" }}
              >
                Premium Dental Care in Gurugram
              </span>

              <h1
                id="hero-heading"
                className="wl-fade-up mt-3 font-bold text-white"
                style={{ ...HEADING, animationDelay: "140ms" }}
              >
                Advanced Dental Care
                <br />
                For Your <span className="text-coral">Healthiest Smile</span>
              </h1>

              <p
                className="wl-fade-up mt-4.5 text-[15.5px] font-medium text-white/85"
                style={{ animationDelay: "220ms" }}
              >
                Pain-Free Treatments&nbsp; | &nbsp;Advanced Technology&nbsp; |
                &nbsp;Specialist Dentists
              </p>

              <div
                className="wl-fade-up mt-4.5 flex items-center gap-2.5 text-[15px] text-white/85"
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
                      className="h-[17px] w-[17px] fill-amber-400 text-amber-400"
                      aria-hidden="true"
                    />
                  ))}
                </span>
                <span className="font-semibold text-white">
                  Rated {rating} on Google
                </span>
              </div>

              <div
                className="wl-fade-up mt-6 flex flex-col gap-3 sm:flex-row"
                style={{ animationDelay: "380ms" }}
              >
                <a
                  href="/contact"
                  className="wl-sheen inline-flex h-[46px] items-center justify-center gap-2 rounded-full bg-white px-6 text-[15px] font-semibold text-deep transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-50"
                >
                  Book Appointment
                  <ArrowRight
                    className="h-[18px] w-[18px]"
                    aria-hidden="true"
                  />
                </a>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-[46px] items-center justify-center gap-2 rounded-full border-2 border-white px-6 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/12"
                >
                  WhatsApp Now
                  <ArrowRight
                    className="h-[18px] w-[18px]"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Patient below the copy on mobile / tablet */}
          <div className="relative mt-6 h-70 w-full lg:hidden">
            <Image
              src={PHOTO}
              alt={PHOTO_ALT}
              fill
              priority
              quality={100}
              sizes="100vw"
              className="object-contain object-bottom"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
