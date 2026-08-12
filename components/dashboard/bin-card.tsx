import Link from "next/link";
import { Battery, Cpu, Signal } from "lucide-react";
import {
  computeFillPct,
  fillStatus,
  readingDistMm,
  FILL_STATUS_STYLES,
} from "@/lib/pulse/fill";
import { formatIST } from "@/lib/pulse/time";
import type { InstallationWithLatestReading } from "@/lib/data/installations";
import { cn } from "@/lib/utils";

export function BinCard({
  installation,
}: {
  installation: InstallationWithLatestReading;
}) {
  const { pulse_id, empty_mm, latestReading } = installation;
  const pct = computeFillPct(empty_mm, readingDistMm(latestReading));
  const status = fillStatus(pct);
  const styles = FILL_STATUS_STYLES[status];
  const hasError =
    !!latestReading?.status && latestReading.status !== "ok";

  const location =
    [installation.premise_name, installation.building, installation.floor]
      .filter(Boolean)
      .join(" · ") || installation.location_key;

  const battV =
    latestReading?.batt_mv != null
      ? `${(latestReading.batt_mv / 1000).toFixed(2)}V`
      : null;
  const rssi =
    latestReading?.rssi != null ? `${latestReading.rssi} dBm` : null;
  const fw = latestReading?.fw_version ?? null;

  return (
    <Link
      href={`/dashboard/pulse/${installation.pulse_id}`}
      className={cn(
        "block rounded-xl border bg-surface p-5 transition-colors hover:border-brand",
        styles.border
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="rounded-md bg-muted-surface px-2 py-1 font-mono text-xs font-semibold text-foreground">
          {pulse_id}
        </span>
        {hasError && (
          <span className="rounded-full bg-status-critical-bg px-2 py-0.5 text-[11px] font-medium text-status-critical">
            {latestReading?.status}
          </span>
        )}
      </div>

      <p className="mt-3 text-sm font-medium text-foreground">{location}</p>
      {installation.city && (
        <p className="text-xs text-muted">{installation.city}</p>
      )}

      <div className="mt-4">
        <div className="flex items-baseline justify-between">
          <span className={cn("text-2xl font-bold", styles.text)}>
            {pct == null ? "—" : `${Math.round(pct)}%`}
          </span>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[11px] font-medium",
              styles.bg,
              styles.text
            )}
          >
            {styles.label}
          </span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted-surface">
          <div
            className={cn("h-full rounded-full transition-all", styles.fill)}
            style={{ width: `${pct ?? 0}%` }}
          />
        </div>
      </div>

      {latestReading && (battV || rssi || fw) && (
        <div className="mt-4 flex items-center gap-4 border-t border-border pt-3 text-xs text-muted">
          {battV && (
            <span className="flex items-center gap-1">
              <Battery className="h-3.5 w-3.5" /> {battV}
            </span>
          )}
          {rssi && (
            <span className="flex items-center gap-1">
              <Signal className="h-3.5 w-3.5" /> {rssi}
            </span>
          )}
          {fw && (
            <span className="flex items-center gap-1">
              <Cpu className="h-3.5 w-3.5" /> {fw}
            </span>
          )}
        </div>
      )}

      <p className="mt-3 text-xs text-muted">
        Last reading:{" "}
        {latestReading ? formatIST(latestReading.server_ts) : "No data yet"}
      </p>
    </Link>
  );
}
