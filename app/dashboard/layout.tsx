import type { Metadata } from "next";
import { getSession } from "@/lib/data/session";
import { AppShell } from "@/components/dashboard/app-shell";
import { logout } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Overview — Fostride Pulse",
};

export default async function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  const { user, client } = await getSession();

  if (!client) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-6 text-center">
          <p className="text-sm font-medium text-foreground">
            Your account isn&apos;t linked to a client yet
          </p>
          <p className="mt-2 text-sm text-muted">
            Signed in as {user.email}. Contact an admin to finish setting up
            this login.
          </p>
          <form action={logout} className="mt-4">
            <Button type="submit" variant="outline" size="sm" className="w-full">
              Sign out
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <AppShell clientName={client.name} userEmail={user.email ?? ""}>
      {children}
    </AppShell>
  );
}
