export type FillStatus = "critical" | "warning" | "normal" | "unknown";

/**
 * The firmware reports dist_mm: 0 alongside status "sensor_err" as a sentinel
 * for "no valid reading this cycle" (fewer than 3 valid ToF zones) — not an
 * actual zero-depth (overflowing) measurement. Fill % must not be computed
 * from it, or a sensor fault renders as a false "100% full, critical" card.
 */
export function readingDistMm(
  reading:
    | { status: string | null | undefined; dist_mm: number | null | undefined }
    | null
    | undefined
): number | null {
  if (!reading || reading.status === "sensor_err") return null;
  return reading.dist_mm ?? null;
}

export function computeFillPct(
  emptyMm: number,
  distMm: number | null | undefined
): number | null {
  if (distMm == null || !Number.isFinite(emptyMm) || emptyMm <= 0) {
    return null;
  }
  const pct = ((emptyMm - distMm) / emptyMm) * 100;
  return Math.min(100, Math.max(0, pct));
}

export function fillStatus(pct: number | null): FillStatus {
  if (pct == null) return "unknown";
  if (pct >= 90) return "critical";
  if (pct >= 80) return "warning";
  return "normal";
}

export const FILL_STATUS_STYLES: Record<
  FillStatus,
  { bg: string; border: string; text: string; fill: string; label: string }
> = {
  critical: {
    bg: "bg-status-critical-bg",
    border: "border-status-critical-border",
    text: "text-status-critical",
    fill: "bg-status-critical",
    label: "Critical",
  },
  warning: {
    bg: "bg-status-warning-bg",
    border: "border-status-warning-border",
    text: "text-status-warning",
    fill: "bg-status-warning",
    label: "Warning",
  },
  normal: {
    bg: "bg-status-normal-bg",
    border: "border-status-normal-border",
    text: "text-status-normal",
    fill: "bg-status-normal",
    label: "Normal",
  },
  unknown: {
    bg: "bg-status-unknown-bg",
    border: "border-status-unknown-border",
    text: "text-status-unknown",
    fill: "bg-status-unknown",
    label: "No data",
  },
};
