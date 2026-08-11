"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ExternalLink,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  X,
} from "lucide-react";

import { CONTENT_TYPES, SINGLETONS } from "@/lib/contentSchemas";

const CONTENT_LINKS = Object.entries(CONTENT_TYPES).map(([key, schema]) => ({
  href: `/admin/content/${key}`,
  label: schema.label,
}));

const SETTINGS_LINKS = Object.entries(SINGLETONS).map(([key, schema]) => ({
  href: `/admin/settings/${key}`,
  label: schema.label,
}));

export default function AdminShell({ email, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

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

  const nav = (
    <nav className="flex h-full flex-col gap-7 overflow-y-auto px-4 py-6">
      <div>
        <Link
          href="/admin"
          onClick={() => setMenuOpen(false)}
          className="block px-2 font-display text-[17px] font-extrabold tracking-tight text-navy"
        >
          White Lily <span className="text-brand">Admin</span>
        </Link>
        <p className="mt-1 truncate px-2 text-[12px] text-muted">{email}</p>
      </div>

      <NavGroup>
        <NavItem
          href="/admin"
          label="Dashboard"
          icon={LayoutDashboard}
          active={isActive("/admin")}
          onNavigate={() => setMenuOpen(false)}
        />
        <NavItem
          href="/admin/leads"
          label="Enquiries"
          icon={Inbox}
          active={isActive("/admin/leads")}
          onNavigate={() => setMenuOpen(false)}
        />
      </NavGroup>

      <NavGroup title="Website content">
        {CONTENT_LINKS.map((link) => (
          <NavItem
            key={link.href}
            href={link.href}
            label={link.label}
            active={isActive(link.href)}
            onNavigate={() => setMenuOpen(false)}
          />
        ))}
      </NavGroup>

      <NavGroup title="Settings">
        {SETTINGS_LINKS.map((link) => (
          <NavItem
            key={link.href}
            href={link.href}
            label={link.label}
            icon={Settings}
            active={isActive(link.href)}
            onNavigate={() => setMenuOpen(false)}
          />
        ))}
      </NavGroup>

      <div className="mt-auto space-y-1 border-t border-line pt-4">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 rounded-[9px] px-3 py-2 text-[13.5px] font-medium text-muted transition-colors hover:bg-brand-50 hover:text-brand"
        >
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          View website
        </a>
        <button
          type="button"
          onClick={signOut}
          className="flex w-full items-center gap-2.5 rounded-[9px] px-3 py-2 text-[13.5px] font-medium text-muted transition-colors hover:bg-coral-50 hover:text-coral-dark"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Sign out
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Mobile bar */}
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-line bg-white px-4 lg:hidden">
        <span className="font-display text-[16px] font-extrabold tracking-tight text-navy">
          White Lily <span className="text-brand">Admin</span>
        </span>
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-navy hover:bg-brand-50"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only">Open menu</span>
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-[248px] border-r border-line bg-white lg:block">
        {nav}
      </aside>

      {/* Mobile drawer */}
      {menuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-navy/40"
          />
          <div className="relative h-full w-[270px] bg-white shadow-2xl">
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="absolute right-3 top-4 inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-brand-50"
            >
              <X className="h-4.5 w-4.5" aria-hidden="true" />
              <span className="sr-only">Close menu</span>
            </button>
            {nav}
          </div>
        </div>
      ) : null}

      <div className="lg:pl-[248px]">
        <main className="mx-auto max-w-[1100px] px-4 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}

function NavGroup({ title, children }) {
  return (
    <div>
      {title ? (
        <p className="mb-1.5 px-3 text-[11px] font-bold uppercase tracking-wider text-muted/70">
          {title}
        </p>
      ) : null}
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function NavItem({ href, label, icon: Icon, active, onNavigate }) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-2.5 rounded-[9px] px-3 py-2 text-[13.5px] font-medium transition-colors ${
        active
          ? "bg-brand-50 font-semibold text-brand"
          : "text-navy hover:bg-[#f5f7fa]"
      }`}
    >
      {Icon ? <Icon className="h-4 w-4 shrink-0" aria-hidden="true" /> : null}
      {label}
    </Link>
  );
}
