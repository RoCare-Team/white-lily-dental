import Reveal from "./Reveal";

/**
 * Renders the service copy exactly as it is ordered on the live site:
 * an H2/H3/H4 heading followed by its paragraphs and bullets.
 * Headings that only repeat the page title (no copy of their own) are skipped.
 *
 * Layout is left to the caller — the service pages put this in the wide
 * column beside the enquiry sidebar.
 */
export default function ServiceBody({ tagline, sections = [] }) {
  const blocks = sections.filter(
    (s) => (s.body && s.body.length) || (s.list && s.list.length)
  );

  if (!blocks.length && !tagline) return null;

  return (
    <div>
      {tagline ? (
        <Reveal>
          <p className="border-l-4 border-coral pl-5 text-[19px] font-semibold leading-snug text-navy sm:text-[22px]">
            {tagline}
          </p>
        </Reveal>
      ) : null}

      {blocks.map((section, i) => {
        const Heading = section.level === "h3" || section.level === "h4" ? "h3" : "h2";
        const isSub = Heading === "h3";

        return (
          <Reveal
            key={section.heading || i}
            className={i === 0 && !tagline ? "" : "mt-9"}
          >
            {section.heading ? (
              <Heading
                className={
                  isSub
                    ? "text-[19px] font-bold leading-snug text-navy sm:text-[21px]"
                    : "text-[23px] font-bold leading-snug text-navy sm:text-[27px]"
                }
              >
                {section.heading}
              </Heading>
            ) : null}

            {section.body?.length ? (
              <div className={`wl-prose ${section.heading ? "mt-3" : ""}`}>
                {section.body.map((p) => (
                  <p key={p.slice(0, 48)}>{p}</p>
                ))}
              </div>
            ) : null}

            {section.list?.length ? (
              <ul className="mt-4 space-y-2.5">
                {section.list.map((item) => (
                  <li key={item.slice(0, 48)} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-coral"
                    />
                    <span className="text-[16px] leading-[1.6] text-muted">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </Reveal>
        );
      })}
    </div>
  );
}
