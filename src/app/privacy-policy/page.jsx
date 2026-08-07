import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import { site } from "@/data/site";

export const metadata = {
  title: "Privacy Policy",
  description:
    "How White Lily Dental collects, uses and protects the personal and health information of patients at our Gurugram clinics.",
  alternates: { canonical: "/privacy-policy" },
  robots: { index: true, follow: true },
};

const sections = [
  {
    heading: "Information we collect",
    paragraphs: [
      "When you book an appointment or contact us, we collect the details you provide: your name, phone number, email address, preferred clinic and a description of your dental concern.",
      "During treatment we also record clinical information — examination findings, radiographs, treatment plans, medical history and payment records — as required to provide safe dental care.",
    ],
  },
  {
    heading: "How we use your information",
    paragraphs: [
      "We use your details to confirm and manage appointments, provide and record dental treatment, send appointment reminders and recall notices, respond to your enquiries, and meet our clinical record-keeping obligations.",
      "We do not sell your personal information, and we do not share it for advertising purposes.",
    ],
  },
  {
    heading: "Sharing your information",
    paragraphs: [
      "Clinical information is accessible to the treating dentists and clinical staff at both our Gurugram clinics so that you can be seen at either location.",
      "We may share information with a dental laboratory, imaging centre or specialist when it is necessary for your treatment, and with regulatory or legal authorities where the law requires it.",
    ],
  },
  {
    heading: "Data security and retention",
    paragraphs: [
      "Patient records are held securely, with access limited to authorised clinical and administrative staff. Digital records are password protected and physical records are stored securely at the clinic.",
      "We retain clinical records for the period required under applicable Indian medical record-keeping requirements, after which they are securely destroyed.",
    ],
  },
  {
    heading: "Website, cookies and analytics",
    paragraphs: [
      "This website may use cookies and similar technologies to keep the site working correctly and to understand how visitors use it. You can disable cookies in your browser settings; core parts of the site will continue to work.",
      "Links to third-party services such as Google Maps, WhatsApp and social media platforms are governed by those services' own privacy policies.",
    ],
  },
  {
    heading: "Your rights",
    paragraphs: [
      "You may request access to the personal information we hold about you, ask us to correct inaccurate details, or ask us to stop sending appointment reminders and marketing messages.",
      `To make a request, contact us on ${site.phoneDisplay} or email ${site.email}.`,
    ],
  },
  {
    heading: "Changes to this policy",
    paragraphs: [
      "We may update this policy from time to time to reflect changes in our practice or in applicable law. The current version is always published on this page.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        title="Privacy Policy"
        subtitle="How White Lily Dental collects, uses and protects your personal and clinical information."
        breadcrumbs={[{ name: "Privacy Policy", href: "/privacy-policy" }]}
      />

      <section className="wl-section">
        <Container>
          <div className="mx-auto max-w-3xl">
            <p className="text-[15px] leading-[1.85] text-muted">
              This policy applies to {site.name} and to both of our clinics in
              Gurugram — Sector 69 and Sector 77 — as well as to this website.
            </p>

            {sections.map((section) => (
              <section key={section.heading} className="mt-8">
                <h2 className="text-[21px] font-bold leading-snug text-navy sm:text-[24px]">
                  {section.heading}
                </h2>
                <div className="wl-prose mt-4 text-[15px]">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}

            <div className="mt-9 rounded-[16px] border border-line bg-brand-50/50 p-6">
              <h2 className="text-[18px] font-bold text-navy">Contact us</h2>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">
                Questions about this policy or about your records? Call{" "}
                <a
                  href={`tel:${site.phone}`}
                  className="font-semibold text-coral hover:text-coral-dark"
                >
                  {site.phoneDisplay}
                </a>{" "}
                or email{" "}
                <a
                  href={`mailto:${site.email}`}
                  className="font-semibold text-coral hover:text-coral-dark"
                >
                  {site.email}
                </a>
                .
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
