import { DashboardLayout } from "@/components/dashboard-layout";
import { LibraryItemDetails } from "@/components/courses/library-item-details";

export default async function LibraryItemDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <DashboardLayout>
      <LibraryItemDetails libraryId={id} />
    </DashboardLayout>
  );
}
