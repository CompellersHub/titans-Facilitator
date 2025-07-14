import { DashboardLayout } from "@/components/dashboard-layout";
import { StudentDetails } from "@/components/students/student-details";

export default async function StudentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <DashboardLayout>
      <StudentDetails studentId={id} />
    </DashboardLayout>
  );
}
