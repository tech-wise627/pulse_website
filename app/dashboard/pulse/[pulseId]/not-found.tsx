import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function PulseNotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <p className="text-sm font-medium text-foreground">Pulse not found</p>
      <p className="mt-1 max-w-sm text-sm text-muted">
        This device isn&apos;t installed at one of your sites, or the link is
        incorrect.
      </p>
      <Link href="/dashboard" className={buttonVariants({ size: "sm", className: "mt-4" })}>
        Back to overview
      </Link>
    </div>
  );
}
