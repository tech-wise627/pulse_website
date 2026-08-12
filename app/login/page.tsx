"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { login, type LoginState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";

function BrandPanel() {
  return (
    <div className="relative hidden flex-col justify-between overflow-hidden bg-brand p-10 text-brand-foreground md:flex">
      <div className="flex items-center gap-2">
        <Image
          src="/fostride-logo.webp"
          alt=""
          width={32}
          height={32}
          className="rounded-md"
        />
        <span className="text-sm font-semibold tracking-tight">
          Fostride
        </span>
      </div>

      <div>
        <h2 className="text-3xl font-bold leading-tight">Fostride Pulse</h2>
        <p className="mt-2 text-xs font-medium uppercase tracking-wide text-brand-foreground/60">
          Predictive Utilization &amp; Level Sensing Endpoint
        </p>
        <p className="mt-3 max-w-sm text-sm text-brand-foreground/80">
          Real-time fill-level monitoring for every bin you manage.
        </p>
      </div>

      <p className="text-xs text-brand-foreground/60">
        © {new Date().getFullYear()} Fostride
      </p>
    </div>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/dashboard";
  const [state, action, pending] = useActionState<LoginState, FormData>(
    login,
    undefined
  );

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="from" value={from} />

      <div className="space-y-1.5">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@company.com"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <PasswordInput
          id="password"
          name="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
        />
      </div>

      {state?.error && (
        <p
          role="alert"
          className="rounded-md border border-status-critical-border bg-status-critical-bg px-3 py-2 text-sm text-status-critical"
        >
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={pending} size="lg" className="w-full">
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="grid min-h-screen bg-background md:grid-cols-2">
      <BrandPanel />

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 md:hidden">
            <Image
              src="/fostride-logo.webp"
              alt="Fostride"
              width={40}
              height={40}
              className="mb-3 rounded-lg"
            />
          </div>

          <h1 className="text-2xl font-bold text-foreground">Sign in</h1>
          <p className="mt-1 mb-8 text-sm text-muted">
            Enter your credentials to access your Pulse dashboard.
          </p>

          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
