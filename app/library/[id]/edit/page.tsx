import { DashboardLayout } from "@/components/dashboard-layout";
import { CreateLibraryItemForm } from "@/components/courses/create-library-item-form";

export default function EditLibraryItemPage({ params }: { params: { id: string } }) {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Library Resource</h1>
          <p className="text-muted-foreground">Update your library resource details and file</p>
        </div>
        <CreateLibraryItemForm libraryId={params.id} isEditMode />
      </div>
    </DashboardLayout>
  );
}
