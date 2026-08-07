import { site } from "@/data/site";
import { services } from "@/data/services";
import { doctors } from "@/data/doctors";
import { posts } from "@/data/blog";

export default function sitemap() {
  const now = new Date();

  const staticRoutes = [
    { path: "/", priority: 1 },
    { path: "/about", priority: 0.8 },
    { path: "/services", priority: 0.9 },
    { path: "/doctors", priority: 0.8 },
    { path: "/clinics", priority: 0.8 },
    { path: "/dental-plans", priority: 0.7 },
    { path: "/blog", priority: 0.7 },
    { path: "/contact", priority: 0.9 },
    { path: "/privacy-policy", priority: 0.3 },
  ].map((route) => ({
    url: `${site.url}${route.path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: route.priority,
  }));

  const serviceRoutes = services.map((service) => ({
    url: `${site.url}/services/${service.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  const doctorRoutes = doctors.map((doctor) => ({
    url: `${site.url}/doctors/${doctor.slug}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const postRoutes = posts.map((post) => ({
    url: `${site.url}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...serviceRoutes, ...doctorRoutes, ...postRoutes];
}
