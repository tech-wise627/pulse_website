"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <p className="text-sm font-medium text-foreground">
        Something went wrong loading this page
      </p>
      <p className="mt-1 text-sm text-muted">
        Try again, or refresh if the problem continues.
      </p>
      <Button onClick={() => reset()} className="mt-4" size="sm">
        Try again
      </Button>
    </div>
  );
}
