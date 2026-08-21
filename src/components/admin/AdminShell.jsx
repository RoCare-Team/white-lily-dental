"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  { href: "/admin/leads", label: "Contact messages", icon: Inbox },
  { href: "/admin/plan-enquiries", label: "Package requests", icon: Tag },
  { href: "/admin/clients", label: "Clients", icon: UserCheck },
  { href: "/admin/patients", label: "Patients", icon: Users },
  // Kept so the top bar can still name a content or singleton screen, even
  // though the sidebar now reaches them through Settings.
  { href: "/admin/settings", label: "Settings", icon: Settings },
  ...CONTENT_LINKS,
  ...SETTINGS_LINKS,
];

export default function AdminShell({ email, badges = {}, children }) {
  const pathname = usePathname();
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

  const nav = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-white/10 px-5">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-[13px] font-bold text-white">
          WL
        </span>
        <span className="font-display text-[15px] font-bold tracking-tight text-white">
          White Lily <span className="font-medium text-white/50">Admin</span>
        </span>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        <NavGroup title="Patients">
          <NavItem
            href="/admin"
            label="Dashboard"
            icon={LayoutDashboard}
            active={isActive("/admin")}
            onNavigate={() => setMenuOpen(false)}
          />
          <NavItem
            href="/admin/appointments"
            label="Calendar"
            icon={CalendarCheck}
            badge={counts.appointments}
            badgeTitle="Not yet opened"
            active={isActive("/admin/appointments")}
            onNavigate={() => setMenuOpen(false)}
          />
          <NavItem
            href="/admin/leads"
            label="Contact messages"
            icon={Inbox}
            badge={counts.contact}
            badgeTitle="Not yet opened"
            active={isActive("/admin/leads")}
            onNavigate={() => setMenuOpen(false)}
          />
          <NavItem
            href="/admin/plan-enquiries"
            label="Package requests"
            icon={Tag}
            badge={counts.packages}
            badgeTitle="Not yet opened"
            active={isActive("/admin/plan-enquiries")}
            onNavigate={() => setMenuOpen(false)}
          />
          {/* No badge: a completed lead has been dealt with by definition. */}
          <NavItem
            href="/admin/clients"
            label="Clients"
            icon={UserCheck}
            active={isActive("/admin/clients")}
            onNavigate={() => setMenuOpen(false)}
          />
          <NavItem
            href="/admin/patients"
            label="Patients"
            icon={Users}
            active={isActive("/admin/patients")}
            onNavigate={() => setMenuOpen(false)}
          />
        </NavGroup>

        <NavGroup title="Website">
          {/* One door to all ten content types. Listing them here meant
              scrolling past the whole website to reach anything below. */}
          <NavItem
            href="/admin/settings"
            label="Settings"
            icon={Settings}
            active={
              pathname.startsWith("/admin/content") ||
              pathname.startsWith("/admin/settings")
            }
            onNavigate={() => setMenuOpen(false)}
          />
        </NavGroup>
      </nav>

      <div className="shrink-0 border-t border-white/10 p-3">
        <div className="flex items-center gap-2.5 rounded-[10px] px-2 py-2">
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-[11.5px] font-bold text-white">
            {initials}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[12.5px] font-semibold text-white">
              Administrator
            </span>
            <span className="block truncate text-[11.5px] text-white/45">{email}</span>
          </span>
          <button
            type="button"
            onClick={signOut}
            title="Sign out"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/50 transition-colors hover:bg-white/10 hover:text-white"
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
      {/* Desktop sidebar */}
      <aside className="wl-admin-sidebar fixed inset-y-0 left-0 hidden w-[252px] bg-[#0e1c2f] lg:block">
        {nav}
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
            {nav}
          </div>
        </div>
      ) : null}

      <div className="lg:pl-[252px]">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-white/90 px-4 backdrop-blur sm:px-6">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-navy transition-colors hover:bg-[#f0f4f9] lg:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Open menu</span>
          </button>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-bold tracking-tight text-navy">
              {current?.label ?? "Admin"}
            </p>
          </div>

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

        {/* The calendar needs every column it can get; the other screens read
            better held to a comfortable measure. */}
        <main
          className={`mx-auto px-4 py-7 sm:px-6 lg:px-8 ${
            pathname.startsWith("/admin/appointments") ||
            pathname.startsWith("/admin/patients")
              ? "max-w-[1600px]"
              : "max-w-[1180px]"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

function NavGroup({ title, children }) {
  return (
    <div>
      {title ? (
        <p className="mb-2 px-3 text-[10.5px] font-bold uppercase tracking-[0.08em] text-white/35">
          {title}
        </p>
      ) : null}
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function NavItem({ href, label, icon: Icon, active, badge, badgeTitle, onNavigate }) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={`group relative flex items-center gap-2.5 rounded-[9px] px-3 py-2 text-[13.5px] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 ${
        active
          ? "bg-white/10 font-semibold text-white"
          : "font-medium text-white/60 hover:bg-white/5 hover:text-white"
      }`}
    >
      {active ? (
        <span
          aria-hidden="true"
          className="absolute inset-y-1.5 left-0 w-[3px] rounded-r bg-brand-500"
        />
      ) : null}
      {Icon ? <Icon className="h-4 w-4 shrink-0" aria-hidden="true" /> : null}
      <span className="min-w-0 flex-1 truncate">{label}</span>

      {/* Only shown when there is something to act on — a permanent "0" is noise */}
      {badge > 0 ? (
        <span
          title={badgeTitle}
          className="inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-coral px-1.5 text-[11px] font-bold text-white"
        >
          {badge > 99 ? "99+" : badge}
          <span className="sr-only"> {badgeTitle}</span>
        </span>
      ) : null}
    </Link>
  );
}
