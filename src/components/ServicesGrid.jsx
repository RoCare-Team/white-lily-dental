import Container from "./Container";
import SectionHeading from "./SectionHeading";
import ServiceCard from "./ServiceCard";
import { services } from "@/data/services";

export default function ServicesGrid({
  eyebrow = "Our Services",
  title = "Complete Dental Care Under One Roof",
  subtitle = "Specialist dental treatments for every stage of your smile.",
  items = services,
  className = "",
}) {
  return (
    <section className={`wl-section ${className}`} aria-labelledby="services-heading">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />

        {/* Separate cards, 2 → 3 → 5 per row */}
        <ul className="mt-8 grid grid-cols-2 gap-3 md:mt-9 md:grid-cols-3 md:gap-4 xl:grid-cols-5">
          {items.map((service) => (
            <li key={service.slug} className="h-full">
              <ServiceCard service={service} variant="grid" />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
