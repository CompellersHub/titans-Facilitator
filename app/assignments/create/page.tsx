import { DashboardLayout } from "@/components/dashboard-layout";
import { CreateAssignmentForm } from "@/components/assignments/create-assignment-form";

export default function CreateAssignment() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="mx-auto">
          <h1 className="text-3xl font-bold tracking-tight text-center">
            Create Assignment
          </h1>
          <p className="text-muted-foreground text-center">
            Create a new assignment for your students
          </p>
        </div>
        <CreateAssignmentForm />
      </div>
    </DashboardLayout>
  );
}
