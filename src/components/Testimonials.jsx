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

function Stars({ rating }) {
  return (
    <div
      className="flex items-center gap-0.5"
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
              <article className="flex h-full flex-col rounded-[16px] border border-white/12 bg-white/[0.06] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.09]">
                <div className="flex items-start justify-between">
                  <Stars rating={review.rating} />
                  <Quote className="h-7 w-7 text-white/20" aria-hidden="true" />
                </div>

                <p className="mt-4 line-clamp-4 flex-1 text-[15.5px] leading-[1.65] text-white/85">
                  {review.text}
                </p>

                <div className="mt-5 flex items-center gap-3 border-t border-white/12 pt-4">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-coral text-[15px] font-bold text-white">
                    {review.initial}
                  </span>
                  <span>
                    <span className="block text-[15px] font-semibold text-white">
                      {review.name}
                    </span>
                    <span className="block text-[13.5px] text-brand-100/70">
                      {review.source}
                    </span>
                  </span>
                </div>
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
