import { DashboardLayout } from "@/components/dashboard-layout";
import { CreateLibraryItemForm } from "@/components/courses/create-library-item-form";

export default function CreateLibraryItem() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Add Library Resource
          </h1>
          <p className="text-muted-foreground">
            Add a new resource to your course library
          </p>
        </div>
        <CreateLibraryItemForm />
      </div>
    </DashboardLayout>
  );
}
