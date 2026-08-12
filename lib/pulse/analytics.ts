import { computeFillPct, readingDistMm } from "@/lib/pulse/fill";
import type { Database } from "@/lib/supabase/types";

type Reading = Database["public"]["Tables"]["readings"]["Row"];

export type ReadingPoint = {
  ts: number; // epoch ms
  distMm: number;
  fillPct: number;
  status: string | null;
};

const HOUR_MS = 3_600_000;

/** A reset (bin emptied/collected) requires BOTH a big relative drop AND
 * landing near-empty afterward — emptying a bin means it becomes empty,
 * not just "somewhat less full than the last reading." Requiring only the
 * drop misfires on ordinary reading-to-reading jitter that dips while the
 * bin is still objectively quite full (e.g. 97% -> 76% is noise, not a
 * collection event). */
const RESET_DROP_THRESHOLD_PCT = 15;
const RESET_MAX_PCT_AFTER = 25;

const MIN_POINTS_FOR_TREND = 3;
const MIN_SPAN_HOURS_FOR_TREND = 0.5;

export function buildFillSeries(
  readings: Reading[],
  emptyMm: number
): ReadingPoint[] {
  return readings
    .map((reading) => {
      const dist = readingDistMm(reading);
      const pct = computeFillPct(emptyMm, dist);
      if (dist == null || pct == null) return null;
      const ts = new Date(reading.device_ts ?? reading.server_ts).getTime();
      if (!Number.isFinite(ts)) return null;
      return { ts, distMm: dist, fillPct: pct, status: reading.status };
    })
    .filter((p): p is ReadingPoint => p !== null)
    .sort((a, b) => a.ts - b.ts);
}

function isResetPoint(prev: ReadingPoint, curr: ReadingPoint): boolean {
  return (
    curr.fillPct < prev.fillPct - RESET_DROP_THRESHOLD_PCT &&
    curr.fillPct <= RESET_MAX_PCT_AFTER
  );
}

/** Points since the most recent "emptied" reset, for trend fitting. */
export function lastSegment(points: ReadingPoint[]): ReadingPoint[] {
  let start = 0;
  for (let i = 1; i < points.length; i++) {
    if (isResetPoint(points[i - 1], points[i])) {
      start = i;
    }
  }
  return points.slice(start);
}

export function lastEmptiedAt(points: ReadingPoint[]): number | null {
  for (let i = points.length - 1; i > 0; i--) {
    if (isResetPoint(points[i - 1], points[i])) {
      return points[i].ts;
    }
  }
  return null;
}

export type FillEstimate =
  | { kind: "insufficient_data" }
  | { kind: "not_filling" }
  | {
      kind: "estimated";
      ratePctPerHour: number;
      hoursToFull: number;
      estimatedFullAt: number;
    };

/** Least-squares linear regression of fill % against time, projected
 * forward from the latest actual reading (not from the fitted line's own
 * intercept) so the estimate always anchors to where the bin really is now. */
export function estimateTimeToFull(points: ReadingPoint[]): FillEstimate {
  if (points.length < MIN_POINTS_FOR_TREND) return { kind: "insufficient_data" };

  const t0 = points[0].ts;
  const xs = points.map((p) => (p.ts - t0) / HOUR_MS);
  const ys = points.map((p) => p.fillPct);
  const n = points.length;
  const spanHours = xs[xs.length - 1];
  if (spanHours < MIN_SPAN_HOURS_FOR_TREND) return { kind: "insufficient_data" };

  const sumX = xs.reduce((a, x) => a + x, 0);
  const sumY = ys.reduce((a, y) => a + y, 0);
  const sumXY = xs.reduce((a, x, i) => a + x * ys[i], 0);
  const sumXX = xs.reduce((a, x) => a + x * x, 0);
  const denom = n * sumXX - sumX * sumX;
  if (denom === 0) return { kind: "insufficient_data" };

  const slope = (n * sumXY - sumX * sumY) / denom; // % per hour
  if (slope <= 0.01) return { kind: "not_filling" };

  const latest = points[points.length - 1];
  const hoursToFull = (100 - latest.fillPct) / slope;
  const estimatedFullAt = latest.ts + hoursToFull * HOUR_MS;

  return { kind: "estimated", ratePctPerHour: slope, hoursToFull, estimatedFullAt };
}
