import { DashboardLayout } from "@/components/dashboard-layout";
import { AssignmentDetails } from "@/components/assignments/assignment-details";

export default function AssignmentDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <DashboardLayout>
      <AssignmentDetails assignmentId={params.id} />
    </DashboardLayout>
  );
}
