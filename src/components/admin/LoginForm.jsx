"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Loader2, LogIn } from "lucide-react";

const field =
  "h-11 w-full rounded-[10px] border border-line bg-white px-3.5 text-[15px] text-navy outline-none transition-colors placeholder:text-muted/70 focus:border-brand focus:ring-2 focus:ring-brand/15";

const label = "mb-1.5 block text-[13.5px] font-semibold text-navy";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error ?? "Sign in failed. Please try again.");
        setBusy(false);
        return;
      }

      // Only follow `next` when it is a path on this site — never an absolute URL.
      const target = next?.startsWith("/") && !next.startsWith("//") ? next : "/admin";
      router.replace(target);
      router.refresh();
    } catch {
      setError("Network error. Check your connection and try again.");
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[14px] border border-line bg-white p-6 shadow-[0_18px_40px_-30px_rgba(10,37,64,0.45)]"
    >
      <h1 className="text-[19px] font-bold text-navy">Sign in</h1>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">
        Enter your admin credentials to view patient enquiries.
      </p>

      <div className="mt-5 space-y-4">
        <div>
          <label className={label} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="username"
            autoFocus
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={field}
          />
        </div>

        <div>
          <label className={label} htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={field}
          />
        </div>
      </div>

      {error ? (
        <p
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-[10px] border border-coral/30 bg-coral-50 p-3 text-[13.5px] leading-relaxed text-navy"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-coral" aria-hidden="true" />
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={busy}
        className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[11px] bg-deep text-[15px] font-semibold text-white transition-all duration-300 hover:bg-deep-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? (
          <Loader2 className="h-4.5 w-4.5 animate-spin" aria-hidden="true" />
        ) : (
          <LogIn className="h-4.5 w-4.5" aria-hidden="true" />
        )}
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
