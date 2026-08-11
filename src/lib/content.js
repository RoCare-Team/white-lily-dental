import { unstable_cache } from "next/cache";

import { getDb } from "@/lib/mongodb";
import { collectionNameFor, REVALIDATE_TAG } from "@/lib/contentSchemas";
import { iconNameOf } from "@/lib/icons";

// The original hand-written content. It is the fallback whenever the database
// is empty or unreachable, so the public site renders correctly even before it
// has been seeded and stays up if Atlas has an outage.
import { services as staticServices } from "@/data/services";
import { doctors as staticDoctors } from "@/data/doctors";
import { clinics as staticClinics } from "@/data/clinics";
import { posts as staticPosts } from "@/data/blog";
import { plans as staticPlans } from "@/data/plans";
import { testimonials as staticTestimonials } from "@/data/testimonials";
import { homeFaqs as staticFaqs } from "@/data/faqs";
import { associations as staticAssociations } from "@/data/associations";
import { navLinks, quickLinks } from "@/data/nav";
import { site as staticSite } from "@/data/site";

/**
 * Static content carries React components (service icons) and derived ids that
 * MongoDB cannot store. Normalising here means the fallback and the database
 * hand back exactly the same shape.
 */
function normaliseStatic(key, rows) {
  return rows.map((row, index) => {
    const base = { ...row, order: index };
    if (key === "services") base.icon = iconNameOf(row.icon);
    if (!base.id) base.id = base.slug ?? `${key}-${index + 1}`;
    return base;
  });
}

const STATIC_CONTENT = {
  services: () => normaliseStatic("services", staticServices),
  doctors: () => normaliseStatic("doctors", staticDoctors),
  clinics: () => normaliseStatic("clinics", staticClinics),
  posts: () => normaliseStatic("posts", staticPosts),
  plans: () => normaliseStatic("plans", staticPlans),
  testimonials: () => normaliseStatic("testimonials", staticTestimonials),
  faqs: () => normaliseStatic("faqs", staticFaqs),
  associations: () => normaliseStatic("associations", staticAssociations),
};

const STATIC_SINGLETONS = {
  settings: () => ({ ...staticSite }),
  navigation: () => ({ navLinks, quickLinks }),
};

/** Strips Mongo's ObjectId so the value can cross into a client component. */
function clean(doc) {
  if (!doc) return doc;
  const { _id, ...rest } = doc;
  return rest;
}

async function readCollection(key) {
  try {
    const db = await getDb();
    const docs = await db
      .collection(collectionNameFor(key))
      .find({})
      .sort({ order: 1, _id: 1 })
      .toArray();

    // An empty collection means "not seeded yet", not "the client deleted
    // everything" — fall back rather than showing an empty website.
    if (docs.length === 0) return STATIC_CONTENT[key]();
    return docs.map(clean);
  } catch (error) {
    console.error(`Content: falling back to static "${key}" —`, error.message);
    return STATIC_CONTENT[key]();
  }
}

async function readSingleton(key) {
  try {
    const db = await getDb();
    const doc = await db.collection(collectionNameFor(key)).findOne({ key });
    if (!doc?.value) return STATIC_SINGLETONS[key]();
    return doc.value;
  } catch (error) {
    console.error(`Content: falling back to static "${key}" —`, error.message);
    return STATIC_SINGLETONS[key]();
  }
}

/**
 * Cached readers. All share one cache tag, so a single revalidateTag() call
 * after an admin save refreshes every page on the site.
 */
const cachedCollection = (key) =>
  unstable_cache(() => readCollection(key), ["content", key], {
    tags: [REVALIDATE_TAG],
    revalidate: 3600,
  });

const cachedSingleton = (key) =>
  unstable_cache(() => readSingleton(key), ["singleton", key], {
    tags: [REVALIDATE_TAG],
    revalidate: 3600,
  });

export const getServices = cachedCollection("services");
export const getDoctors = cachedCollection("doctors");
export const getClinics = cachedCollection("clinics");
export const getPosts = cachedCollection("posts");
export const getPlans = cachedCollection("plans");
export const getTestimonials = cachedCollection("testimonials");
export const getHomeFaqs = cachedCollection("faqs");
export const getAssociations = cachedCollection("associations");

export const getSettings = cachedSingleton("settings");
export const getNavigation = cachedSingleton("navigation");

/* ── Lookups the pages need ─────────────────────────────────────────────── */

export async function getService(slug) {
  const services = await getServices();
  return services.find((service) => service.slug === slug) ?? null;
}

export async function getSubService(serviceSlug, subSlug) {
  const service = await getService(serviceSlug);
  return service?.subServices?.find((item) => item.slug === subSlug) ?? null;
}

/** Every `/services/[slug]/[sub]` route, for generateStaticParams. */
export async function getSubServiceParams() {
  const services = await getServices();
  return services.flatMap((service) =>
    (service.subServices ?? []).map((sub) => ({
      slug: service.slug,
      sub: sub.slug,
    }))
  );
}

export async function getRelatedServices(slug) {
  const services = await getServices();
  const service = services.find((item) => item.slug === slug);
  if (!service) return [];

  const related = (service.related ?? [])
    .map((relatedSlug) => services.find((item) => item.slug === relatedSlug))
    .filter(Boolean);

  // Never leave the section empty — top up with any other services.
  if (related.length === 0) {
    return services.filter((item) => item.slug !== slug).slice(0, 3);
  }
  return related;
}

export async function getDoctor(slug) {
  const doctors = await getDoctors();
  return doctors.find((doctor) => doctor.slug === slug) ?? null;
}

export async function getPost(slug) {
  const posts = await getPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}

/** Sorted newest-first, the order the blog listing wants. */
export async function getPostsByDate() {
  const posts = await getPosts();
  return [...posts].sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

/** Derived link helpers that used to live in data/site.js. */
export async function getContactLinks() {
  const settings = await getSettings();
  return {
    settings,
    telHref: `tel:${settings.phone}`,
    waHref: `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(
      "Hello White Lily Dental, I would like to book a dental appointment."
    )}`,
  };
}
