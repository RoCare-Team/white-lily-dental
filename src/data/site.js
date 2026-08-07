export const site = {
  name: "White Lily Dental",
  legalName: "White Lily Dental",
  tagline: "Multi-Specialist Dental Clinic in Gurugram",
  url: "https://www.whitelilydental.in",
  phone: "+919711811272",
  phoneDisplay: "+91 97118 11272",
  whatsapp: "919711811272",
  email: "whitelilydentalindia@gmail.com",
  hours: "Monday – Sunday, 11:00 AM – 7:30 PM",
  yearsExperience: "21+",
  intro:
    "White Lily Dental is a multi-specialist dental chain in Gurugram offering orthodontics, implants, prosthodontics, cosmetic dentistry, endodontics and oral surgery under one roof — delivered by experienced MDS specialists using advanced dental technology.",
  socials: [
    { label: "Facebook", href: "https://www.facebook.com/whitelilydental" },
    { label: "Instagram", href: "https://www.instagram.com/whitelilydental" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/whitelilydental" },
    { label: "Twitter", href: "https://twitter.com/whitelilydental" },
  ],
  googleReviewsUrl: "https://www.google.com/search?q=White+Lily+Dental+Gurgaon+reviews",
};

export const telHref = `tel:${site.phone}`;
export const waHref = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
  "Hello White Lily Dental, I would like to book a dental appointment."
)}`;
