export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  as: Tag = "h2",
  light = false,
  className = "",
}) {
  const isCenter = align === "center";

  return (
    <div className={`${isCenter ? "mx-auto text-center" : ""} ${className}`}>
      {eyebrow ? (
        <span className={`wl-eyebrow ${light ? "text-coral-100" : ""}`}>
          <span
            className={`h-px w-6 ${light ? "bg-coral-100/70" : "bg-coral/50"}`}
            aria-hidden="true"
          />
          {eyebrow}
        </span>
      ) : null}

      {/* eyebrow → heading: 10px */}
      <Tag
        className={`mt-2.5 text-[28px] leading-[1.15] font-bold sm:text-[32px] lg:text-[38px] ${
          light ? "text-white" : "text-navy"
        }`}
      >
        {title}
      </Tag>

      {/* heading → subtitle: 12px, paragraph capped at 640px */}
      {subtitle ? (
        <p
          className={`mt-3 max-w-160 text-[16px] leading-[1.6] ${
            isCenter ? "mx-auto" : ""
          } ${light ? "text-brand-100/80" : "text-muted"}`}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
