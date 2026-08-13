/**
 * FALLBACK ONLY — this is not what the website reads.
 *
 * Live content lives in MongoDB and is edited at /admin. This file is served
 * only when its collection is empty or the database is unreachable, so the
 * site never renders a blank section. Editing a value here will NOT change the
 * website; change it in the admin panel instead.
 */
export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services", hasMenu: true },
  { label: "Why Us", href: "/#why-us" },
  { label: "Doctors", href: "/doctors" },
  { label: "Testimonials", href: "/#testimonials" },
  { label: "Contact Us", href: "/contact" },
];

export const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "All Services", href: "/services" },
  { label: "Meet Our Doctors", href: "/doctors" },
  { label: "Our Clinics", href: "/clinics" },
  { label: "Dental Plans", href: "/dental-plans" },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact" },
];
