import Link from "next/link";
import {
  Award,
  Building2,
  ChevronRight,
  FileText,
  HelpCircle,
  Navigation,
  Quote,
  Settings as SettingsIcon,
  Stethoscope,
  Tag,
  UserRound,
} from "lucide-react";

import PageTitle from "@/components/admin/PageTitle";
import { getDb } from "@/lib/mongodb";
import {
  CONTENT_TYPES,
  SINGLETONS,
  collectionNameFor,
} from "@/lib/contentSchemas";

export const metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

/** One icon per section, matching the icons the sidebar used to show. */
const ICONS = {
  services: Stethoscope,
  doctors: UserRound,
  clinics: Building2,
  posts: FileText,
  plans: Tag,
  testimonials: Quote,
  faqs: HelpCircle,
  associations: Award,
  settings: SettingsIcon,
  navigation: Navigation,
};

/** How many records each section holds, so a card says what is inside it. */
async function loadCounts() {
  try {
    const db = await getDb();
    return Object.fromEntries(
      await Promise.all(
        Object.keys(CONTENT_TYPES).map(async (key) => [
          key,
          await db.collection(collectionNameFor(key)).countDocuments({}),
        ])
      )
    );
  } catch (error) {
    // A count is a nicety — never let it keep the page from opening.
    console.error("Settings counts unavailable:", error.message);
    return {};
  }
}

export default async function AdminSettingsPage() {
  const counts = await loadCounts();

  const sections = Object.entries(CONTENT_TYPES).map(([key, schema]) => ({
    key,
    href: `/admin/content/${key}`,
    label: schema.label,
    description: schema.description,
    count: counts[key],
    singular: schema.singular,
  }));

  const singletons = Object.entries(SINGLETONS).map(([key, schema]) => ({
    key,
    href: `/admin/settings/${key}`,
    label: schema.label,
    description: schema.description,
  }));

  return (
    <>
      <PageTitle
        title="Settings"
        subtitle="Everything on the public website is edited from here."
      />

      <h2 className="mt-7 text-[12px] font-bold uppercase tracking-[0.08em] text-muted">
        Website content
      </h2>

      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <SettingCard
            key={section.key}
            icon={ICONS[section.key] ?? FileText}
            href={section.href}
            label={section.label}
            description={section.description}
            meta={
              typeof section.count === "number"
                ? `${section.count} ${
                    section.count === 1
                      ? section.singular.toLowerCase()
                      : section.label.toLowerCase()
                  }`
                : null
            }
          />
        ))}
      </div>

      <h2 className="mt-9 text-[12px] font-bold uppercase tracking-[0.08em] text-muted">
        Configuration
      </h2>

      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {singletons.map((section) => (
          <SettingCard
            key={section.key}
            icon={ICONS[section.key] ?? SettingsIcon}
            href={section.href}
            label={section.label}
            description={section.description}
          />
        ))}
      </div>
    </>
  );
}

function SettingCard({ icon: Icon, href, label, description, meta }) {
  return (
    <Link
      href={href}
      className="group flex h-full items-start gap-3 rounded-[13px] border border-line bg-white p-4 outline-none transition-colors hover:border-brand focus-visible:ring-2 focus-visible:ring-brand/30"
    >
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-brand-50 text-brand">
        <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="text-[15px] font-semibold text-navy group-hover:text-brand">
            {label}
          </span>
          <ChevronRight
            className="h-3.5 w-3.5 shrink-0 text-muted/60 transition-transform group-hover:translate-x-0.5 group-hover:text-brand"
            aria-hidden="true"
          />
        </span>

        {description ? (
          <span className="mt-1 block text-[13px] leading-relaxed text-muted">
            {description}
          </span>
        ) : null}

        {meta ? (
          <span className="mt-2 inline-flex items-center rounded-full bg-[#f0f4f9] px-2.5 py-1 text-[12px] font-semibold text-muted">
            {meta}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
