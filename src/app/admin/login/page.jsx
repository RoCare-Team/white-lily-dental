import { Suspense } from "react";

import LoginForm from "@/components/admin/LoginForm";

export const metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f7fa] px-4 py-16">
      <div className="w-full max-w-[400px]">
        <div className="mb-7 text-center">
          <p className="font-display text-[24px] font-extrabold tracking-tight text-navy">
            White Lily <span className="text-brand">Dental</span>
          </p>
          <p className="mt-1.5 text-[13.5px] text-muted">Admin panel</p>
        </div>

        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>

        <p className="mt-6 text-center text-[12.5px] text-muted">
          Authorised staff only.
        </p>
      </div>
    </div>
  );
}
