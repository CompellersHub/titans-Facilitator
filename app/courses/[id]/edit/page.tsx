import { DashboardLayout } from "@/components/dashboard-layout";
import { CreateCourseForm } from "@/components/courses/create-course-form";

export default async function EditCoursePage({ params }: { params: { id: string } }) {
  // Fetch course data using the id
  // You may want to fetch the course server-side or client-side depending on your data fetching strategy
  // For now, we'll assume client-side fetching in the form
  return (
    <DashboardLayout>
      <CreateCourseForm courseId={params.id} />
    </DashboardLayout>
  );
}
