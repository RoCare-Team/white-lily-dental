import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, ChevronRight, Clock, Home } from "lucide-react";

import Container from "@/components/Container";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";

import { getPost, getPosts, getSettings } from "@/lib/content";
import { breadcrumbSchema } from "@/lib/schema";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) return { title: "Article Not Found" };

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      images: [{ url: post.image, alt: post.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const [allPosts, site] = await Promise.all([getPosts(), getSettings()]);
  const more = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.date,
    author: { "@type": "Organization", name: site.name },
    publisher: { "@type": "Organization", name: site.name },
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
  };

  return (
    <>
      <article>
        <header className="border-b border-line bg-brand-50/50">
          <Container className="py-9 md:py-12">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-1.5 text-[14px] text-muted">
                <li>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 transition-colors hover:text-brand"
                  >
                    <Home className="h-3.5 w-3.5" aria-hidden="true" />
                    Home
                  </Link>
                </li>
                <li className="flex items-center gap-1.5">
                  <ChevronRight className="h-3.5 w-3.5 text-line" aria-hidden="true" />
                  <Link href="/blog" className="transition-colors hover:text-brand">
                    Blog
                  </Link>
                </li>
                <li className="flex items-center gap-1.5">
                  <ChevronRight className="h-3.5 w-3.5 text-line" aria-hidden="true" />
                  <span className="font-medium text-navy" aria-current="page">
                    {post.category}
                  </span>
                </li>
              </ol>
            </nav>

            <span className="mt-6 inline-flex items-center rounded-full border border-brand-100 bg-white px-3.5 py-1.5 text-[12px] font-semibold text-brand-dark">
              {post.category}
            </span>

            <h1 className="mt-4 max-w-3xl text-[30px] font-bold leading-[1.15] text-navy sm:text-[38px] lg:text-[44px]">
              {post.title}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-5 text-[13px] text-muted">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4 text-brand" aria-hidden="true" />
                {post.dateLabel}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-brand" aria-hidden="true" />
                {post.readTime}
              </span>
            </div>
          </Container>
        </header>

        <Container className="py-9 md:py-12">
          <div className="mx-auto max-w-3xl">
            <div className="relative aspect-16/9 overflow-hidden rounded-[18px] border border-line">
              <Image
                src={post.image}
                alt={post.imageAlt}
                fill
                priority
                sizes="(max-width: 768px) 92vw, 768px"
                className="object-cover"
              />
            </div>

            <p className="mt-8 text-[17px] font-medium leading-[1.8] text-navy/85">
              {post.excerpt}
            </p>

            {post.body.map((section) => (
              <section key={section.heading} className="mt-8">
                <h2 className="text-[22px] font-bold leading-snug text-navy sm:text-[26px]">
                  {section.heading}
                </h2>
                <div className="wl-prose mt-4 text-[15px]">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}

            <div className="mt-9 rounded-[16px] border border-line bg-brand-50/50 p-6">
              <h2 className="text-[18px] font-bold text-navy">
                Have a question about your own teeth?
              </h2>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">
                General advice is no substitute for an examination. Book a
                consultation at any of our three Gurugram clinics and
                get an answer specific to you.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href="/contact"
                  className="inline-flex h-11 items-center rounded-xl bg-deep px-5 text-[13.5px] font-semibold text-white transition-colors hover:bg-deep-600"
                >
                  Book Appointment
                </Link>
                <a
                  href={`tel:${site.phone}`}
                  className="inline-flex h-11 items-center rounded-xl border border-line bg-white px-5 text-[13.5px] font-semibold text-navy transition-colors hover:bg-white/60"
                >
                  Call {site.phoneDisplay}
                </a>
              </div>
            </div>

            <Link
              href="/blog"
              className="mt-8 inline-flex items-center gap-2 text-[13.5px] font-semibold text-coral hover:text-coral-dark"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to all articles
            </Link>
          </div>
        </Container>
      </article>

      {/* More articles */}
      <section className="wl-section bg-brand-50/40" aria-labelledby="more-articles-heading">
        <Container>
          <h2
            id="more-articles-heading"
            className="text-[26px] font-bold text-navy sm:text-[32px]"
          >
            More from our blog
          </h2>

          <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((item) => (
              <li key={item.slug} className="h-full">
                <Link
                  href={`/blog/${item.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-[16px] border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_28px_50px_-32px_rgba(10,37,64,0.4)]"
                >
                  <div className="relative aspect-16/10 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      fill
                      sizes="(max-width: 640px) 92vw, 30vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <span className="text-[11.5px] font-semibold uppercase tracking-wider text-brand">
                      {item.category}
                    </span>
                    <h3 className="mt-2 text-[16px] font-bold leading-snug text-navy group-hover:text-brand">
                      {item.title}
                    </h3>
                    <p className="mt-2 flex-1 text-[13px] leading-[1.7] text-muted">
                      {item.excerpt}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CTASection />

      <JsonLd data={articleSchema} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
          { name: post.title, href: `/blog/${post.slug}` },
        ])}
      />
    </>
  );
}
