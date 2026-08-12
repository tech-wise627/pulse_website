import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type Installation = Database["public"]["Tables"]["installations"]["Row"];
type Reading = Database["public"]["Tables"]["readings"]["Row"];

export type InstallationWithLatestReading = Installation & {
  latestReading: Reading | null;
};

export async function getActiveInstallationsWithLatestReadings(
  clientId: string
): Promise<InstallationWithLatestReading[]> {
  const supabase = await createClient();

  const { data: installations } = await supabase
    .from("installations")
    .select("*")
    .eq("client_id", clientId)
    .is("removed_at", null)
    .order("installed_at", { ascending: true });

  if (!installations || installations.length === 0) {
    return [];
  }

  const withReadings = await Promise.all(
    installations.map(async (installation) => {
      const { data: latestReading } = await supabase
        .from("readings")
        .select("*")
        .eq("pulse_id", installation.pulse_id)
        .order("server_ts", { ascending: false })
        .limit(1)
        .maybeSingle();

      return { ...installation, latestReading: latestReading ?? null };
    })
  );

  return withReadings;
}
