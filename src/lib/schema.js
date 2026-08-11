import { site as staticSite } from "@/data/site";
import { clinics as staticClinics } from "@/data/clinics";

/**
 * Structured data builders.
 *
 * Each takes the live site settings so edits made in the admin panel reach
 * search engines too; they fall back to the built-in values when a caller has
 * not loaded settings yet.
 */
export function dentistSchema(site = staticSite, clinics = staticClinics) {
  return {
    "@context": "https://schema.org",
    "@type": "Dentist",
    "@id": `${site.url}/#organization`,
    name: site.name,
    description: site.intro,
    url: site.url,
    telephone: site.phone,
    email: site.email,
    priceRange: "₹₹",
    areaServed: [
      { "@type": "City", name: "Gurugram" },
      { "@type": "City", name: "Gurgaon" },
    ],
    medicalSpecialty: "Dentistry",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "11:00",
        closes: "19:30",
      },
    ],
    location: clinics.map((clinic) => ({
      "@type": "DentalClinic",
      name: clinic.name,
      telephone: clinic.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: clinic.address,
        addressLocality: "Gurugram",
        addressRegion: "Haryana",
        addressCountry: "IN",
      },
    })),
  };
}

export function breadcrumbSchema(items, site = staticSite) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${site.url}${item.href}`,
    })),
  };
}

export function faqSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
}

export function serviceSchema(service, site = staticSite) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: service.title,
    description: service.seoDescription,
    url: `${site.url}/services/${service.slug}`,
    procedureType: "https://schema.org/TherapeuticProcedure",
    bodyLocation: "Mouth",
    provider: {
      "@type": "Dentist",
      "@id": `${site.url}/#organization`,
      name: site.name,
      telephone: site.phone,
    },
  };
}
