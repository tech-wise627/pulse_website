"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type ConnectionState = "connecting" | "live" | "offline";

export function RealtimeStatus({ className }: { className?: string }) {
  const [state, setState] = useState<ConnectionState>("connecting");

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("connection-heartbeat")
      .subscribe((status) => {
        if (status === "SUBSCRIBED") setState("live");
        else if (
          status === "CHANNEL_ERROR" ||
          status === "TIMED_OUT" ||
          status === "CLOSED"
        )
          setState("offline");
        else setState("connecting");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const dotClass =
    state === "live"
      ? "bg-status-normal"
      : state === "offline"
        ? "bg-status-critical"
        : "bg-status-warning";

  const label =
    state === "live"
      ? "Live"
      : state === "offline"
        ? "Reconnecting…"
        : "Connecting…";

  return (
    <div className={cn("flex items-center gap-1.5 text-xs text-muted", className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", dotClass)} />
      {label}
    </div>
  );
}
