import { DashboardLayout } from "@/components/dashboard-layout";
import { AssignmentDetails } from "@/components/assignments/assignment-details";

export default async function AssignmentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <DashboardLayout>
      <AssignmentDetails assignmentId={id} />
    </DashboardLayout>
  );
}
