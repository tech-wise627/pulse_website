import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  hintClassName,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  hintClassName?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </p>
      <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
      {hint && (
        <p className={cn("mt-1 text-xs", hintClassName ?? "text-muted")}>
          {hint}
        </p>
      )}
    </div>
  );
}
