"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

import Container from "./Container";
import SectionHeading from "./SectionHeading";

export default function FAQ({
  eyebrow = "FAQ",
  title = "Frequently Asked Questions",
  subtitle = "Answers to the questions our Gurugram patients ask most often. Can’t find yours? Call us and we’ll be glad to help.",
  items = [],
  className = "",
  headingId = "faq-heading",
}) {
  const [openIndex, setOpenIndex] = useState(0);

  if (!items.length) return null;

  return (
    <section className={`wl-section ${className}`} aria-labelledby={headingId}>
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />

        <div className="mx-auto mt-8 max-w-3xl divide-y divide-line overflow-hidden rounded-[14px] border border-line bg-white">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.q}>
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${index}`}
                    id={`faq-button-${index}`}
                    className={`flex w-full items-center justify-between gap-4 px-5 py-4.5 text-left transition-colors sm:px-6 ${
                      isOpen ? "bg-brand-50/60" : "hover:bg-brand-50/40"
                    }`}
                  >
                    <span className="text-[16px] font-semibold leading-snug text-navy sm:text-[17px]">
                      {item.q}
                    </span>
                    <span
                      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                        isOpen
                          ? "border-coral bg-coral text-white"
                          : "border-line bg-white text-coral"
                      }`}
                      aria-hidden="true"
                    >
                      {isOpen ? (
                        <Minus className="h-4 w-4" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </span>
                  </button>
                </h3>

                <div
                  id={`faq-panel-${index}`}
                  role="region"
                  aria-labelledby={`faq-button-${index}`}
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-[15.5px] leading-[1.6] text-muted sm:px-6">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
