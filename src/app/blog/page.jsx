import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Clock } from "lucide-react";

import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";

import { getPostsByDate } from "@/lib/content";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata = {
  title: "Dental Health Blog | Advice from Gurugram Dentists",
  description:
    "Practical dental health advice from the specialists at White Lily Dental Gurugram — braces, implants, gum health, extractions, children's dentistry and preventive care.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Dental Health Blog | White Lily Dental Gurugram",
    description:
      "Articles on braces, implants, gum health and preventive dentistry written by our MDS specialists.",
    url: "/blog",
    type: "website",
    images: ["/images/og-image.png"],
  },
};

export default async function BlogPage() {
  const [featured, ...rest] = await getPostsByDate();

  return (
    <>
      <PageHero
        title="Dental Health Advice from Our Specialists"
        subtitle="Straightforward articles on the questions patients actually ask us — written by the dentists who treat them."
        breadcrumbs={[{ name: "Blog", href: "/blog" }]}
      />

      <section className="wl-section" aria-labelledby="blog-list-heading">
        <Container>
          <h2 id="blog-list-heading" className="sr-only">
            Latest articles
          </h2>

          {/* Featured post */}
          <Link
            href={`/blog/${featured.slug}`}
            className="group grid grid-cols-1 gap-8 overflow-hidden rounded-[18px] border border-line bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_30px_56px_-34px_rgba(10,37,64,0.45)] lg:grid-cols-2 lg:p-6"
          >
            <div className="relative aspect-16/10 overflow-hidden rounded-[14px]">
              <Image
                src={featured.image}
                alt={featured.imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 92vw, 46vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
            </div>

            <div className="flex flex-col justify-center py-2 lg:pr-6">
              <span className="inline-flex w-fit items-center rounded-full bg-brand-50 px-3 py-1 text-[13.5px] font-semibold text-brand-dark">
                {featured.category}
              </span>
              <h3 className="mt-4 text-[24px] font-bold leading-snug text-navy transition-colors group-hover:text-brand sm:text-[30px]">
                {featured.title}
              </h3>
              <p className="mt-3 text-[14.5px] leading-[1.8] text-muted">
                {featured.excerpt}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-4 text-[12.5px] text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4 text-brand" aria-hidden="true" />
                  {featured.dateLabel}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-brand" aria-hidden="true" />
                  {featured.readTime}
                </span>
              </div>
              <span className="mt-6 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-brand">
                Read article
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </span>
            </div>
          </Link>

          {/* Rest */}
          <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <li key={post.slug} className="h-full">
                <article className="h-full">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-[16px] border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_28px_50px_-32px_rgba(10,37,64,0.4)]"
                  >
                    <div className="relative aspect-16/10 overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.imageAlt}
                        fill
                        sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 30vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                      <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[13.5px] font-semibold text-brand-dark backdrop-blur">
                        {post.category}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-[17px] font-bold leading-snug text-navy transition-colors group-hover:text-brand">
                        {post.title}
                      </h3>
                      <p className="mt-2.5 flex-1 text-[13.5px] leading-[1.75] text-muted">
                        {post.excerpt}
                      </p>
                      <div className="mt-5 flex items-center gap-4 border-t border-line pt-4 text-[12px] text-muted">
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
                          {post.dateLabel}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
                          {post.readTime}
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CTASection />

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
        ])}
      />
    </>
  );
}
