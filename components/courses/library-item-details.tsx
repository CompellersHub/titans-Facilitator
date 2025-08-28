"use client";
import {
  Edit,
  Trash2,
  Download,
  ExternalLink,
  FileText,
  BookOpen,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  useCourseLibraryItem,
  useDeleteCourseLibrary,
} from "@/hooks/use-course-library";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useCourse } from "@/hooks/use-courses";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { useState } from "react";

interface LibraryItemDetailsProps {
  libraryId: string;
}

export function LibraryItemDetails({ libraryId }: LibraryItemDetailsProps) {
  const router = useRouter();
  const {
    data: libraryItem,
    isLoading,
    error,
  } = useCourseLibraryItem(libraryId);
  const { data: course } = useCourse(libraryItem?.course_id || "");
  //   const { data: course } = useCourse(libraryItem?.course_id || "", { enabled: !!libraryItem?.course_id })

  const { mutate: deleteItem, isPending: isDeleting } =
    useDeleteCourseLibrary();

  const getFileType = (filename: string) => {
    const extension = filename.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return {
          type: "PDF Document",
          color: "bg-red-100 text-red-800",
          icon: "📄",
        };
      case "doc":
      case "docx":
        return {
          type: "Word Document",
          color: "bg-blue-100 text-blue-800",
          icon: "📝",
        };
      case "ppt":
      case "pptx":
        return {
          type: "PowerPoint",
          color: "bg-orange-100 text-orange-800",
          icon: "📊",
        };
      case "jpg":
      case "jpeg":
      case "png":
        return {
          type: "Image",
          color: "bg-green-100 text-green-800",
          icon: "🖼️",
        };
      case "mp4":
      case "avi":
        return {
          type: "Video",
          color: "bg-purple-100 text-purple-800",
          icon: "🎥",
        };
      default:
        return { type: "File", color: "bg-gray-100 text-gray-800", icon: "📁" };
    }
  };

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const handleDelete = () => {
    deleteItem(libraryId, {
      onSuccess: () => {
        toast.success("Library item deleted successfully");
        setDeleteDialogOpen(false);
        window.location.assign("/library");
      },
      onError: () => {
        toast.error("Failed to delete library item");
        setDeleteDialogOpen(false);
      },
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load library item details. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return <LibraryItemDetailsSkeleton />;
  }

  if (!libraryItem) {
    return (
      <Alert>
        <AlertDescription>Library item not found.</AlertDescription>
      </Alert>
    );
  }

  const fileInfo = libraryItem.file ? getFileType(libraryItem.file) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {libraryItem.title}
          </h1>
          <p className="text-muted-foreground">Library Resource Details</p>
        </div>
        <div className="flex space-x-2">
          {/* Only one working Edit button below */}
          <Button
            variant="outline"
            onClick={() => router.push(`/library/${libraryId}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <ConfirmDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            title="Delete Library Item?"
            description="Are you sure you want to delete this resource? This action cannot be undone."
            confirmText="Delete"
            cancelText="Cancel"
            onConfirm={handleDelete}
            loading={isDeleting}
            trigger={
              <Button
                variant="outline"
                className="text-destructive bg-transparent"
                disabled={isDeleting}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            }
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Resource Preview */}
          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-emerald-600" />
                  <span>Resource Preview</span>
                </CardTitle>
                {fileInfo && (
                  <Badge className={fileInfo.color}>
                    <span className="mr-1">{fileInfo.icon}</span>
                    {fileInfo.type}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {libraryItem.file ? (
                <div className="space-y-4">
                  {fileInfo?.type === "Image" ? (
                    <div className="relative h-64 bg-gray-50 rounded-lg overflow-hidden">
                      <Image
                        src={libraryItem.file.startsWith('http') ? libraryItem.file : `https://api.titanscareers.com${libraryItem.file}`}
                        alt={libraryItem.title}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl mb-4">
                          {fileInfo?.icon || "📄"}
                        </div>
                        <p className="text-lg font-medium">
                          {fileInfo?.type || "File"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Click download to view
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex space-x-2">
                    <Button
                      className="flex-1"
                      onClick={() =>
                        window.open(
                          `https://api.titanscareers.com${libraryItem.file}`,
                          "_blank"
                        )
                      }
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download File
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        copyToClipboard(
                          `https://api.titanscareers.com${libraryItem.file}`
                        )
                      }
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : libraryItem.url ? (
                <div className="space-y-4">
                  <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🔗</div>
                      <p className="text-lg font-medium">External Link</p>
                      <p className="text-sm text-muted-foreground">
                        Click to open in new tab
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      <code className="flex-1 text-sm">{libraryItem.url}</code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(libraryItem.url)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => window.open(libraryItem.url, "_blank")}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open Link
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No file or URL associated with this resource
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Course Information */}
          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
            </CardHeader>
            <CardContent>
              {course ? (
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white text-xl font-bold">
                    {course.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{course.name}</h3>
                    <p className="text-muted-foreground mb-2">
                      {course.preview_description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Level: {course.level}</span>
                      <span>•</span>
                      <span>Price: ${course.price}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">
                    Course information not available
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Resource Details */}
          <Card>
            <CardHeader>
              <CardTitle>Resource Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Created</span>
                <span className="font-medium">
                  {libraryItem.created_at && !isNaN(new Date(libraryItem.created_at).getTime())
                    ? format(new Date(libraryItem.created_at), "MMM dd, yyyy")
                    : "Unknown date"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Type</span>
                <span className="font-medium">
                  {libraryItem.file ? "File Resource" : "External Link"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Course</span>
                <span className="font-medium">{course?.name || "Unknown"}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {libraryItem.file && (
                <Button
                  className="w-full bg-transparent"
                  variant="outline"
                  onClick={() =>
                    window.open(
                      `https://api.titanscareers.com${libraryItem.file}`,
                      "_blank"
                    )
                  }
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download File
                </Button>
              )}
              {libraryItem.url && (
                <Button
                  className="w-full bg-transparent"
                  variant="outline"
                  onClick={() => window.open(libraryItem.url, "_blank")}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Link
                </Button>
              )}
              <Button
                className="w-full bg-transparent"
                variant="outline"
                onClick={() => {
                  const link = libraryItem.file
                    ? `https://api.titanscareers.com${libraryItem.file}`
                    : libraryItem.url || "";
                  copyToClipboard(link);
                }}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Link
              </Button>
              <Button
                className="w-full bg-transparent"
                variant="outline"
                onClick={() => {
                  if (course?.id) {
                    router.push(`/courses/${course.id}`);
                  }
                }}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                View Course
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function LibraryItemDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-32 mt-2" />
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Skeleton className="h-96 w-full rounded-lg" />
        </div>
        <div>
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
