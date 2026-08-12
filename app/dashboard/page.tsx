import { getSession } from "@/lib/data/session";
import { getActiveInstallationsWithLatestReadings } from "@/lib/data/installations";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";

export default async function DashboardPage() {
  const { client } = await getSession();
  if (!client) return null; // layout renders the "not linked" state instead

  const installations = await getActiveInstallationsWithLatestReadings(
    client.id
  );

  return <DashboardOverview initialInstallations={installations} />;
}
