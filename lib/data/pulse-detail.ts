import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type Installation = Database["public"]["Tables"]["installations"]["Row"];
type Reading = Database["public"]["Tables"]["readings"]["Row"];

export async function getPulseDetail(
  clientId: string,
  pulseId: string
): Promise<{ installation: Installation; readings: Reading[] } | null> {
  const supabase = await createClient();

  const { data: installation } = await supabase
    .from("installations")
    .select("*")
    .eq("pulse_id", pulseId)
    .eq("client_id", clientId)
    .is("removed_at", null)
    .maybeSingle();

  if (!installation) return null;

  const { data: readings } = await supabase
    .from("readings")
    .select("*")
    .eq("pulse_id", pulseId)
    .order("server_ts", { ascending: true });

  return { installation, readings: readings ?? [] };
}
