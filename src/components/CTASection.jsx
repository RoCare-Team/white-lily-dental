import { CalendarCheck, Phone } from "lucide-react";

import Container from "./Container";
import Button from "./Button";
import { site, telHref } from "@/data/site";

export default function CTASection({
  title = "Ready to Take the First Step Towards a Healthier Smile?",
  subtitle = "Book a consultation at our Sector 69 or Sector 77 clinic in Gurugram. You’ll get a proper examination, a clear explanation of your options and an honest, itemised plan.",
  headingId = "cta-heading",
}) {
  return (
    <section className="relative overflow-hidden bg-navy" aria-labelledby={headingId}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-coral/15 blur-3xl" />
      </div>

      <Container className="relative flex flex-col items-center gap-5 py-12 text-center md:py-14">
        <h2
          id={headingId}
          className="max-w-3xl text-[28px] font-bold leading-[1.15] text-white sm:text-[32px] lg:text-[38px]"
        >
          {title}
        </h2>

        <p className="max-w-150 text-[16px] leading-[1.6] text-brand-100/80">
          {subtitle}
        </p>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button href="/contact" variant="white" size="lg">
            <CalendarCheck className="h-[18px] w-[18px]" aria-hidden="true" />
            Book Appointment
          </Button>
          <Button href={telHref} variant="coral" size="lg">
            <Phone className="h-[18px] w-[18px]" aria-hidden="true" />
            Call {site.phoneDisplay}
          </Button>
        </div>

        <p className="text-[14px] text-brand-100/60">
          Open {site.hours} · Sector 69 &amp; Sector 77, Gurugram
        </p>
      </Container>
    </section>
  );
}
