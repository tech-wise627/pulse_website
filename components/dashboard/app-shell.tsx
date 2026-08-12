import type { ReactNode } from "react";
import Image from "next/image";
import { logout } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { RealtimeStatus } from "@/components/dashboard/realtime-status";

function initials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]!.toUpperCase())
      .join("") || "?"
  );
}

export function AppShell({
  clientName,
  userEmail,
  children,
}: {
  clientName: string | null;
  userEmail: string;
  children: ReactNode;
}) {
  const displayName = clientName ?? userEmail;

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-60 flex-col border-r border-border bg-surface md:flex">
        <div className="flex items-center gap-2 px-5 py-5">
          <Image
            src="/fostride-logo.webp"
            alt="Fostride"
            width={28}
            height={28}
            className="rounded-md"
          />
          <span className="text-sm font-bold tracking-tight text-foreground">
            Pulse
          </span>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          <span className="flex items-center gap-2 rounded-md bg-muted-surface px-3 py-2 text-sm font-medium text-foreground">
            Overview
          </span>
        </nav>

        <div className="border-t border-border p-3">
          <RealtimeStatus className="mb-2 px-3" />
          <form action={logout}>
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="w-full justify-start"
            >
              Sign out
            </Button>
          </form>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <Image
              src="/fostride-logo.webp"
              alt="Fostride"
              width={24}
              height={24}
              className="rounded-md md:hidden"
            />
            <div>
              <h1 className="text-base font-bold text-foreground sm:text-lg">
                Overview
              </h1>
              <p className="hidden text-sm text-muted sm:block">
                Live status of every Pulse installation
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-foreground">
                {displayName}
              </p>
              <p className="text-xs text-muted">{userEmail}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-semibold text-brand-foreground">
              {initials(displayName)}
            </div>
            <form action={logout} className="md:hidden">
              <Button type="submit" variant="ghost" size="sm">
                Sign out
              </Button>
            </form>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
