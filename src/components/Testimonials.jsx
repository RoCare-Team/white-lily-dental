import { Quote, Star, ArrowUpRight } from "lucide-react";

import Container from "./Container";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { getSettings, getTestimonials } from "@/lib/content";

/* Same molecular texture as the hero, so the two dark bands feel related */
const PATTERN = {
  backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 1.2px, transparent 1.2px)",
  backgroundSize: "26px 26px",
  opacity: 0.05,
};

function Stars({ rating, className = "" }) {
  return (
    <div
      className={`flex items-center gap-0.5 ${className}`}
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? "fill-amber-400 text-amber-400" : "text-white/25"
          }`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

/**
 * Reviewer photo, falling back to their initial.
 *
 * A plain <img> rather than next/image: reviewer photos are pasted in from
 * wherever the review lives (Google, a phone), so the host is not known ahead
 * of time and could not be allow-listed. At 40px the optimiser saves nothing.
 */
function Avatar({ review }) {
  const initial = (review.initial || review.name || "?").trim().charAt(0).toUpperCase();

  // The ring sits on both variants, so a card with a photo and one without are
  // the same size and weight.
  const ring = "h-20 w-20 shrink-0 rounded-full ring-3 ring-coral/70 ring-offset-4 ring-offset-transparent";

  if (review.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={review.image}
        alt={`${review.name}, patient of White Lily Dental`}
        width={80}
        height={80}
        loading="lazy"
        className={`${ring} object-cover`}
      />
    );
  }

  return (
    <span
      className={`${ring} inline-flex items-center justify-center bg-coral text-[26px] font-bold text-white`}
    >
      {initial}
    </span>
  );
}

export default async function Testimonials() {
  const [testimonials, site] = await Promise.all([getTestimonials(), getSettings()]);
  /* Three reviews only — this section is a proof point, not a reading list */
  const featured = testimonials.slice(0, 3);

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-deep"
      aria-labelledby="reviews-heading"
    >
      <div aria-hidden="true" className="absolute inset-0" style={PATTERN} />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-brand/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 right-0 h-72 w-72 rounded-full bg-coral/12 blur-3xl"
      />

      <Container className="relative wl-section">
        <Reveal>
          <SectionHeading
            light
            eyebrow="Patient Reviews"
            title="What Our Patients Say"
            subtitle="Verified reviews from patients treated at our Gurugram clinics."
          />
        </Reveal>

        {/* Mobile: horizontal slider · Desktop: 3-up grid */}
        <ul className="no-scrollbar mt-8 -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 md:mt-10 lg:grid-cols-3">
          {featured.map((review, i) => (
            <Reveal
              as="li"
              key={review.name}
              delay={i * 100}
              className="w-[84vw] max-w-90 shrink-0 snap-start sm:w-auto sm:max-w-none"
            >
              <article className="relative flex h-full flex-col items-center rounded-[16px] border border-white/12 bg-white/[0.06] px-6 pb-6 pt-9 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.09]">
                <Quote
                  className="pointer-events-none absolute right-4 top-4 h-7 w-7 text-white/12"
                  aria-hidden="true"
                />

                <Avatar review={review} />

                <h3 className="mt-6 text-[15.5px] font-bold uppercase tracking-[0.06em] text-white">
                  {review.name}
                </h3>

                <Stars className="mt-3 justify-center" rating={review.rating} />

                <p className="mt-3 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-brand-100/70">
                  {review.source}
                </p>

                <p className="mt-4 line-clamp-5 flex-1 text-[15px] leading-[1.65] text-white/80">
                  {review.text}
                </p>
              </article>
            </Reveal>
          ))}
        </ul>

        <div className="mt-9 text-center">
          <a
            href={site.googleReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-[11px] border border-white/40 px-6 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10"
          >
            View All Google Reviews
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </Container>
    </section>
  );
}
