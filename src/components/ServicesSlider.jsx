"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import Container from "./Container";
import SectionHeading from "./SectionHeading";
import ServiceCard from "./ServiceCard";
import Reveal from "./Reveal";
import { services } from "@/data/services";

/**
 * All treatments on one row, scrolled horizontally.
 * Native scroll-snap does the work, so swipe/trackpad gestures are free;
 * the arrows are an extra affordance for mouse users.
 */
export default function ServicesSlider({
  eyebrow = "Our Services",
  title = "Complete Dental Care Under One Roof",
  subtitle = "Specialist dental treatments for every stage of your smile.",
  items = services,
  className = "",
}) {
  const trackRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      el.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [sync]);

  const step = (direction) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("li");
    const amount = card ? card.getBoundingClientRect().width + 16 : 280;
    el.scrollBy({ left: direction * amount * 2, behavior: "smooth" });
  };

  const arrow =
    "inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-navy transition-all duration-300 hover:border-brand-200 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-line disabled:hover:bg-white";

  return (
    <section className={`wl-section ${className}`} aria-labelledby="services-heading">
      <Container>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow={eyebrow}
              title={title}
              subtitle={subtitle}
            />
          </Reveal>

          <Reveal delay={80} className="flex shrink-0 items-center gap-2.5">
            <Link
              href="/services"
              className="mr-1 hidden text-[14.5px] font-semibold text-coral hover:text-coral-dark sm:inline"
            >
              View all
            </Link>
            <button
              type="button"
              onClick={() => step(-1)}
              disabled={atStart}
              aria-label="Previous treatments"
              className={arrow}
            >
              <ArrowLeft className="h-[18px] w-[18px]" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              disabled={atEnd}
              aria-label="Next treatments"
              className={arrow}
            >
              <ArrowRight className="h-[18px] w-[18px]" aria-hidden="true" />
            </button>
          </Reveal>
        </div>

        {/* the track bleeds to the screen edges so cards run off-screen */}
        <ul
          ref={trackRef}
          className="no-scrollbar -mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth scroll-pl-4 px-4 pb-2 sm:-mx-6 sm:scroll-pl-6 sm:px-6"
        >
          {items.map((service) => (
            <li
              key={service.slug}
              className="w-64 shrink-0 snap-start sm:w-68"
            >
              <ServiceCard service={service} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
