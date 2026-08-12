"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { formatIST, formatISTCompact } from "@/lib/pulse/time";
import type { ReadingPoint } from "@/lib/pulse/analytics";

const BRAND = "#0e7a4f";
const WARNING = "#b45309";
const CRITICAL = "#dc2626";
const AXIS = "#64748b";
const GRID = "#e2e8f0";

type TooltipPoint = { ts: number; fillPct: number };

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: TooltipPoint }>;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 shadow-sm">
      <p className="text-sm font-semibold text-foreground">
        {point.fillPct}%
      </p>
      <p className="text-xs text-muted">{formatIST(new Date(point.ts).toISOString())}</p>
    </div>
  );
}

function ChartLegend() {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-4 text-xs text-muted">
      <span className="flex items-center gap-1.5">
        <span className="h-0.5 w-4 rounded-full" style={{ backgroundColor: BRAND }} />
        Fill level
      </span>
      <span className="flex items-center gap-1.5">
        <span
          className="h-0 w-4 border-t"
          style={{ borderColor: WARNING, borderStyle: "dashed" }}
        />
        80% warning
      </span>
      <span className="flex items-center gap-1.5">
        <span
          className="h-0 w-4 border-t"
          style={{ borderColor: CRITICAL, borderStyle: "dashed" }}
        />
        90% critical
      </span>
    </div>
  );
}

export function FillChart({ data }: { data: ReadingPoint[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-muted">
        No readings yet
      </div>
    );
  }

  const chartData: TooltipPoint[] = data.map((p) => ({
    ts: p.ts,
    fillPct: Math.round(p.fillPct * 10) / 10,
  }));

  return (
    <div>
      <ChartLegend />
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={BRAND} stopOpacity={0.22} />
              <stop offset="100%" stopColor={BRAND} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={GRID} vertical={false} />
          <XAxis
            dataKey="ts"
            type="number"
            domain={["dataMin", "dataMax"]}
            tickFormatter={(v: number) => formatISTCompact(v)}
            stroke={AXIS}
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            minTickGap={48}
          />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            tickFormatter={(v: number) => `${v}%`}
            stroke={AXIS}
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={36}
          />
          <ReferenceLine y={80} stroke={WARNING} strokeDasharray="4 4" strokeWidth={1} />
          <ReferenceLine y={90} stroke={CRITICAL} strokeDasharray="4 4" strokeWidth={1} />
          <Tooltip content={<ChartTooltip />} />
          <Area
            type="monotone"
            dataKey="fillPct"
            stroke={BRAND}
            strokeWidth={2}
            fill="url(#fillGradient)"
            dot={{ r: 4, fill: BRAND, stroke: "#ffffff", strokeWidth: 2 }}
            activeDot={{ r: 5, fill: BRAND, stroke: "#ffffff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
