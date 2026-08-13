import { Suspense } from "react";
import { Clock, Mail, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";

import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import AppointmentForm from "@/components/AppointmentForm";
import FAQ from "@/components/FAQ";
import JsonLd from "@/components/JsonLd";

import {
  getClinics,
  getContactLinks,
  getDoctors,
  getPlans,
  getServices,
} from "@/lib/content";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata = {
  title: "Contact Us | Book a Dental Appointment in Gurugram",
  description:
    "Book an appointment at White Lily Dental Gurugram. Call +91 97118 11272 or visit any of our two Gurugram clinics. Open Monday to Sunday, 11 AM to 7:30 PM.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact White Lily Dental | Gurugram",
    description:
      "Call, WhatsApp or send an appointment request to White Lily Dental's Sector 69 and 77 clinics in Gurugram.",
    url: "/contact",
    type: "website",
    images: ["/images/og-image.png"],
  },
};

const contactFaqs = [
  {
    q: "How quickly will I get an appointment?",
    a: "Most patients are seen within 24 to 48 hours, and same-day slots are often available. Acute pain, swelling and dental trauma are prioritised — call us directly in those cases.",
  },
  {
    q: "What should I bring to my first visit?",
    a: "Any previous dental X-rays or reports, a list of medications you take, and details of medical conditions such as diabetes, hypertension or blood thinners. If you have none of these, just come as you are.",
  },
  {
    q: "Do you offer EMI or finance options?",
    a: "Yes. No-cost EMI is available on larger treatment plans including implants, orthodontics and full-mouth rehabilitation. Our counsellor will explain the options at your consultation.",
  },
  {
    q: "Can I get a rough cost estimate before visiting?",
    a: "We can give you an indicative range over the phone, but an accurate quote needs an examination and usually an X-ray. You receive a written, itemised plan before any treatment starts.",
  },
];

export default async function ContactPage() {
  const [clinics, services, plans, doctors, { settings: site, telHref, waHref }] =
    await Promise.all([
      getClinics(),
      getServices(),
      getPlans(),
      getDoctors(),
      getContactLinks(),
    ]);
  return (
    <>
      <PageHero
        title="Book an Appointment"
        subtitle={`Call, WhatsApp or send a request below. Our team will confirm a slot at the clinic nearest you. Open ${site.hours}.`}
        breadcrumbs={[{ name: "Contact Us", href: "/contact" }]}
      />

      <section className="wl-section" aria-labelledby="contact-heading">
        <Container className="grid grid-cols-1 gap-9 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <h2 id="contact-heading" className="sr-only">
              Appointment request form
            </h2>
            <Suspense
              fallback={
                <div className="h-[560px] rounded-[18px] border border-line bg-brand-50/40" />
              }
            >
              <AppointmentForm
                services={services}
                clinics={clinics}
                plans={plans}
                doctors={doctors}
                site={site}
                telHref={telHref}
              />
            </Suspense>
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-[18px] border border-line bg-navy p-6 text-white">
              <h2 className="text-[19px] font-bold text-white">
                Talk to us directly
              </h2>
              <p className="mt-2 text-[13.5px] leading-relaxed text-brand-100/80">
                The fastest way to book is to call or message us. We answer during
                clinic hours, all seven days.
              </p>

              <ul className="mt-6 space-y-3">
                <li>
                  <a
                    href={telHref}
                    className="flex items-center gap-3 rounded-xl border border-white/12 bg-white/5 p-4 transition-colors hover:bg-white/10"
                  >
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand text-white">
                      <Phone className="h-[18px] w-[18px]" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-[13px] uppercase tracking-wider text-brand-100/70">
                        Call us
                      </span>
                      <span className="block text-[15px] font-bold text-white">
                        {site.phoneDisplay}
                      </span>
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-white/12 bg-white/5 p-4 transition-colors hover:bg-white/10"
                  >
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-whatsapp text-white">
                      <MessageCircle className="h-[18px] w-[18px]" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-[13px] uppercase tracking-wider text-brand-100/70">
                        WhatsApp
                      </span>
                      <span className="block text-[15px] font-bold text-white">
                        Chat with the clinic
                      </span>
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${site.email}`}
                    className="flex items-center gap-3 rounded-xl border border-white/12 bg-white/5 p-4 transition-colors hover:bg-white/10"
                  >
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-brand-200">
                      <Mail className="h-[18px] w-[18px]" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[13px] uppercase tracking-wider text-brand-100/70">
                        Email
                      </span>
                      <span className="block break-all text-[13.5px] font-semibold text-white">
                        {site.email}
                      </span>
                    </span>
                  </a>
                </li>
              </ul>

              <p className="mt-6 flex items-center gap-2.5 border-t border-white/10 pt-5 text-[13px] text-brand-100/80">
                <Clock className="h-4 w-4 shrink-0 text-brand-200" aria-hidden="true" />
                {site.hours}
              </p>
            </div>

            {/* Clinic addresses */}
            <ul className="mt-5 space-y-4">
              {clinics.map((clinic) => (
                <li
                  key={clinic.id}
                  className="rounded-[16px] border border-line bg-white p-5"
                >
                  <h3 className="flex items-center gap-2 text-[15px] font-bold text-navy">
                    <MapPin className="h-4 w-4 text-brand" aria-hidden="true" />
                    {clinic.shortName}
                  </h3>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
                    {clinic.address}
                  </p>
                  <a
                    href={clinic.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-coral hover:text-coral-dark"
                  >
                    <Navigation className="h-4 w-4" aria-hidden="true" />
                    Get Directions
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        </Container>
      </section>

      <FAQ
        className="bg-brand-50/40"
        headingId="contact-faq-heading"
        eyebrow="Before You Visit"
        title="Appointment Questions"
        subtitle="What to expect when you book with White Lily Dental."
        items={contactFaqs}
      />

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Contact Us", href: "/contact" },
        ])}
      />
    </>
  );
}
