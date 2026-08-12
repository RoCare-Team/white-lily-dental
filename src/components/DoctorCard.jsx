import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarCheck } from "lucide-react";

export default function DoctorCard({ doctor }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[14px] border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_18px_34px_-20px_rgba(10,37,64,0.3)]">
      {/* Square slot: the photos are taller than they are wide, so a landscape
          frame would crop the face off — a square trims only the bottom, and
          object-top keeps the head in shot. */}
      <div className="relative aspect-1/1 overflow-hidden bg-brand-50">
        <Image
          src={doctor.image}
          alt={doctor.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[14px] font-semibold text-coral-dark backdrop-blur">
          {doctor.specialty}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[19px] font-bold leading-snug text-navy">
          {doctor.name}
        </h3>
        <p className="mt-1.5 flex-1 text-[15px] leading-[1.5] text-muted">
          {doctor.qualification}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Link
            href={`/doctors/${doctor.slug}`}
            className="inline-flex h-11 items-center gap-1.5 rounded-[11px] border border-line px-4 text-[14.5px] font-semibold text-navy transition-colors hover:border-brand-200 hover:bg-brand-50"
          >
            View Profile
            <ArrowRight className="h-4 w-4 text-coral" aria-hidden="true" />
          </Link>
          <Link
            href={`/contact?doctor=${doctor.slug}`}
            data-book-appointment
            className="inline-flex h-11 items-center gap-1.5 rounded-[11px] bg-deep px-4 text-[14.5px] font-semibold text-white transition-colors hover:bg-deep-600"
          >
            <CalendarCheck className="h-4 w-4" aria-hidden="true" />
            Book Appointment
          </Link>
        </div>
      </div>
    </article>
  );
}
