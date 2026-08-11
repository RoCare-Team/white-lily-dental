import Container from "./Container";
import SectionHeading from "./SectionHeading";
import ServiceCard from "./ServiceCard";
import Reveal from "./Reveal";
import { getServices } from "@/lib/content";

export default async function ServicesGrid({
  eyebrow = "Our Services",
  title = "Complete Dental Care Under One Roof",
  subtitle = "Specialist dental treatments for every stage of your smile.",
  items,
  className = "",
}) {
  const list = items ?? (await getServices());
  return (
    <section className={`wl-section ${className}`} aria-labelledby="services-heading">
      <Container>
        <Reveal>
          <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />
        </Reveal>

        {/* Separate cards, 2 → 3 → 5 per row */}
        <ul className="mt-8 grid grid-cols-2 gap-3 md:mt-9 md:grid-cols-3 md:gap-4 xl:grid-cols-5">
          {list.map((service, i) => (
            <Reveal
              as="li"
              key={service.slug}
              delay={(i % 5) * 70}
              variant="scale"
              className="h-full"
            >
              <ServiceCard service={service} variant="grid" />
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
