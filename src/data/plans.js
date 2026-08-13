/**
 * FALLBACK ONLY — this is not what the website reads.
 *
 * Live content lives in MongoDB and is edited at /admin. This file is served
 * only when its collection is empty or the database is unreachable, so the
 * site never renders a blank section. Editing a value here will NOT change the
 * website; change it in the admin panel instead.
 */
export const plans = [
  {
    id: "package-1",
    name: "Package 1",
    subtitle: "Essential family cover",
    price: "899",
    period: "/ Year",
    description:
      "Annual consultations and X-rays covered for a family of four.",
    features: [
      "Free consultation for 1 year",
      "Free X-rays for 1 year",
      "Covers up to 4 family members",
      "Valid at both Gurugram clinics",
    ],
    popular: false,
  },
  {
    id: "package-2",
    name: "Package 2",
    subtitle: "Consult, X-ray & cleaning",
    price: "5500",
    period: "/ Year",
    description:
      "Everything in Package 1, plus professional cleaning for two members.",
    features: [
      "Free consultation for 1 year",
      "Free X-rays for 1 year",
      "Covers up to 4 family members",
      "One scaling & polishing for 2 members",
      "Valid at both Gurugram clinics",
    ],
    popular: true,
  },
  {
    id: "package-3",
    name: "Package 3",
    subtitle: "Complete family care",
    price: "9500",
    period: "/ Year",
    description:
      "Full preventive cover with professional cleaning for all four members.",
    features: [
      "Free consultation for 1 year",
      "Free X-rays for 1 year",
      "Covers up to 4 family members",
      "One scaling & polishing for all 4 members",
      "Valid at both Gurugram clinics",
    ],
    popular: false,
  },
];
