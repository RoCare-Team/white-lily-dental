/**
 * The single source of truth for every editable content type.
 *
 * Each entry describes one MongoDB collection: which fields it has, how they
 * are edited, and how a record is labelled in lists. The admin UI renders its
 * forms straight from this file and the API validates against it, so adding a
 * field to the website means adding one line here — not a new screen.
 *
 * Field types understood by both the form renderer and the validator:
 *   text · textarea · number · boolean · select · icon · colour
 *   image       — image URL with an upload button
 *   list        — array of short strings (one input per row)
 *   paragraphs  — array of long strings (one textarea per row)
 *   group       — a fixed object of sub-fields
 *   repeater    — array of objects, each built from `fields`
 */

export const CONTENT_TYPES = {
  services: {
    label: "Services",
    singular: "Service",
    description: "Treatment pages, their copy, sub-treatments and FAQs.",
    identity: "slug",
    titleField: "title",
    subtitleField: "excerpt",
    ordered: true,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      {
        name: "slug",
        label: "URL slug",
        type: "text",
        required: true,
        help: "The page address: /services/your-slug. Changing it breaks existing links.",
      },
      { name: "menuTitle", label: "Menu title", type: "text" },
      { name: "excerpt", label: "Card excerpt", type: "textarea" },
      { name: "tagline", label: "Tagline", type: "text" },
      {
        name: "iconImage",
        label: "Icon image",
        type: "image",
        help: "Round icon shown on the service cards and menu. Left empty, the drawn icon below is used instead.",
      },
      {
        name: "icon",
        label: "Fallback icon",
        type: "icon",
        help: "Used only when no icon image is set.",
      },
      {
        name: "accent",
        label: "Accent colours",
        type: "group",
        fields: [
          { name: "bg", label: "Background", type: "colour" },
          { name: "fg", label: "Foreground", type: "colour" },
        ],
      },
      { name: "image", label: "Hero image", type: "image" },
      { name: "imageAlt", label: "Hero image alt text", type: "text" },
      { name: "seoTitle", label: "SEO title", type: "text" },
      { name: "seoDescription", label: "SEO description", type: "textarea" },
      {
        name: "seoKeywords",
        label: "SEO keywords",
        type: "list",
        help: "Overrides the site-wide keywords for this page only.",
      },
      {
        name: "sections",
        label: "Page sections",
        type: "repeater",
        itemLabel: "heading",
        fields: [
          { name: "heading", label: "Heading", type: "text" },
          {
            name: "level",
            label: "Heading level",
            type: "select",
            options: ["h2", "h3"],
            default: "h2",
          },
          { name: "body", label: "Paragraphs", type: "paragraphs" },
          { name: "list", label: "Bullet list", type: "list" },
        ],
      },
      {
        name: "subServices",
        label: "Sub-treatments",
        type: "repeater",
        itemLabel: "name",
        fields: [
          { name: "name", label: "Name", type: "text" },
          { name: "slug", label: "URL slug", type: "text" },
          { name: "blurb", label: "Blurb", type: "textarea" },
          { name: "seoTitle", label: "SEO title", type: "text" },
          { name: "seoDescription", label: "SEO description", type: "textarea" },
          {
            name: "sections",
            label: "Page sections",
            type: "repeater",
            itemLabel: "heading",
            fields: [
              { name: "heading", label: "Heading", type: "text" },
              {
                name: "level",
                label: "Heading level",
                type: "select",
                options: ["h2", "h3"],
                default: "h2",
              },
              { name: "body", label: "Paragraphs", type: "paragraphs" },
              { name: "list", label: "Bullet list", type: "list" },
            ],
          },
        ],
      },
      {
        name: "faqs",
        label: "FAQs",
        type: "repeater",
        itemLabel: "q",
        fields: [
          { name: "q", label: "Question", type: "text" },
          { name: "a", label: "Answer", type: "textarea" },
        ],
      },
      {
        name: "related",
        label: "Related service slugs",
        type: "list",
        help: "Slugs of other services to cross-link at the bottom of the page.",
      },
      {
        name: "livePath",
        label: "Legacy path",
        type: "text",
        help: "Path on the old website, kept for redirects. Leave as-is unless you know it changed.",
      },
    ],
  },

  doctors: {
    label: "Doctors",
    singular: "Doctor",
    description: "Specialist profiles shown on the doctors pages.",
    identity: "slug",
    titleField: "name",
    subtitleField: "specialty",
    ordered: true,
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "slug", label: "URL slug", type: "text", required: true },
      { name: "qualification", label: "Qualification", type: "text" },
      { name: "specialty", label: "Specialty", type: "text" },
      { name: "image", label: "Photo", type: "image" },
      { name: "imageAlt", label: "Photo alt text", type: "text" },
      { name: "bio", label: "Biography", type: "textarea", rows: 6 },
      { name: "focus", label: "Areas of focus", type: "list" },
      {
        name: "services",
        label: "Linked service slugs",
        type: "list",
        help: "Slugs of the services this doctor performs.",
      },
    ],
  },

  clinics: {
    label: "Clinics",
    singular: "Clinic",
    description: "Branch addresses, phone numbers and opening hours.",
    identity: "id",
    titleField: "shortName",
    subtitleField: "address",
    ordered: true,
    fields: [
      { name: "shortName", label: "Short name", type: "text", required: true },
      {
        name: "id",
        label: "Identifier",
        type: "text",
        required: true,
        help: "Used internally, e.g. sector-69. Avoid changing it later.",
      },
      { name: "name", label: "Full name", type: "text" },
      { name: "address", label: "Address", type: "textarea" },
      { name: "landmark", label: "Landmark", type: "text" },
      { name: "phone", label: "Phone (dial format)", type: "text", help: "e.g. +919711811272" },
      { name: "phoneDisplay", label: "Phone (display)", type: "text" },
      { name: "hours", label: "Opening hours", type: "text" },
      {
        name: "openTime",
        label: "Bookings open at",
        type: "time",
        default: "11:00",
        help: "First appointment slot of the day.",
      },
      {
        name: "closeTime",
        label: "Bookings close at",
        type: "time",
        default: "19:30",
        help: "No slot is offered at or after this time.",
      },
      {
        name: "slotMinutes",
        label: "Minutes per slot",
        type: "number",
        min: 10,
        max: 180,
        default: 30,
      },
      { name: "mapsUrl", label: "Google Maps link", type: "text" },
      { name: "image", label: "Photo", type: "image" },
      { name: "imageAlt", label: "Photo alt text", type: "text" },
    ],
  },

  posts: {
    label: "Blog posts",
    singular: "Post",
    description: "Articles listed on the blog.",
    identity: "slug",
    titleField: "title",
    subtitleField: "category",
    ordered: true,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "URL slug", type: "text", required: true },
      { name: "excerpt", label: "Excerpt", type: "textarea" },
      { name: "category", label: "Category", type: "text" },
      { name: "readTime", label: "Read time", type: "text", help: "e.g. 5 min read" },
      { name: "date", label: "Date", type: "date", help: "Used for sorting and search engines." },
      {
        name: "dateLabel",
        label: "Date label",
        type: "text",
        help: "Shown to readers. Left blank, it is generated from the date.",
      },
      { name: "image", label: "Cover image", type: "image" },
      { name: "imageAlt", label: "Cover image alt text", type: "text" },
      {
        name: "seoKeywords",
        label: "SEO keywords",
        type: "list",
        help: "Overrides the site-wide keywords for this article only.",
      },
      {
        name: "body",
        label: "Article body",
        type: "repeater",
        itemLabel: "heading",
        fields: [
          { name: "heading", label: "Heading", type: "text" },
          { name: "paragraphs", label: "Paragraphs", type: "paragraphs" },
        ],
      },
    ],
  },

  plans: {
    label: "Dental plans",
    singular: "Plan",
    description: "Annual membership packages and their pricing.",
    identity: "id",
    titleField: "name",
    subtitleField: "subtitle",
    ordered: true,
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "id", label: "Identifier", type: "text", required: true },
      { name: "subtitle", label: "Subtitle", type: "text" },
      { name: "price", label: "Price", type: "text", help: "Digits only, e.g. 4,499 — the ₹ is added automatically." },
      { name: "period", label: "Period", type: "text", help: "e.g. / Year" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "features", label: "What's included", type: "list" },
      { name: "popular", label: "Highlight as most popular", type: "boolean" },
    ],
  },

  testimonials: {
    label: "Testimonials",
    singular: "Testimonial",
    description: "Patient reviews shown on the home page.",
    titleField: "name",
    subtitleField: "text",
    ordered: true,
    fields: [
      { name: "name", label: "Patient name", type: "text", required: true },
      {
        name: "image",
        label: "Photo",
        type: "image",
        help: "Round profile picture. Left empty, the patient's initial is shown instead.",
      },
      {
        name: "initial",
        label: "Initial",
        type: "text",
        help: "Single letter shown when there is no photo. Left blank, the first letter of the name is used.",
      },
      { name: "rating", label: "Rating", type: "number", min: 1, max: 5, default: 5 },
      { name: "source", label: "Source", type: "text", default: "Google Review" },
      { name: "text", label: "Review", type: "textarea", rows: 5, required: true },
    ],
  },

  faqs: {
    label: "Home FAQs",
    singular: "FAQ",
    description: "Questions in the home page FAQ section.",
    titleField: "q",
    subtitleField: "a",
    ordered: true,
    fields: [
      { name: "q", label: "Question", type: "text", required: true },
      { name: "a", label: "Answer", type: "textarea", rows: 5, required: true },
    ],
  },

  associations: {
    label: "Associations",
    singular: "Association",
    description: "Accreditation and partner badges.",
    titleField: "name",
    subtitleField: "note",
    ordered: true,
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "abbr", label: "Abbreviation", type: "text" },
      { name: "note", label: "Note", type: "text" },
    ],
  },
};

