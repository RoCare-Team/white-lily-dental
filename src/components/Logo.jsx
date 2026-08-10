import Image from "next/image";
import Link from "next/link";

/* variant="light" is used on the dark footer, where the navy wordmark needs a
   white plate behind it to stay legible. */
export default function Logo({ variant = "dark", className = "" }) {
  const isLight = variant === "light";

  return (
    <Link
      href="/"
      aria-label="White Lily Dental — home"
      className={`group inline-flex items-center transition-transform duration-300 hover:-translate-y-0.5 ${
        isLight ? "rounded-xl bg-white px-3.5 py-2.5" : ""
      } ${className}`}
    >
      <Image
        src="/images/KLiw-logo.webp"
        alt="White Lily Dental"
        width={400}
        height={150}
        priority
        className={isLight ? "h-10 w-auto" : "h-11 w-auto sm:h-12"}
      />
    </Link>
  );
}
