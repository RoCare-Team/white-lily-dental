"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Award,
  Building2,
  ExternalLink,
  FileText,
  HelpCircle,
  CalendarCheck,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  Navigation,
  Quote,
  Settings,
  Stethoscope,
  Tag,
  UserCheck,
  UserRound,
  Users,
  X,
} from "lucide-react";

import { CONTENT_TYPES, SINGLETONS } from "@/lib/contentSchemas";
import { TOOLBAR_SLOT } from "@/components/admin/toolbarSlot";

/** One icon per content type, so the sidebar scans as a real app menu. */
const TYPE_ICONS = {
  services: Stethoscope,
  doctors: UserRound,
  clinics: Building2,
  posts: FileText,
  plans: Tag,
  testimonials: Quote,
  faqs: HelpCircle,
  associations: Award,
  settings: Settings,
  navigation: Navigation,
};

const CONTENT_LINKS = Object.entries(CONTENT_TYPES).map(([key, schema]) => ({
  href: `/admin/content/${key}`,
  label: schema.label,
  icon: TYPE_ICONS[key] ?? FileText,
}));

const SETTINGS_LINKS = Object.entries(SINGLETONS).map(([key, schema]) => ({
  href: `/admin/settings/${key}`,
  label: schema.label,
  icon: TYPE_ICONS[key] ?? Settings,
}));

const ALL_LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/appointments", label: "Calendar", icon: CalendarCheck },
  { href: "/admin/patients", label: "Patients", icon: Users },
  { href: "/admin/leads", label: "Contact messages", icon: Inbox },
  { href: "/admin/plan-enquiries", label: "Package requests", icon: Tag },
  { href: "/admin/clients", label: "Clients", icon: UserCheck },
  // Kept so the top bar can still name a content or singleton screen, even
  // though the sidebar now reaches them through Settings.
  { href: "/admin/settings", label: "Settings", icon: Settings },
  ...CONTENT_LINKS,
  ...SETTINGS_LINKS,
];

export default function AdminShell({ email, badges = {}, children }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  /* The server counts them; opening a screen clears its own badge straight
     away, without waiting for a refetch. */
  const [counts, setCounts] = useState(badges);
  const [lastBadges, setLastBadges] = useState(badges);
  if (lastBadges !== badges) {
    setLastBadges(badges);
    setCounts(badges);
  }

  useEffect(() => {
    const onSeen = (event) => {
      const key = event.detail;
      setCounts((current) => ({ ...current, [key]: 0 }));
    };
    document.addEventListener("wl:leads-seen", onSeen);
    return () => document.removeEventListener("wl:leads-seen", onSeen);
  }, []);

  // The sign-in screen has no navigation — it renders on its own.
  if (pathname === "/admin/login") return children;

  const signOut = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      router.replace("/admin/login");
      router.refresh();
    }
  };

  const isActive = (href) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  // Longest matching link wins, so /admin never beats /admin/leads.
  const current = [...ALL_LINKS]
    .filter((link) => isActive(link.href))
    .sort((a, b) => b.href.length - a.href.length)[0];

  const initials = (email || "A").slice(0, 2).toUpperCase();

  /* The diary is a workspace, not a document: it fills the window and meets the
     top bar, rather than floating on the page background like the other
     screens. Its list view is an ordinary screen and keeps the usual measure. */
  const fullBleed =
    pathname.startsWith("/admin/appointments") && searchParams.get("view") !== "list";

