import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getSession } from "@/lib/data/session";
import { getPulseDetail } from "@/lib/data/pulse-detail";
import {
  buildFillSeries,
  lastSegment,
  lastEmptiedAt,
  estimateTimeToFull,
} from "@/lib/pulse/analytics";
import { fillStatus, FILL_STATUS_STYLES } from "@/lib/pulse/fill";
import { formatIST } from "@/lib/pulse/time";
import { FillChart } from "@/components/dashboard/fill-chart";
import { StatCard } from "@/components/dashboard/stat-card";
import { cn } from "@/lib/utils";

export default async function PulseDetailPage(
  props: PageProps<"/dashboard/pulse/[pulseId]">
) {
  const { pulseId } = await props.params;
  const { client } = await getSession();
  if (!client) return null;

  const detail = await getPulseDetail(client.id, pulseId);
  if (!detail) notFound();

  const { installation, readings } = detail;
  const series = buildFillSeries(readings, installation.empty_mm);
  const segment = lastSegment(series);
  const estimate = estimateTimeToFull(segment);
  const emptiedAt = lastEmptiedAt(series);

  const latest = series[series.length - 1] ?? null;
  const latestReading = readings[readings.length - 1] ?? null;
  const pct = latest?.fillPct ?? null;
  const status = fillStatus(pct);
  const styles = FILL_STATUS_STYLES[status];

  const location =
    [installation.premise_name, installation.building, installation.floor]
      .filter(Boolean)
      .join(" · ") || installation.location_key;

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to overview
        </Link>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span className="rounded-md bg-muted-surface px-2.5 py-1 font-mono text-sm font-semibold text-foreground">
            {installation.pulse_id}
          </span>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-medium",
              styles.bg,
              styles.text
            )}
          >
            {styles.label}
          </span>
          {latestReading?.status && latestReading.status !== "ok" && (
            <span className="rounded-full bg-status-critical-bg px-2 py-0.5 text-xs font-medium text-status-critical">
              {latestReading.status}
            </span>
          )}
        </div>

        <p className="mt-2 text-sm text-muted">
          {location}
          {installation.city ? `, ${installation.city}` : ""}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Current fill"
          value={pct == null ? "—" : `${Math.round(pct)}%`}
          hint={styles.label}
          hintClassName={styles.text}
        />
        <StatCard
          label="Fill rate"
          value={
            estimate.kind === "estimated"
              ? `${estimate.ratePctPerHour.toFixed(1)}%/hr`
              : "—"
          }
          hint={
            estimate.kind === "not_filling"
              ? "Not currently filling"
              : estimate.kind === "insufficient_data"
                ? "Insufficient data"
                : undefined
          }
        />
        <StatCard
          label="Estimated full"
          value={
            estimate.kind === "estimated"
              ? formatIST(new Date(estimate.estimatedFullAt).toISOString())
              : "—"
          }
        />
        <StatCard
          label="Last emptied"
          value={emptiedAt ? formatIST(new Date(emptiedAt).toISOString()) : "No data"}
        />
      </div>

      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="mb-4 text-sm font-semibold text-foreground">
          Fill level over time
        </h2>
        <FillChart data={series} />
      </div>

      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="mb-4 text-sm font-semibold text-foreground">Device</h2>
        <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-muted">Battery</dt>
            <dd className="mt-1 font-medium text-foreground">
              {latestReading?.batt_mv != null
                ? `${(latestReading.batt_mv / 1000).toFixed(2)}V`
                : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-muted">Signal</dt>
            <dd className="mt-1 font-medium text-foreground">
              {latestReading?.rssi != null ? `${latestReading.rssi} dBm` : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-muted">Firmware</dt>
            <dd className="mt-1 font-medium text-foreground">
              {latestReading?.fw_version ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="text-muted">Readings</dt>
            <dd className="mt-1 font-medium text-foreground">
              {readings.length}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
