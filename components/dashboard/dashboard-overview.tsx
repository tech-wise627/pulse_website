"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { computeFillPct, fillStatus, readingDistMm } from "@/lib/pulse/fill";
import type { InstallationWithLatestReading } from "@/lib/data/installations";
import type { Database } from "@/lib/supabase/types";
import { StatCard } from "@/components/dashboard/stat-card";
import { BinCard } from "@/components/dashboard/bin-card";

type Reading = Database["public"]["Tables"]["readings"]["Row"];

export function DashboardOverview({
  initialInstallations,
}: {
  initialInstallations: InstallationWithLatestReading[];
}) {
  const [installations, setInstallations] = useState(initialInstallations);

  useEffect(() => {
    setInstallations(initialInstallations);
  }, [initialInstallations]);

  useEffect(() => {
    const pulseIds = new Set(initialInstallations.map((i) => i.pulse_id));
    if (pulseIds.size === 0) return;

    const supabase = createClient();
    const channel = supabase
      .channel("dashboard-readings")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "readings" },
        (payload) => {
          const reading = payload.new as Reading;
          if (!pulseIds.has(reading.pulse_id)) return;

          setInstallations((prev) =>
            prev.map((installation) =>
              installation.pulse_id === reading.pulse_id
                ? { ...installation, latestReading: reading }
                : installation
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialInstallations]);

  const statuses = installations.map((installation) =>
    fillStatus(
      computeFillPct(
        installation.empty_mm,
        readingDistMm(installation.latestReading)
      )
    )
  );
  const critical = statuses.filter((s) => s === "critical").length;
  const warning = statuses.filter((s) => s === "warning").length;
  const reporting = installations.filter((i) => i.latestReading).length;
  const errors = installations.filter(
    (i) => !!i.latestReading?.status && i.latestReading.status !== "ok"
  ).length;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Installations"
          value={installations.length}
          hint={`${reporting} reporting`}
        />
        <StatCard
          label="Critical (≥90%)"
          value={critical}
          hint={critical > 0 ? "Needs collection" : "None"}
          hintClassName={critical > 0 ? "text-status-critical" : undefined}
        />
        <StatCard
          label="Warning (≥80%)"
          value={warning}
          hint={warning > 0 ? "Approaching full" : "None"}
          hintClassName={warning > 0 ? "text-status-warning" : undefined}
        />
        <StatCard
          label="Sensor errors"
          value={errors}
          hint={errors > 0 ? "Check device status" : "All healthy"}
          hintClassName={errors > 0 ? "text-status-critical" : undefined}
        />
      </div>

      <div>
        <h2 className="mb-4 text-sm font-semibold text-foreground">
          Installations
        </h2>
        {installations.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-surface p-10 text-center">
            <p className="text-sm font-medium text-foreground">
              No active installations yet
            </p>
            <p className="mt-1 text-sm text-muted">
              Pulse devices installed at your sites will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {installations.map((installation) => (
              <BinCard key={installation.id} installation={installation} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
