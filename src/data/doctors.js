export const doctors = [
  {
    slug: "dr-deepak-tomar",
    name: "Dr. Deepak Tomar",
    qualification: "MDS – Orthodontics · Certified Implantologist",
    specialty: "Orthodontics & Implantology",
    image:
      "/images/deepak.webp",
    imageAlt: "Dr. Deepak Tomar, MDS Orthodontics and certified implantologist at White Lily Dental",
    bio: "Dr. Deepak Tomar leads the orthodontic and implant practice at White Lily Dental. He plans and delivers braces, clear aligner and full-mouth implant treatment, with a focus on predictable, comfortable outcomes and clear communication at every stage.",
    focus: [
      "Metal, ceramic and self-ligating braces",
      "Clear aligner treatment planning",
      "Single tooth and full-arch dental implants",
      "Complex bite and alignment correction",
    ],
    services: ["braces-treatment", "dental-implants"],
  },
  {
    slug: "dr-meenakshi-singh",
    name: "Dr. Meenakshi Singh",
    qualification: "MDS – Prosthodontics",
    specialty: "Prosthodontics & Smile Design",
    image:
      "/images/meenakshi.webp",
    imageAlt: "Dr. Meenakshi Singh, MDS Prosthodontics at White Lily Dental",
    bio: "Dr. Meenakshi Singh restores form, function and appearance for patients who have lost or damaged teeth. Her work covers crowns, bridges, veneers, complete and partial dentures, and implant-supported prosthetics designed to look natural.",
    focus: [
      "Zirconia and ceramic crowns and bridges",
      "Complete, partial and implant-supported dentures",
      "Veneers and smile design",
      "Full-mouth rehabilitation",
    ],
    services: ["crowns-and-bridges", "dentures", "cosmetic-dentistry"],
  },
  {
    slug: "dr-lakshay-gupta",
    name: "Dr. Lakshay Gupta",
    qualification: "MDS – Oral & Maxillofacial Surgery",
    specialty: "Oral & Maxillofacial Surgery",
    image:
      "/images/lakshay-gupta.webp",
    imageAlt: "Dr. Lakshay Gupta, MDS Oral and Maxillofacial Surgery at White Lily Dental",
    bio: "Dr. Lakshay Gupta handles surgical dentistry at White Lily Dental, including impacted wisdom tooth removal, surgical extractions and pre-prosthetic surgery. Patients consistently describe his procedures as calm, quick and comfortable.",
    focus: [
      "Impacted and surgical wisdom tooth removal",
      "Simple and surgical extractions",
      "Minor oral surgical procedures",
      "Pre-implant and pre-prosthetic surgery",
    ],
    services: ["wisdom-tooth-removal", "simple-tooth-removal"],
  },
];

export function getDoctor(slug) {
  return doctors.find((d) => d.slug === slug);
}
