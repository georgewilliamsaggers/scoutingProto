"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AgOSLogo } from "@/components/AgOSLogo";
import { MobileShell } from "@/components/MobileShell";
import {
  DEMO_EMAIL,
  getPostLoginRoute,
} from "@/lib/auth-routes";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 800));
    router.push(getPostLoginRoute());
  }

  function handleDemoLogin() {
    setEmail(DEMO_EMAIL);
    setPassword("demo");
  }

  return (
    <MobileShell>
      {/* Top accent bar */}
      <div className="gradient-brand h-1.5 w-full shrink-0" />

      <div className="flex flex-1 flex-col px-7 pb-8 pt-10">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <AgOSLogo variant="image" size="small" />
        </div>

        {/* Welcome copy */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-navy">
            Welcome back
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Sign in to scout your fields and capture insights on the go.
          </p>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-navy">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@farm.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 rounded-xl border border-border bg-surface px-4 text-base text-navy outline-none transition-all placeholder:text-muted/60 focus:border-teal focus:ring-2 focus:ring-teal/20"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium text-navy">
                Password
              </label>
              <button
                type="button"
                className="text-xs font-medium text-teal transition-colors hover:text-teal-deep"
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 w-full rounded-xl border border-border bg-surface px-4 pr-12 text-base text-navy outline-none transition-all placeholder:text-muted/60 focus:border-teal focus:ring-2 focus:ring-teal/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-muted transition-colors hover:text-navy"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary-pill mt-2 disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <Spinner />
                Signing in…
              </>
            ) : (
              <>
                <ArrowRightIcon />
                Sign in
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-medium uppercase tracking-wider text-muted">
            or
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Demo access */}
        <button
          type="button"
          onClick={handleDemoLogin}
          className="flex flex-col items-center justify-center gap-0.5 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium text-navy transition-all hover:border-teal/40 hover:bg-teal/5 active:scale-[0.98]"
        >
          <span className="flex items-center gap-2">
            <DemoIcon />
            Try demo account
          </span>
          <span className="text-[11px] font-normal text-muted">
            {DEMO_EMAIL}
          </span>
        </button>

        {/* Footer */}
        <p className="mt-auto pt-10 text-center text-xs text-muted">
          New to AgOS?{" "}
          <button
            type="button"
            className="font-semibold text-teal transition-colors hover:text-teal-deep"
          >
            Request access
          </button>
        </p>
      </div>
    </MobileShell>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}

function DemoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      className="h-5 w-5 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
