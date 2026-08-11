import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { getIcon } from "@/lib/icons";

/**
 * variant="card" → full tile with a one-line excerpt (slider, related treatments)
 * variant="grid" → compact tile, title only (dense grid on /services)
 *
 * Each card carries its own accent colour: a soft wash that fades in behind the
 * mark, a circular arrow that fills on hover, and an accent-tinted lift.
 */
export default function ServiceCard({ service, variant = "card" }) {
  const Icon = getIcon(service.icon);
  const accent = service.accent || { bg: "#E8F0FC", fg: "#1668C7" };
  const isGrid = variant === "grid";

  const mark = service.iconImage ? (
    <Image
      src={service.iconImage}
      alt=""
      width={100}
      height={100}
      aria-hidden="true"
      className="relative h-14 w-14 transition-transform duration-500 group-hover:scale-[1.08]"
    />
  ) : (
    <span
      className="relative inline-flex h-14 w-14 items-center justify-center overflow-hidden rounded-full transition-transform duration-500 group-hover:scale-[1.08]"
      style={{ backgroundColor: accent.bg }}
    >
      <span
        aria-hidden="true"
        className="absolute bg-navy"
        style={{
          left: "-20%",
          right: "-20%",
          bottom: "-16%",
          height: "38%",
          borderRadius: "100%",
        }}
      />
      <Icon
        className="relative h-6 w-6 -translate-y-0.5"
        style={{ color: accent.fg }}
        strokeWidth={1.7}
        aria-hidden="true"
      />
    </span>
  );

  if (isGrid) {
    return (
      <Link
        href={`/services/${service.slug}`}
        style={{ "--accent": accent.fg, "--accent-soft": accent.bg }}
        className="group relative flex h-full min-h-48 flex-col items-center justify-center rounded-[18px] border border-line bg-white px-4 py-7 text-center transition-all duration-400 hover:-translate-y-1.5 hover:border-transparent hover:shadow-[0_24px_44px_-24px_var(--accent-soft),0_10px_22px_-14px_rgba(10,37,64,0.28)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        {mark}
        <h3 className="mt-4 text-[16.5px] font-semibold leading-snug text-navy transition-colors duration-300 group-hover:text-[var(--accent)]">
          {service.title}
        </h3>
      </Link>
    );
  }

  return (
    <Link
      href={`/services/${service.slug}`}
      style={{ "--accent": accent.fg, "--accent-soft": accent.bg }}
      className="group relative isolate flex h-full flex-col overflow-hidden rounded-[18px] border border-line bg-white p-6 transition-all duration-400 hover:-translate-y-1.5 hover:border-transparent hover:shadow-[0_26px_48px_-26px_var(--accent-soft),0_12px_24px_-16px_rgba(10,37,64,0.3)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      {/* accent wash that blooms from the top-right on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-14 -z-10 h-32 w-32 rounded-full bg-[var(--accent-soft)] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
      />

      <div className="flex items-start justify-between gap-3">
        {mark}
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-navy transition-all duration-400 group-hover:border-transparent group-hover:bg-[var(--accent)] group-hover:text-white">
          <ArrowUpRight
            className="h-[18px] w-[18px] transition-transform duration-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </span>
      </div>

      <h3 className="mt-5 text-[17.5px] font-semibold leading-snug text-navy transition-colors duration-300 group-hover:text-[var(--accent)]">
        {service.title}
      </h3>

      <p className="mt-2 line-clamp-2 text-[14.5px] leading-[1.55] text-muted">
        {service.excerpt}
      </p>
    </Link>
  );
}
