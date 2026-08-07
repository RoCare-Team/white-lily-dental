import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * variant="grid" → compact, self-contained card for the services grid (no body copy)
 * variant="card" → same card plus a short 2-line excerpt (related treatments)
 *
 * Services carrying an `iconImage` render that artwork; the rest fall back to
 * the drawn two-tone lucide badge so no card is ever left without an icon.
 */
export default function ServiceCard({ service, variant = "card" }) {
  const Icon = service.icon;
  const accent = service.accent || { bg: "#E8F0FC", fg: "#1668C7" };
  const isGrid = variant === "grid";

  return (
    <Link
      href={`/services/${service.slug}`}
      className={`group flex h-full flex-col items-center justify-center rounded-[14px] border border-line bg-white px-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_16px_30px_-18px_rgba(10,37,64,0.28)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
        isGrid ? "min-h-40 py-5 sm:min-h-45 sm:py-6" : "justify-start py-6"
      }`}
    >
      {service.iconImage ? (
        <Image
          src={service.iconImage}
          alt=""
          width={100}
          height={100}
          aria-hidden="true"
          className="h-13 w-13 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5"
        />
      ) : (
        /* Two-tone circular icon */
        <span
          className="relative inline-flex h-13 w-13 shrink-0 items-center justify-center overflow-hidden rounded-full transition-transform duration-300 group-hover:-translate-y-0.5"
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
      )}

      <h3 className="mt-3.5 text-[16.5px] font-semibold leading-snug text-navy transition-colors duration-300 group-hover:text-brand">
        {service.title}
      </h3>

      {!isGrid ? (
        <p className="mt-2 line-clamp-2 flex-1 text-[15px] leading-[1.55] text-muted">
          {service.excerpt}
        </p>
      ) : null}

      <span
        className={`inline-flex items-center gap-1.5 text-[14px] font-semibold text-coral transition-all duration-300 ${
          isGrid
            ? "mt-2 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
            : "mt-3"
        }`}
      >
        Learn More
        <ArrowRight
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </span>
    </Link>
  );
}
