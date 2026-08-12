import { Suspense } from "react";
import { Lock } from "lucide-react";

import LoginForm from "@/components/admin/LoginForm";

export const metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel — hidden on small screens, where it would just push the form down */}
      <div className="relative hidden overflow-hidden bg-[#0e1c2f] lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-brand/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-coral/10 blur-3xl" />
        </div>

        <div className="relative flex items-center gap-2.5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-[14px] font-bold text-white">
            WL
          </span>
          <span className="font-display text-[16px] font-bold tracking-tight text-white">
            White Lily <span className="font-medium text-white/50">Admin</span>
          </span>
        </div>

        <div className="relative max-w-[380px]">
          <h2 className="font-display text-[28px] font-bold leading-tight tracking-tight text-white">
            Everything on the website, in one place.
          </h2>
          <p className="mt-3 text-[14.5px] leading-relaxed text-white/60">
            Patient enquiries, treatments, doctors, clinics, blog posts and site
            settings — all editable, all live the moment you save.
          </p>
        </div>

        <p className="relative text-[12.5px] text-white/40">
          Authorised clinic staff only.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-[#f6f8fb] px-4 py-16">
        <div className="w-full max-w-[380px]">
          <div className="mb-7 text-center lg:hidden">
            <p className="font-display text-[22px] font-extrabold tracking-tight text-navy">
              White Lily <span className="text-brand">Dental</span>
            </p>
            <p className="mt-1 text-[13px] text-muted">Admin panel</p>
          </div>

          <div className="rounded-[16px] border border-line bg-white p-6 shadow-[0_20px_44px_-34px_rgba(10,37,64,0.5)] sm:p-7">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-[11px] bg-brand-50 text-brand">
              <Lock className="h-4.5 w-4.5" aria-hidden="true" />
            </span>

            <h1 className="mt-4 text-[20px] font-bold tracking-tight text-navy">
              Sign in
            </h1>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">
              Enter your admin credentials to manage the website.
            </p>

            <Suspense fallback={null}>
              <LoginForm />
            </Suspense>
          </div>

          <p className="mt-5 text-center text-[12px] text-muted">
            Trouble signing in? Contact your web administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
