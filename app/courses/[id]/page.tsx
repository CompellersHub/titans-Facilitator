import { DashboardLayout } from "@/components/dashboard-layout";
import { CourseDetails } from "@/components/courses/course-details";

export default async function CourseDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <DashboardLayout>
      <CourseDetails courseId={id} />
    </DashboardLayout>
  );
}
