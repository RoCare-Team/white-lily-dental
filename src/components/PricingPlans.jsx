import Link from "next/link";
import { Check, Sparkles } from "lucide-react";

import Container from "./Container";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { getPlans } from "@/lib/content";

export default async function PricingPlans({ className = "" }) {
  const plans = await getPlans();
  return (
    <section className={`wl-section ${className}`} aria-labelledby="plans-heading">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Dental Plans"
          title="Affordable Annual Dental Plans"
            subtitle="Prepaid family cover for consultations, X-rays and cleaning at all three clinics."
          />
        </Reveal>

        <ul className="mx-auto mt-8 grid max-w-260 grid-cols-1 gap-5 md:mt-10 md:grid-cols-3">
          {plans.map((plan) => (
            <Reveal as="li" key={plan.id} delay={plan.popular ? 0 : 120} variant="scale" className="h-full">
              <article
                className={`relative flex h-full flex-col rounded-[14px] border p-5 transition-all duration-300 ${
                  plan.popular
                    ? "border-brand bg-navy text-white shadow-[0_22px_44px_-26px_rgba(10,37,64,0.55)] md:-translate-y-2"
                    : "border-line bg-white hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_18px_34px_-20px_rgba(10,37,64,0.3)]"
                }`}
              >
                {plan.popular ? (
                  <span className="absolute -top-3 left-6 inline-flex items-center gap-1.5 rounded-full bg-coral px-3 py-1 text-[12px] font-bold uppercase tracking-wider text-white">
                    <Sparkles className="h-3 w-3" aria-hidden="true" />
                    Most Popular
                  </span>
                ) : null}

                <h3
                  className={`text-[19px] font-bold ${
                    plan.popular ? "text-white" : "text-navy"
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`mt-1 text-[14.5px] ${
                    plan.popular ? "text-brand-100/75" : "text-muted"
                  }`}
                >
                  {plan.subtitle}
                </p>

                <p className="mt-5 flex items-end gap-1.5">
                  <span
                    className={`text-[34px] font-bold leading-none ${
                      plan.popular ? "text-white" : "text-navy"
                    }`}
                  >
                    ₹{plan.price}
                  </span>
                  <span
                    className={`pb-1 text-[14.5px] font-medium ${
                      plan.popular ? "text-brand-100/75" : "text-muted"
                    }`}
                  >
                    {plan.period}
                  </span>
                </p>

                {/* Four benefits maximum — the plan detail page carries the rest */}
                <ul
                  className={`mt-5 flex-1 space-y-2.5 border-t pt-5 ${
                    plan.popular ? "border-white/12" : "border-line"
                  }`}
                >
                  {plan.features.slice(0, 4).map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <span
                        className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${
                          plan.popular
                            ? "bg-coral/20 text-coral"
                            : "bg-coral-50 text-coral"
                        }`}
                      >
                        <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
                      </span>
                      <span
                        className={`text-[15px] leading-snug ${
                          plan.popular ? "text-brand-100/90" : "text-navy/80"
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/contact?plan=${plan.id}`}
                  className={`mt-6 inline-flex h-12 items-center justify-center rounded-[11px] text-[15px] font-semibold transition-all duration-300 hover:-translate-y-0.5 ${
                    plan.popular
                      ? "bg-white text-navy hover:bg-brand-50"
                      : "bg-deep text-white hover:bg-deep-600"
                  }`}
                >
                  Choose Plan
                </Link>
              </article>
            </Reveal>
          ))}
        </ul>

        <p className="mt-6 text-center text-[14px] text-muted">
          Valid for one year at all three Gurugram clinics.
          Treatment costs are billed separately.
        </p>
      </Container>
    </section>
  );
}
