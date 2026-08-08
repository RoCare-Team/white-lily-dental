"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarCheck, MessageCircle, Phone } from "lucide-react";

import { site, telHref, waHref } from "@/data/site";

export default function StickyContactBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Desktop: compact floating pill — 720px max, 60px tall */}
      <div
        className={`fixed bottom-6 left-1/2 z-40 hidden w-full max-w-180 -translate-x-1/2 px-6 transition-all duration-300 md:block ${
          visible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-5 opacity-0"
        }`}
      >
        <div className="flex h-15 items-center justify-between gap-2 rounded-[14px] border border-line bg-white/95 pl-5 pr-2 shadow-[0_14px_36px_-18px_rgba(10,37,64,0.4)] backdrop-blur-lg">
          <span className="flex items-center gap-2 text-[14px] font-medium text-muted">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-coral" />
            </span>
            Open Today
          </span>

          <span className="flex items-center gap-2">
            <a
              href={telHref}
              className="inline-flex h-11 items-center gap-2 rounded-[11px] border border-line px-4 text-[14.5px] font-semibold text-navy transition-colors hover:bg-brand-50"
            >
              <Phone className="h-4 w-4 text-coral" aria-hidden="true" />
              {site.phoneDisplay}
            </a>

            <Link
              href="/contact"
              className="inline-flex h-11 items-center gap-2 rounded-[11px] bg-deep px-5 text-[14.5px] font-semibold text-white transition-colors hover:bg-deep-600"
            >
              <CalendarCheck className="h-4 w-4" aria-hidden="true" />
              Book Appointment
            </Link>

            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with White Lily Dental on WhatsApp"
              className="inline-flex h-11 w-11 items-center justify-center rounded-[11px] bg-whatsapp text-white transition-transform hover:scale-105"
            >
              <MessageCircle className="h-[18px] w-[18px]" aria-hidden="true" />
            </a>
          </span>
        </div>
      </div>

      {/* Mobile: Call · WhatsApp · Book only — no opening hours */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/97 pb-[env(safe-area-inset-bottom)] shadow-[0_-6px_24px_-16px_rgba(10,37,64,0.4)] backdrop-blur-lg md:hidden">
        <div className="grid grid-cols-3">
          <a
            href={telHref}
            className="flex flex-col items-center justify-center gap-1 py-2.5 text-[13px] font-semibold text-navy active:bg-brand-50"
          >
            <Phone className="h-5 w-5 text-coral" aria-hidden="true" />
            Call
          </a>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-1 border-x border-line py-2.5 text-[13px] font-semibold text-navy active:bg-brand-50"
          >
            <MessageCircle className="h-5 w-5 text-whatsapp" aria-hidden="true" />
            WhatsApp
          </a>
          <Link
            href="/contact"
            className="flex flex-col items-center justify-center gap-1 bg-deep py-2.5 text-[13px] font-semibold text-white active:bg-deep-600"
          >
            <CalendarCheck className="h-5 w-5" aria-hidden="true" />
            Book
          </Link>
        </div>
      </div>
    </>
  );
}
