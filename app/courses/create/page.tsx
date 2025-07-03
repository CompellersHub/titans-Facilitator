import { DashboardLayout } from "@/components/dashboard-layout"
import { CreateCourseForm } from "@/components/courses/create-course-form"

export default function CreateCourse() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Course</h1>
          <p className="text-muted-foreground">Create a comprehensive course for your students</p>
        </div>
        <CreateCourseForm />
      </div>
    </DashboardLayout>
  )
}
