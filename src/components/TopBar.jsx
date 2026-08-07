import { Clock, Facebook, Instagram, Mail, Phone } from "lucide-react";

import { site, telHref } from "@/data/site";

const socialIcons = { Instagram, Facebook };

export default function TopBar() {
  const socials = site.socials.filter((s) => socialIcons[s.label]);

  return (
    <div className="bg-deep text-white">
      <div className="mx-auto flex h-10 w-full max-w-300 items-center justify-between px-4 text-[14px] font-medium sm:px-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <a
            href={telHref}
            className="inline-flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <Phone className="h-4 w-4 shrink-0 text-coral" aria-hidden="true" />
            {site.phoneDisplay}
          </a>

          <span className="hidden h-4 w-px bg-white/25 sm:block" aria-hidden="true" />

          <a
            href={`mailto:${site.email}`}
            className="hidden items-center gap-2 transition-opacity hover:opacity-80 sm:inline-flex"
          >
            <Mail className="h-4 w-4 shrink-0 text-coral" aria-hidden="true" />
            {site.email}
          </a>

          <span className="hidden h-4 w-px bg-white/25 lg:block" aria-hidden="true" />

          <span className="hidden items-center gap-2 lg:inline-flex">
            <Clock className="h-4 w-4 shrink-0 text-coral" aria-hidden="true" />
            {site.hours}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {socials.map((social) => {
            const Icon = socialIcons[social.label];
            return (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`White Lily Dental on ${social.label}`}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-white/12"
              >
                <Icon className="h-[17px] w-[17px]" aria-hidden="true" />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
