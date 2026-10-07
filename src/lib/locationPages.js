import { getClinics, getServices, getSettings } from "@/lib/content";

/**
 * Location → page index for the public `/api/cities` and `/api/state-pages`
 * endpoints. Each clinic is a "city" and each treatment a category, so an SEO
 * tool can list every page a clinic area should rank for, with its keywords.
 */

// Both branches are in Gurugram. A clinic can override this with a `state` field.
const DEFAULT_STATE = "Haryana";

/** "Sector 69, Gurugram" → "Sector 69 Gurugram" (commas would split keywords). */
function locationLabel(clinic) {
  return String(clinic.shortName || clinic.name || clinic.id).replace(/,/g, "").trim();
}

function slugify(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function keywordsFor(title, location, parentTitle) {
  // "Teeth Whitening (Instant)" → "teeth whitening": nobody searches the brackets.
  const name = String(title).replace(/\s*\(.*?\)/g, "").trim().toLowerCase();
  return [
    `${name} in ${location}`,
    `${name} dentist ${location}`,
    `best ${name} clinic ${location}`,
    `${name} cost ${location}`,
    parentTitle ? `${parentTitle.toLowerCase()} ${location}` : `dentist in ${location}`,
    `${name} near me`,
  ].join(", ");
}

function categoriesFor(clinic, services, siteUrl) {
  const location = locationLabel(clinic);

  return services.map((service) => {
    const urls = [
      {
        url: `${siteUrl}/services/${service.slug}`,
        meta_keywords: service.seoKeywords?.length
          ? service.seoKeywords.join(", ")
          : keywordsFor(service.title, location),
      },
      ...(service.subServices ?? []).map((sub) => ({
        url: `${siteUrl}/services/${service.slug}/${sub.slug}`,
        meta_keywords: keywordsFor(sub.name, location, service.title),
      })),
    ];

    return {
      category: service.slug,
      name: service.title,
      count: urls.length,
      urls,
    };
  });
}

async function loadAll() {
  const [settings, clinics, services] = await Promise.all([
    getSettings(),
    getClinics(),
    getServices(),
  ]);
  return { siteUrl: String(settings.url).replace(/\/+$/, ""), clinics, services };
}

export async function listCities() {
  const { siteUrl, clinics, services } = await loadAll();

  return clinics.map((clinic) => ({
    slug: clinic.id,
    name: clinic.shortName || clinic.name || clinic.id,
    state: clinic.state || DEFAULT_STATE,
    image: clinic.image ?? "",
    count: services.length,
    pagesApi: `${siteUrl}/api/state-pages?city=${encodeURIComponent(clinic.id)}`,
  }));
}

/**
 * Pages for one clinic area. `city` matches the clinic id ("sector-69") or its
 * name in any case ("Sector 69, Gurugram", "sector-69-gurugram").
 * Returns null when nothing matches.
 */
export async function pagesForCity(city) {
  const { siteUrl, clinics, services } = await loadAll();
  const wanted = slugify(city);

  const clinic = clinics.find(
    (item) =>
      slugify(item.id) === wanted ||
      slugify(item.shortName) === wanted ||
      slugify(item.name) === wanted
  );
  if (!clinic) return null;

  const categories = categoriesFor(clinic, services, siteUrl);

  return {
    scope: `city:${clinic.shortName || clinic.name || clinic.id}`,
    category_count: categories.length,
    url_count: categories.reduce((total, category) => total + category.count, 0),
    categories,
  };
}