/*
   * On a wide screen the sidebar is a rail of icons that widens on hover, so
   * the screen beside it keeps the width. `rail` is what tells the labels to
   * stay hidden until then — the mobile drawer passes false and shows them
   * always, because nothing there is ever collapsed.
   */
  const nav = (rail) => (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-white/10 px-[18px]">
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand text-[13px] font-bold text-white">
          WL
        </span>
        <span
          className={`whitespace-nowrap font-display text-[15px] font-bold tracking-tight text-white transition-opacity duration-150 ${
            rail ? "opacity-0 group-hover/rail:opacity-100" : ""
          }`}
        >
          White Lily <span className="font-medium text-white/50">Admin</span>
        </span>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto overflow-x-hidden px-2.5 py-5">
        <NavGroup title="Patients" rail={rail}>
          <NavItem
            href="/admin"
            label="Dashboard"
            icon={LayoutDashboard}
            rail={rail}
            active={isActive("/admin")}
            onNavigate={() => setMenuOpen(false)}
          />
          <NavItem
            href="/admin/appointments"
            label="Calendar"
            icon={CalendarCheck}
            badge={counts.appointments}
            badgeTitle="Not yet opened"
            rail={rail}
            active={isActive("/admin/appointments")}
            onNavigate={() => setMenuOpen(false)}
          />
          <NavItem
            href="/admin/patients"
            label="Patients"
            icon={Users}
            rail={rail}
            active={isActive("/admin/patients")}
            onNavigate={() => setMenuOpen(false)}
          />
          <NavItem
            href="/admin/leads"
            label="Contact messages"
            icon={Inbox}
            badge={counts.contact}
            badgeTitle="Not yet opened"
            rail={rail}
            active={isActive("/admin/leads")}
            onNavigate={() => setMenuOpen(false)}
          />
          <NavItem
            href="/admin/plan-enquiries"
            label="Package requests"
            icon={Tag}
            badge={counts.packages}
            badgeTitle="Not yet opened"
            rail={rail}
            active={isActive("/admin/plan-enquiries")}
            onNavigate={() => setMenuOpen(false)}
          />
          {/* No badge: a completed lead has been dealt with by definition. */}
          <NavItem
            href="/admin/clients"
            label="Clients"
            icon={UserCheck}
            rail={rail}
            active={isActive("/admin/clients")}
            onNavigate={() => setMenuOpen(false)}
          />
        </NavGroup>

        <NavGroup title="Website" rail={rail}>
          {/* One door to all ten content types. Listing them here meant
              scrolling past the whole website to reach anything below. */}
          <NavItem
            href="/admin/settings"
            label="Settings"
            icon={Settings}
            rail={rail}
            active={
              pathname.startsWith("/admin/content") ||
              pathname.startsWith("/admin/settings")
            }
            onNavigate={() => setMenuOpen(false)}
          />
        </NavGroup>
      </nav>

      <div className="shrink-0 border-t border-white/10 p-2.5">
        <div className="flex items-center gap-3 rounded-[10px] px-[7px] py-2">
          <span
            title={email}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-[11.5px] font-bold text-white"
          >
            {initials}
          </span>
          <span
            className={`min-w-0 flex-1 transition-opacity duration-150 ${
              rail ? "opacity-0 group-hover/rail:opacity-100" : ""
            }`}
          >
            <span className="block whitespace-nowrap text-[12.5px] font-semibold text-white">
              Administrator
            </span>
            <span className="block truncate text-[11.5px] text-white/45">{email}</span>
          </span>
          <button
            type="button"
            onClick={signOut}
            title="Sign out"
            className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/50 transition-colors hover:bg-white/10 hover:text-white ${
              rail ? "opacity-0 group-hover/rail:opacity-100" : ""
            }`}
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Sign out</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="wl-admin min-h-screen bg-[#f6f8fb]">
      {/* Desktop rail: 68px of icons, widening over the page on hover so the
          screen underneath never reflows. */}
      <aside className="wl-admin-sidebar group/rail fixed inset-y-0 left-0 z-40 hidden w-[68px] overflow-hidden bg-[#0e1c2f] shadow-xl shadow-navy/10 transition-[width] duration-200 ease-out hover:w-[254px] lg:block">
        {nav(true)}
      </aside>

      {/* Mobile drawer */}
      {menuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-navy/60"
          />
          <div className="wl-admin-sidebar relative h-full w-[272px] bg-[#0e1c2f] shadow-2xl">
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="absolute right-3 top-4 inline-flex h-9 w-9 items-center justify-center rounded-lg text-white/60 hover:bg-white/10"
            >
              <X className="h-4.5 w-4.5" aria-hidden="true" />
              <span className="sr-only">Close menu</span>
            </button>
            {nav(false)}
          </div>
        </div>
      ) : null}

      <div className="lg:pl-[68px]">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex min-h-16 flex-wrap items-center gap-x-3 gap-y-2 border-b border-line bg-white/90 px-4 py-2.5 backdrop-blur sm:px-6">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-navy transition-colors hover:bg-[#f0f4f9] lg:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Open menu</span>
          </button>

          <p className="shrink-0 truncate text-[15px] font-bold tracking-tight text-navy">
            {current?.label ?? "Admin"}
          </p>

          {/* Screens with their own controls — the calendar's date navigation,
              for one — put them here rather than in a second bar underneath. */}
          <div
            id={TOOLBAR_SLOT}
            className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-2"
          />

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 shrink-0 items-center gap-2 rounded-[9px] border border-line px-3 text-[13px] font-semibold text-muted transition-colors hover:border-brand hover:text-brand"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">View site</span>
          </a>
        </header>

        <main
          className={
            fullBleed
              ? ""
              : `mx-auto px-4 py-7 sm:px-6 lg:px-8 ${
                  pathname.startsWith("/admin/patients")
                    ? "max-w-[1600px]"
                    : "max-w-[1180px]"
                }`
          }
        >
          {children}
        </main>
      </div>
    </div>
  );
}

function NavGroup({ title, rail, children }) {
  return (
    <div>
      {title ? (
        <p
          className={`mb-2 truncate px-3 text-[10.5px] font-bold uppercase tracking-[0.08em] text-white/35 transition-opacity duration-150 ${
            rail ? "opacity-0 group-hover/rail:opacity-100" : ""
          }`}
        >
          {title}
        </p>
      ) : null}
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function NavItem({ href, label, icon: Icon, active, badge, badgeTitle, rail, onNavigate }) {
  const fade = rail ? "opacity-0 group-hover/rail:opacity-100" : "";

  return (
    <Link
      href={href}
      onClick={onNavigate}
      title={rail ? label : undefined}
      aria-current={active ? "page" : undefined}
      className={`relative flex items-center gap-3 rounded-[9px] px-[11px] py-2.5 text-[13.5px] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 ${
        active
          ? "bg-white/10 font-semibold text-white"
          : "font-medium text-white/60 hover:bg-white/5 hover:text-white"
      }`}
    >
      {active ? (
        <span
          aria-hidden="true"
          className="absolute inset-y-1.5 -left-[7px] w-[3px] rounded-r bg-brand-500"
        />
      ) : null}

      <span className="relative shrink-0">
        {Icon ? <Icon className="h-[18px] w-[18px]" aria-hidden="true" /> : null}

        {/* Collapsed, the count has nowhere to sit, so it shrinks to a dot on
            the icon — still visible, still unmistakable. */}
        {badge > 0 && rail ? (
          <span
            aria-hidden="true"
            className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-coral ring-2 ring-[#0e1c2f] transition-opacity duration-150 group-hover/rail:opacity-0"
          />
        ) : null}
      </span>

      <span className={`min-w-0 flex-1 truncate transition-opacity duration-150 ${fade}`}>
        {label}
      </span>

      {/* Only shown when there is something to act on — a permanent "0" is noise */}
      {badge > 0 ? (
        <span
          title={badgeTitle}
          className={`inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-coral px-1.5 text-[11px] font-bold text-white transition-opacity duration-150 ${fade}`}
        >
          {badge > 99 ? "99+" : badge}
          <span className="sr-only"> {badgeTitle}</span>
        </span>
      ) : null}
    </Link>
  );
}
