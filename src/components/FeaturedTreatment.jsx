import { CalendarCheck, Phone } from "lucide-react";

import SplitFeature from "./SplitFeature";
import { telHref } from "@/data/site";

export default function FeaturedTreatment() {
  return (
    <SplitFeature
      headingId="featured-implants-heading"
      className="bg-brand-50/50"
      eyebrow="Featured Treatment"
      title="Dental Implants"
      description="A titanium post replaces the missing root and carries a custom ceramic crown — the only tooth replacement that also stops the jawbone shrinking."
      bullets={[
        "Improved appearance",
        "Enhanced functionality",
        "Preservation of oral health",
        "Improved self-confidence",
      ]}
      image="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1000&q=80"
      imageAlt="Dentist explaining a dental implant model to a patient at White Lily Dental Gurugram"
      secondary={{ href: telHref, label: "Call Now", icon: Phone }}
      primary={{ href: "/contact", label: "Book an Appointment", icon: CalendarCheck }}
      moreLink={{
        href: "/services/dental-implants",
        label: "Read more about dental implants",
      }}
    />
  );
}
