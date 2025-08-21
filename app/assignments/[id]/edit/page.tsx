import { DashboardLayout } from "@/components/dashboard-layout";
import { CreateAssignmentForm } from "@/components/assignments/create-assignment-form";

export default function EditAssignmentPage({ params }: { params: { id: string } }) {
  // Pass assignmentId to the form for editing
  return (
    <DashboardLayout>
      <CreateAssignmentForm assignmentId={params.id} />
    </DashboardLayout>
  );
}
