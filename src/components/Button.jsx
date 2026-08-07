import Link from "next/link";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[11px] font-semibold whitespace-nowrap transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-60";

const variants = {
  primary:
    "bg-brand text-white shadow-[0_10px_24px_-12px_rgba(22,104,199,0.9)] hover:bg-brand-dark hover:shadow-[0_16px_30px_-12px_rgba(15,79,156,0.75)] hover:-translate-y-0.5",
  outline:
    "border border-line bg-white text-navy hover:border-brand-200 hover:bg-brand-50 hover:-translate-y-0.5",
  coral:
    "bg-coral text-white shadow-[0_10px_24px_-12px_rgba(238,111,108,0.9)] hover:bg-coral-dark hover:shadow-[0_16px_30px_-12px_rgba(217,86,83,0.75)] hover:-translate-y-0.5",
  navy: "bg-navy text-white hover:bg-navy-600 hover:-translate-y-0.5",
  white:
    "bg-white text-navy hover:bg-brand-50 hover:-translate-y-0.5 shadow-[0_10px_24px_-14px_rgba(10,37,64,0.6)]",
  ghostLight:
    "border border-white/25 text-white hover:bg-white/10 hover:-translate-y-0.5",
  soft: "bg-brand-50 text-brand-dark border border-brand-100 hover:bg-brand-100",
};

/* One button scale across the site — md is the standard 48px control */
const sizes = {
  sm: "h-11 px-4 text-[14px]",
  md: "h-12 px-6 text-[15px]",
  lg: "h-12 px-6 text-[15px] sm:h-[52px] sm:px-7 sm:text-[16px]",
};

export default function Button({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) {
  const cls = `${base} ${variants[variant] || variants.primary} ${
    sizes[size] || sizes.md
  } ${className}`;

  if (href) {
    const external = /^(https?:|tel:|mailto:)/.test(href);
    if (external) {
      return (
        <a
          href={href}
          className={cls}
          {...(href.startsWith("http")
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          {...props}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}
