import { Quote, Star, ArrowUpRight } from "lucide-react";

import Container from "./Container";
import SectionHeading from "./SectionHeading";
import { testimonials } from "@/data/testimonials";
import { site } from "@/data/site";

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
            i < rating ? "fill-amber-400 text-amber-400" : "text-line"
          }`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  /* Three reviews only — this section is a proof point, not a reading list */
  const featured = testimonials.slice(0, 3);

  return (
    <section id="testimonials" className="wl-section bg-brand-50/40" aria-labelledby="reviews-heading">
      <Container>
        <SectionHeading
          eyebrow="Patient Reviews"
          title="What Our Patients Say"
          subtitle="Verified reviews from patients treated at our Gurugram clinics."
        />

        {/* Mobile: horizontal slider · Desktop: 3-up grid */}
        <ul className="no-scrollbar mt-8 -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 md:mt-9 lg:grid-cols-3">
          {featured.map((review) => (
            <li
              key={review.name}
              className="w-[84vw] max-w-90 shrink-0 snap-start sm:w-auto sm:max-w-none"
            >
              <article className="flex h-full flex-col rounded-[14px] border border-line bg-white p-6">
                <div className="flex items-start justify-between">
                  <Stars rating={review.rating} />
                  <Quote className="h-6 w-6 text-coral-100" aria-hidden="true" />
                </div>

                <p className="mt-4 line-clamp-4 flex-1 text-[15.5px] leading-[1.6] text-muted">
                  {review.text}
                </p>

                <div className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand text-[15px] font-bold text-white">
                    {review.initial}
                  </span>
                  <span>
                    <span className="block text-[15px] font-semibold text-navy">
                      {review.name}
                    </span>
                    <span className="block text-[13.5px] text-muted">
                      {review.source}
                    </span>
                  </span>
                </div>
              </article>
            </li>
          ))}
        </ul>

        <div className="mt-8 text-center">
          <a
            href={site.googleReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-[11px] border border-line bg-white px-6 text-[15px] font-semibold text-navy transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:bg-brand-50"
          >
            View All Google Reviews
            <ArrowUpRight className="h-4 w-4 text-coral" aria-hidden="true" />
          </a>
        </div>
      </Container>
    </section>
  );
}
