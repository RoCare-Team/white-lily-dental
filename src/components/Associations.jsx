import Container from "./Container";
import { associations } from "@/data/associations";

export default function Associations() {
  return (
    <section className="wl-section-sm border-y border-line bg-white" aria-labelledby="associations-heading">
      <Container>
        <h2
          id="associations-heading"
          className="text-center text-[13px] font-semibold uppercase tracking-[0.18em] text-muted"
        >
          Associations, Systems &amp; Brands We Work With
        </h2>

        <ul className="no-scrollbar mt-7 -mx-4 flex gap-3 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-6">
          {associations.map((item) => (
            <li
              key={item.abbr}
              className="group flex min-w-[160px] flex-1 flex-col items-center justify-center gap-1 rounded-[14px] border border-line bg-white px-4 py-6 grayscale transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:grayscale-0"
              title={item.name}
            >
              <span className="text-[18px] font-extrabold tracking-tight text-navy/55 transition-colors duration-300 group-hover:text-brand">
                {item.abbr}
              </span>
              <span className="text-center text-[14px] text-muted">
                {item.note}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
