import { DashboardLayout } from "@/components/dashboard-layout";
import { LiveClassDetails } from "@/components/schedule/live-class-details";

export default async function LiveClassDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <DashboardLayout>
      <LiveClassDetails classId={id} />
    </DashboardLayout>
  );
}
