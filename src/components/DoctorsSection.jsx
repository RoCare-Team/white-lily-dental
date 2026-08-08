import Container from "./Container";
import SectionHeading from "./SectionHeading";
import DoctorCard from "./DoctorCard";
import Reveal from "./Reveal";
import { doctors } from "@/data/doctors";

export default function DoctorsSection({
  eyebrow = "Our Specialists",
  title = "Meet Our Doctors",
  subtitle = "Every treatment at White Lily Dental is planned and performed by an MDS-qualified specialist in that field.",
  className = "",
}) {
  return (
    <section className={`wl-section ${className}`} aria-labelledby="doctors-heading">
      <Container>
        <Reveal>
          <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />
        </Reveal>

        <ul className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor, i) => (
            <Reveal as="li" key={doctor.slug} delay={i * 110} className="h-full">
              <DoctorCard doctor={doctor} />
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
