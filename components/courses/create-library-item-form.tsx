"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  Loader2,
  ExternalLink,
  FileText,
  LinkIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCreateCourseLibrary } from "@/hooks/use-course-library";
import type { CreateCourseLibraryData } from "@/lib/types";
import { useCourses } from "@/hooks/use-courses";

import { useCourseLibraryItem, useUpdateCourseLibrary } from "@/hooks/use-course-library";

interface CreateLibraryItemFormProps {
  libraryId?: string;
  isEditMode?: boolean;
}

export function CreateLibraryItemForm({ libraryId, isEditMode = false }: CreateLibraryItemFormProps) {
  // If in edit mode, fetch existing library item
  const { data: existingItem, isLoading: isLoadingItem } = useCourseLibraryItem(libraryId || "", { enabled: !!libraryId && isEditMode });
  const { mutate: updateLibraryItem, isPending: isUpdating, error: updateError } = useUpdateCourseLibrary();
  const [title, setTitle] = useState<string>(existingItem?.title || "");
  // Always use course_id for selectedCourse, fallback to empty string
  const [selectedCourse, setSelectedCourse] = useState<string>(
    isEditMode && existingItem?.course_id ? existingItem.course_id : ""
  );
  const [resourceType, setResourceType] = useState<"file" | "url">(
    existingItem?.file ? "file" : existingItem?.url ? "url" : "file"
  );
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string>("");
  const [url, setUrl] = useState<string>(existingItem?.url || "");
  // Removed uploading state, no longer needed

  const router = useRouter();
  const {
    mutate: createLibraryItem,
    isPending,
    error,
  } = useCreateCourseLibrary();
  const { data: courses, isLoading: coursesLoading } = useCourses();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !selectedCourse) return;

    // Always include course ID in payload
    const libraryData: CreateCourseLibraryData = {
      title,
      course: selectedCourse || existingItem?.course_id || "",
      ...(resourceType === "file" && file ? { file } : {}),
      ...(resourceType === "url" && url ? { url } : {}),
    };

    if (isEditMode && libraryId) {
      updateLibraryItem({ libraryId, data: libraryData }, {
        onSuccess: () => {
          router.push("/library");
        },
      });
    } else {
      createLibraryItem(libraryData, {
        onSuccess: () => {
          router.push("/library");
        },
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileUrl("");
    }
  };

  const isFormValid =
    title &&
    selectedCourse &&
    ((resourceType === "file" && (file || (isEditMode && existingItem?.file))) || (resourceType === "url" && url));

  if (error || updateError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error?.message || updateError?.message}</AlertDescription>
      </Alert>
    );
  }

  if (isEditMode && isLoadingItem) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-emerald-600" />
            <span>{isEditMode ? "Edit Library Resource" : "Add Library Resource"}</span>
          </CardTitle>
          <CardDescription>
            {isEditMode ? "Update your library resource details and file" : "Add a new file or external link to your course library"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            )}

            {/* Basic Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Resource Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter a descriptive title for this resource"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="course">Select Course *</Label>
                <Select
                  value={selectedCourse}
                  onValueChange={setSelectedCourse}
                  disabled={coursesLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose which course this resource belongs to" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses?.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-sm flex items-center justify-center text-white text-xs font-bold">
                            {course.name.charAt(0)}
                          </div>
                          <span>{course.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Resource Type Selection */}
            <div className="space-y-4">
              <Label>Resource Type *</Label>
              <Tabs
                value={resourceType}
                onValueChange={(value) =>
                  setResourceType(value as "file" | "url")
                }
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                    value="file"
                    className="flex items-center space-x-2"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Upload File</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="url"
                    className="flex items-center space-x-2"
                  >
                    <LinkIcon className="h-4 w-4" />
                    <span>External Link</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="file" className="space-y-4">
                  <Card className="border-2 border-dashed border-muted-foreground/25">
                    <CardContent className="p-6">
                      <div className="text-center space-y-4">
                        <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                          <Upload className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Upload a file</h3>
                          <p className="text-sm text-muted-foreground">
                            PDF, DOC, PPT, images, videos and more
                          </p>
                        </div>
                        <div>
                          <Input
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                            id="file-upload"
                            accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.mp4,.avi,.txt,.zip"
                          />
                          <Label
                            htmlFor="file-upload"
                            className="cursor-pointer"
                          >
                            <Button type="button" variant="outline" asChild>
                              <span>Choose File</span>
                            </Button>
                          </Label>
                        </div>
                        {file && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-center space-x-2 text-sm">
                              <FileText className="h-4 w-4" />
                              <span className="font-medium">{file.name}</span>
                              <span className="text-muted-foreground">
                                ({(file.size / 1024 / 1024).toFixed(2)} MB)
                              </span>
                              {/* Removed uploading spinner, uploading state is gone */}
                              {fileUrl && (
                                <span className="text-xs text-green-600 ml-2">Uploaded</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="url" className="space-y-4">
                  <Card>
                    <CardContent className="p-6 space-y-4">
                      <div className="text-center space-y-2">
                        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <ExternalLink className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Add external link</h3>
                          <p className="text-sm text-muted-foreground">
                            Link to external resources, websites, or documents
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="url">Resource URL *</Label>
                        <div className="relative">
                          <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="url"
                            type="url"
                            placeholder="https://example.com/resource"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="pl-10"
                            required={resourceType === "url"}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4 pt-6">
              <Button
                type="submit"
                disabled={!isFormValid || isPending}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditMode ? "Updating Resource..." : "Adding Resource..."}
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    {isEditMode ? "Update Resource" : "Add to Library"}
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