/**
 * Singletons — one document rather than a list. Same field vocabulary.
 */
export const SINGLETONS = {
  settings: {
    label: "Site settings",
    description: "Clinic name, phone numbers, email and social links used across the site.",
    fields: [
      { name: "name", label: "Site name", type: "text", required: true },
      { name: "legalName", label: "Legal name", type: "text" },
      { name: "tagline", label: "Tagline", type: "text" },
      { name: "url", label: "Website URL", type: "text", help: "Full address, e.g. https://www.whitelilydental.in" },
      { name: "phone", label: "Phone (dial format)", type: "text" },
      { name: "phoneDisplay", label: "Phone (display)", type: "text" },
      { name: "whatsapp", label: "WhatsApp number", type: "text", help: "Country code, no +, e.g. 919711811272" },
      { name: "email", label: "Email", type: "text" },
      { name: "hours", label: "Opening hours", type: "text" },
      { name: "yearsExperience", label: "Years of experience", type: "text" },
      { name: "intro", label: "Site introduction", type: "textarea", rows: 5 },
      {
        name: "publisher",
        label: "Publisher",
        type: "text",
        help: "Who publishes the site — shown to search engines. Left blank, the legal name is used.",
      },
      {
        name: "keywords",
        label: "SEO keywords",
        type: "list",
        help: "Site-wide keywords. Left empty, they are generated from your treatments and clinic areas. Pages can override them individually.",
      },
      { name: "googleReviewsUrl", label: "Google reviews link", type: "text" },
      {
        name: "noindex",
        label: "Hide the site from search engines",
        type: "boolean",
        help: "Keep this ON while the site is being built. Turn it OFF on launch day — until you do, Google will not list any page.",
      },
      {
        name: "socials",
        label: "Social links",
        type: "repeater",
        itemLabel: "label",
        fields: [
          { name: "label", label: "Platform", type: "text" },
          { name: "href", label: "URL", type: "text" },
        ],
      },
    ],
  },

  navigation: {
    label: "Navigation",
    description: "Header menu and footer quick links.",
    fields: [
      {
        name: "navLinks",
        label: "Header menu",
        type: "repeater",
        itemLabel: "label",
        fields: [
          { name: "label", label: "Label", type: "text" },
          { name: "href", label: "Link", type: "text" },
          { name: "hasMenu", label: "Show services dropdown", type: "boolean" },
        ],
      },
      {
        name: "quickLinks",
        label: "Footer quick links",
        type: "repeater",
        itemLabel: "label",
        fields: [
          { name: "label", label: "Label", type: "text" },
          { name: "href", label: "Link", type: "text" },
        ],
      },
    ],
  },
};

/** Mongo collection name for a content key. Singletons share one collection. */
export function collectionNameFor(key) {
  return `content_${key}`;
}

/** Every cached page that must be rebuilt when `key` changes. */
export const REVALIDATE_TAG = "content";
