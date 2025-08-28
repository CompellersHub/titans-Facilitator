/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  BookOpen,
  Play,
  Clock,
  Users,
  Target,
  BookOpenCheck,
  GraduationCap,
} from "lucide-react";
import Image from "next/image";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Plus, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MediaUpload } from "@/components/ui/media-upload";
import {
  useCreateCourse,
  useCourseCategories,
  useCourseModules,
  useCreateCategory,
} from "@/hooks/use-courses";
import { useS3Upload } from "@/hooks/use-s3-upload";
import { S3_FOLDERS, type S3FolderType } from "@/lib/s3-config";
import type {
  CourseCurriculum,
  CourseModule,
  CourseVideo,
  CreateCourseData,
} from "@/lib/types";

interface CreateCourseFormProps {
  courseId?: string;
}

import { useEffect } from "react";
import { useCourse } from "@/hooks/use-courses";

export function CreateCourseForm({ courseId }: CreateCourseFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<CreateCourseData>>({
    name: "",
    preview_description: "",
    description: "",
    price: 0,
    original_price: 0,
    estimated_time: "",
    level: "beginner",
    curriculum: [],
  });

  // Load course data if editing
  const { data: course } = useCourse(courseId!);
  useEffect(() => {
    if (courseId && course) {
      setFormData({
        ...course,
        category: course.category ? { id: course.category.id, name: course.category.name } : undefined,
        curriculum: course.curriculum || [],
      });
      // Optionally set other state like targetAudience, learningOutcomes, requiredMaterials if present in course
    }
  }, [courseId, course]);

  // Separate state for dynamic arrays - exactly 4 items each as required by API
  const [targetAudience, setTargetAudience] = useState<string[]>([""]);
  const [learningOutcomes, setLearningOutcomes] = useState<string[]>([""]);
  const [requiredMaterials, setRequiredMaterials] = useState<string[]>([""]);

  const [newCategoryName, setNewCategoryName] = useState("");

  const router = useRouter();
  const { mutate: createCourse, isPending, error } = useCreateCourse();
  const { data: categories } = useCourseCategories();
  const { data: modules } = useCourseModules();
  const { mutate: createCategory } = useCreateCategory();
  const { uploadFile, getUploadState, clearError, cancelUpload, removeFile } =
    useS3Upload();

  const steps = [
    {
      id: "basic",
      title: "Basic Information",
      description: "Course name, description, and media",
    },
    {
      id: "curriculum",
      title: "Curriculum",
      description: "Course modules and content structure",
    },
    {
      id: "details",
      title: "Course Details",
      description: "Audience, outcomes, and requirements",
    },
    {
      id: "review",
      title: "Review",
      description: "Review and submit your course",
    },
  ];

  const handleFileUpload = async (
    file: File,
    field: string,
    folder: S3FolderType
  ) => {
    try {
      // Clear any previous errors for this field
      clearError(field);

      const url = await uploadFile(file, folder, field);
      if (url) {
        setFormData((prev) => ({ ...prev, [field]: url }));
      }
      return url;
    } catch (error) {
      console.error("Upload failed:", error);
      return null;
    }
  };

  const handleVideoUpload = async (
    file: File,
    field: string,
    folder: S3FolderType
  ) => {
    try {
      // Clear any previous errors for this field
      clearError(field);

      const url = await uploadFile(file, folder, field);
      return url;
    } catch (error) {
      console.error("Upload failed:", error);
      return null;
    }
  };

  const handleCancelUpload = (field: string) => {
    cancelUpload(field);
  };

  const handleRemoveFile = async (field: string) => {
    const currentUrl = formData[field as keyof typeof formData] as string;
    const success = await removeFile(field, currentUrl);
    if (success) {
      setFormData((prev) => ({ ...prev, [field]: null }));
    }
  };

  const addCurriculumModule = () => {
    const newModule: CourseCurriculum = {
      title: "",
      order: formData.curriculum?.length || 0,
      video: [],
      course_note: {
        title: "",
        description: null,
        note_file: null,
      },
    };
    setFormData((prev) => ({
      ...prev,
      curriculum: [...(prev.curriculum || []), newModule],
    }));
  };

  const removeCurriculumModule = () => {
    setFormData((prev) => ({
      ...prev,
      curriculum: prev.curriculum?.slice(0, -1),
    }));
  };

  const updateCurriculumModule = (
    index: number,
    updates: Partial<CourseCurriculum>
  ) => {
    setFormData((prev) => ({
      ...prev,
      curriculum: prev.curriculum?.map((module, i) =>
        i === index ? { ...module, ...updates } : module
      ),
    }));
    console.log("Updated Curriculum Module:", { index, updates });
  };

  const addVideoToModule = (moduleIndex: number) => {
    const newVideo: CourseVideo = {
      title: "",
      duration: "",
      description: "",
      video_file: null,
    };
    setFormData((prev) => ({
      ...prev,
      curriculum: prev.curriculum?.map((module, i) =>
        i === moduleIndex
          ? { ...module, video: [...module.video, newVideo] }
          : module
      ),
    }));
  };

  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      createCategory(
        { name: newCategoryName.trim() },
        {
          onSuccess: (newCategory) => {
            // Auto select the newly created category
            setFormData((prev: any) => ({
              ...prev,
              category: { id: newCategory.id, name: newCategory.name },
            }));
            setNewCategoryName("");
          },
        }
      );
    }
  };

  const handleSubmit = () => {
    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.original_price ||
      !formData.category ||
      !formData.category.id
    ) {
      console.error("Missing required fields");
      return;
    }

    // Validate that we have at least one non-empty value in each required array
    const hasValidTargetAudience = targetAudience.some(
      (item) => item && item.trim()
    );
    const hasValidLearningOutcomes = learningOutcomes.some(
      (item) => item && item.trim()
    );
    const hasValidRequiredMaterials = requiredMaterials.some(
      (item) => item && item.trim()
    );

    if (!hasValidTargetAudience) {
      console.error("At least one target audience is required");
      return;
    }
    if (!hasValidLearningOutcomes) {
      console.error("At least one learning outcome is required");
      return;
    }
    if (!hasValidRequiredMaterials) {
      console.error("At least one required material is required");
      return;
    }

    console.log(formData.curriculum);

    // Validate curriculum modules and videos
    if (formData.curriculum) {
      for (let i = 0; i < formData.curriculum.length; i++) {
        const curriculumModule = formData.curriculum[i];
        if (!curriculumModule.title.trim()) {
          console.error(`Module ${i + 1} title is required`);
          return;
        }
        // Ensure course_note has proper structure
        if (!curriculumModule.course_note?.title?.trim()) {
          console.error(`Module ${i + 1} course note title is required`);
          return;
        }
        for (let j = 0; j < curriculumModule.video.length; j++) {
          const video = curriculumModule.video[j];
          if (!video.title.trim()) {
            console.error(
              `Video ${j + 1} in module ${i + 1} title is required`
            );
            return;
          }
        }
      }
    }

    // Convert arrays to Record<string, string> format - ensure exactly 4 entries
    const convertArrayToRecord = (arr: string[], prefix: string) => {
      const record: Record<string, string> = {};

      // Always create exactly 4 entries as required by API
      for (let i = 0; i < 4; i++) {
        const value = arr[i]?.trim() || "";
        record[`${prefix}${i + 1}`] = value;
      }

      return record;
    };

    // Process curriculum to ensure course_note description is handled properly
    const processedCurriculum =
      formData.curriculum?.map((module) => ({
        ...module,
        course_note: {
          title: module.course_note?.title?.trim() || "Course Notes",
          description: module.course_note?.description || null,
          note_file: module.course_note?.note_file || null,
        },
      })) || [];

    const courseData: CreateCourseData = {
      ...formData,
      curriculum: processedCurriculum,
      target_audience: convertArrayToRecord(targetAudience, "audience"),
      learning_outcomes: convertArrayToRecord(learningOutcomes, "outcome"),
      required_materials: convertArrayToRecord(requiredMaterials, "name"),
      instructor: { user_id: "2" }, // Current user ID
    } as CreateCourseData;

    console.log("Submitting course data:", courseData);

    createCourse(courseData, {
      onSuccess: () => {
        router.push("/courses");
      },
    });
  };

  const canProceed = (step: number) => {
    switch (step) {
      case 0:
        return (
          formData.name &&
          formData.description &&
          formData.preview_description &&
          formData.price !== undefined &&
          formData.price > 0 &&
          formData.original_price !== undefined &&
          formData.original_price > 0 &&
          formData.category &&
          formData.category.id
        );
      case 1:
        return (
          formData.curriculum &&
          formData.curriculum.length > 0 &&
          formData.curriculum.every(
            (module) =>
              module.title &&
              module.title.trim() &&
              // module.video.length > 0 &&
              // module.video.every(
              //   (video) => video.title && video.title.trim()
              // ) &&
              module.course_note &&
              module.course_note.title &&
              module.course_note.title.trim() &&
              (!module.course_note.description ||
                Object.values(module.course_note.description).every(
                  (desc) => desc && desc.trim()
                ))
          )
        );
      case 2:
        return (
          targetAudience.every((item) => item && item.trim()) &&
          learningOutcomes.every((item) => item && item.trim()) &&
          requiredMaterials.every((item) => item && item.trim())
        );
      default:
        return true;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Custom Back Arrow Button - Blue in all modes */}
      <div
        className="flex gap-1 bg-blue-100 dark:bg-blue-900 p-1 w-fit rounded-md text-sm mb-2 cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
        onClick={() => router.back()}
        title="Go Back"
      >
        <ArrowLeft className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      </div>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentStep
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-0.5 ${
                    index < currentStep ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold">{steps[currentStep].title}</h2>
          <p className="text-muted-foreground">
            {steps[currentStep].description}
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="p-6">
          {currentStep === 0 && (
            <BasicInformationStep
              formData={formData}
              setFormData={setFormData}
              categories={categories}
              handleFileUpload={handleFileUpload}
              getUploadState={getUploadState}
              handleCancelUpload={handleCancelUpload}
              handleRemoveFile={handleRemoveFile}
              newCategoryName={newCategoryName}
              setNewCategoryName={setNewCategoryName}
              onCreateCategory={handleCreateCategory}
            />
          )}

          {currentStep === 1 && (
            <CurriculumStep
              formData={formData}
              setFormData={setFormData}
              modules={modules}
              onAddModule={addCurriculumModule}
              onRemoveModule={removeCurriculumModule}
              onUpdateModule={updateCurriculumModule}
              onAddVideo={addVideoToModule}
              handleVideoUpload={handleVideoUpload}
              getUploadState={getUploadState}
              handleCancelUpload={handleCancelUpload}
              handleRemoveFile={handleRemoveFile}
            />
          )}

          {currentStep === 2 && (
            <CourseDetailsStep
              targetAudience={targetAudience}
              setTargetAudience={setTargetAudience}
              learningOutcomes={learningOutcomes}
              setLearningOutcomes={setLearningOutcomes}
              requiredMaterials={requiredMaterials}
              setRequiredMaterials={setRequiredMaterials}
            />
          )}

          {currentStep === 3 && (
            <ReviewStep
              formData={formData}
              targetAudience={targetAudience}
              learningOutcomes={learningOutcomes}
              requiredMaterials={requiredMaterials}
            />
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
          Previous
        </Button>

        {currentStep < steps.length - 1 ? (
          <Button
            onClick={() => setCurrentStep(currentStep + 1)}
            disabled={!canProceed(currentStep)}
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Course...
              </>
            ) : (
              "Create Course"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

function BasicInformationStep({
  formData,
  setFormData,
  categories,
  getUploadState,
  newCategoryName,
  setNewCategoryName,
  onCreateCategory,
  handleFileUpload,
  handleCancelUpload,
  handleRemoveFile,
}: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Course Name *</Label>
          <Input
            id="name"
            placeholder="Enter course name"
            value={formData.name || ""}
            onChange={(e) =>
              setFormData((prev: any) => ({ ...prev, name: e.target.value }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price *</Label>
          <Input
            id="price"
            type="number"
            placeholder="500"
            value={formData.price || ""}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                price: Number.parseInt(e.target.value) || 0,
              }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="original_price">Original Price *</Label>
          <Input
            id="original_price"
            type="number"
            placeholder="1000"
            value={formData.original_price || ""}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                original_price: Number.parseInt(e.target.value) || 0,
              }))
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="preview_description">Preview Description *</Label>
        <Textarea
          id="preview_description"
          placeholder="Short description for course preview"
          value={formData.preview_description || ""}
          onChange={(e) =>
            setFormData((prev: any) => ({
              ...prev,
              preview_description: e.target.value,
            }))
          }
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Full Description *</Label>
        <Textarea
          id="description"
          placeholder="Detailed course description"
          value={formData.description || ""}
          onChange={(e) =>
            setFormData((prev: any) => ({
              ...prev,
              description: e.target.value,
            }))
          }
          rows={4}
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label>Category *</Label>
          <div className="flex space-x-2">
            <Select
              value={formData.category?.id || ""}
              onValueChange={(value) => {
                const selectedCategory = categories?.find(
                  (cat: any) => cat.id === value
                );
                if (selectedCategory) {
                  setFormData((prev: any) => ({
                    ...prev,
                    category: {
                      id: selectedCategory.id,
                      name: selectedCategory.name,
                    },
                  }));
                }
              }}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category: any) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex space-x-2">
            <Input
              placeholder="New category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="flex-1"
            />
            <Button type="button" size="sm" onClick={onCreateCategory}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="level">Level</Label>
          <Select
            value={formData.level || "beginner"}
            onValueChange={(value) =>
              setFormData((prev: any) => ({ ...prev, level: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="estimated_time">Duration</Label>
          <Input
            id="estimated_time"
            placeholder="12 weeks"
            value={formData.estimated_time || ""}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                estimated_time: e.target.value,
              }))
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <MediaUpload
          label="Course Image"
          fieldKey="course_image"
          accept="image/*"
          currentUrl={formData.course_image}
          uploadState={getUploadState("course_image")}
          onFileSelect={(file) =>
            handleFileUpload(file, "course_image", S3_FOLDERS.COURSE_IMAGES)
          }
          onCancel={() => handleCancelUpload("course_image")}
          onRemove={() => handleRemoveFile("course_image")}
          placeholder="Click to upload course image"
        />

        <MediaUpload
          label="Preview Video"
          fieldKey="preview_id"
          accept="video/*"
          currentUrl={formData.preview_id}
          uploadState={getUploadState("preview_id")}
          onFileSelect={(file) =>
            handleFileUpload(file, "preview_id", S3_FOLDERS.VIDEOS)
          }
          onCancel={() => handleCancelUpload("preview_id")}
          onRemove={() => handleRemoveFile("preview_id")}
          placeholder="Click to upload preview video"
        />
      </div>
    </div>
  );
}

function CurriculumStep({
  formData,
  setFormData,
  modules,
  onAddModule,
  onRemoveModule,
  onUpdateModule,
  onAddVideo,
  handleVideoUpload,
  getUploadState,
  handleCancelUpload,
  handleRemoveFile,
}: any) {
  const updateModuleTitle = (moduleIndex: number, title: string) => {
    onUpdateModule(moduleIndex, { title });
  }

  const updateCourseNoteTitle = (moduleIndex: number, title: string) => {
    const mod = formData.curriculum[moduleIndex];
    onUpdateModule(moduleIndex, {
      course_note: {
        ...mod.course_note,
        title,
      },
    });
  };

  const updateCourseNoteDescription = (
    moduleIndex: number,
    description: string
  ) => {
    const mod = formData.curriculum[moduleIndex];
    // Convert string to dictionary format as expected by API
    const descriptionObj = description.trim()
      ? { description1: description.trim() }
      : null;
    onUpdateModule(moduleIndex, {
      course_note: {
        ...mod.course_note,
        description: descriptionObj,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Course Curriculum</h3>
        <Button onClick={onAddModule}>
          <Plus className="mr-2 h-4 w-4" />
          Add Module
        </Button>
      </div>

      {/* Available modules to be selected */}
      {modules && modules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Available Modules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {modules.map((module: CourseModule) => (
                <div
                  key={module.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{module.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {module.video.length} videos • Order: {module.order}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newModule: CourseCurriculum = {
                        title: module.title,
                        order: formData.curriculum?.length || 0,
                        video: module.video.map((video: CourseVideo) => ({
                          title: video.title,
                          duration: video.duration,
                          description: video.description,
                          video_file: video.video_file,
                        })),
                        course_note: module.course_note || {
                          title: "",
                          description: null,
                          note_file: null,
                        },
                      };
                      setFormData((prev: any) => ({
                        ...prev,
                        curriculum: [...(prev.curriculum || []), newModule],
                      }));
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add to Course
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {formData.curriculum?.map(
          (module: CourseCurriculum, moduleIndex: number) => (
            <Card key={moduleIndex}>
              <CardHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Module title *"
                    value={module.title || ""}
                    onChange={(e) =>
                      updateModuleTitle(moduleIndex, e.target.value)
                    }
                    className="flex-1"
                  />
                  <div className="space-y-2">
                    <Input
                      placeholder="Course note title *"
                      value={module.course_note?.title || ""}
                      onChange={(e) =>
                        updateCourseNoteTitle(moduleIndex, e.target.value)
                      }
                      className="flex-1"
                    />
                    <Textarea
                      placeholder="Course note description *"
                      value={
                        module.course_note?.description?.description1 || ""
                      }
                      onChange={(e) =>
                        updateCourseNoteDescription(moduleIndex, e.target.value)
                      }
                      rows={2}
                    />
                  </div>
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onAddVideo(moduleIndex)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Video
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="ml-2"
                      onClick={() => onRemoveModule()}
                    >
                      Remove Module
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {module.video.map(
                    (video: CourseVideo, videoIndex: number) => (
                      <div
                        key={videoIndex}
                        className="grid grid-cols-3 gap-4 p-4 border rounded-lg"
                      >
                        <Input
                          placeholder="Video title *"
                          value={video.title}
                          onChange={(e) => {
                            const updatedVideos = [...module.video];
                            updatedVideos[videoIndex] = {
                              ...video,
                              title: e.target.value,
                            };
                            onUpdateModule(moduleIndex, {
                              video: updatedVideos,
                            });
                          }}
                        />
                        <Input
                          placeholder="Duration (e.g., 15 minutes)"
                          value={video.duration || ""}
                          onChange={(e) => {
                            const updatedVideos = [...module.video];
                            updatedVideos[videoIndex] = {
                              ...video,
                              duration: e.target.value,
                            };
                            onUpdateModule(moduleIndex, {
                              video: updatedVideos,
                            });
                          }}
                        />
                        <div className="col-span-1">
                          <MediaUpload
                            label=""
                            fieldKey={`video_${moduleIndex}_${videoIndex}`}
                            accept="video/*"
                            currentUrl={video.video_file || undefined}
                            uploadState={getUploadState(
                              `video_${moduleIndex}_${videoIndex}`
                            )}
                            onFileSelect={async (file) => {
                              const uploadKey = `video_${moduleIndex}_${videoIndex}`;
                              const url = await handleVideoUpload(
                                file,
                                uploadKey,
                                S3_FOLDERS.VIDEOS
                              );
                              if (url) {
                                const updatedVideos = [...module.video];
                                updatedVideos[videoIndex] = {
                                  ...video,
                                  video_file: url,
                                };
                                onUpdateModule(moduleIndex, {
                                  video: updatedVideos,
                                });
                              }
                            }}
                            onCancel={() =>
                              handleCancelUpload(
                                `video_${moduleIndex}_${videoIndex}`
                              )
                            }
                            onRemove={() => {
                              handleRemoveFile(
                                `video_${moduleIndex}_${videoIndex}`,
                                video.video_file
                              );
                              const updatedVideos = [...module.video];
                              updatedVideos[videoIndex] = {
                                ...video,
                                video_file: null,
                              };
                              onUpdateModule(moduleIndex, {
                                video: updatedVideos,
                              });
                            }}
                            placeholder="Upload video file"
                            className="text-xs"
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          )
        )}
      </div>

      {formData.curriculum?.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-muted-foreground/25 rounded-lg">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No modules added yet</h3>
          <p className="text-muted-foreground">
            Start building your course curriculum by adding modules
          </p>
          <Button onClick={onAddModule} className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Add First Module
          </Button>
        </div>
      )}
    </div>
  );
}

function CourseDetailsStep({
  targetAudience,
  setTargetAudience,
  learningOutcomes,
  setLearningOutcomes,
  requiredMaterials,
  setRequiredMaterials,
}: {
  targetAudience: string[];
  setTargetAudience: (value: string[]) => void;
  learningOutcomes: string[];
  setLearningOutcomes: (value: string[]) => void;
  requiredMaterials: string[];
  setRequiredMaterials: (value: string[]) => void;
}) {
  const addTargetAudience = () => {
    setTargetAudience([...targetAudience, ""]);
  };

  const updateTargetAudience = (index: number, value: string) => {
    const updated = [...targetAudience];
    updated[index] = value;
    setTargetAudience(updated);
  };

  const removeTargetAudience = (index: number) => {
    if (targetAudience.length > 1) {
      setTargetAudience(targetAudience.filter((_, i) => i !== index));
    }
  };

  const addLearningOutcome = () => {
    setLearningOutcomes([...learningOutcomes, ""]);
  };

  const updateLearningOutcome = (index: number, value: string) => {
    const updated = [...learningOutcomes];
    updated[index] = value;
    setLearningOutcomes(updated);
  };

  const removeLearningOutcome = (index: number) => {
    if (learningOutcomes.length > 1) {
      setLearningOutcomes(learningOutcomes.filter((_, i) => i !== index));
    }
  };

  const addRequiredMaterial = () => {
    setRequiredMaterials([...requiredMaterials, ""]);
  };

  const updateRequiredMaterial = (index: number, value: string) => {
    const updated = [...requiredMaterials];
    updated[index] = value;
    setRequiredMaterials(updated);
  };

  const removeRequiredMaterial = (index: number) => {
    if (requiredMaterials.length > 1) {
      setRequiredMaterials(requiredMaterials.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Target Audience</h3>
          <div className="flex gap-2">
            <Badge variant="outline">At least 4*</Badge>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addTargetAudience}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Audience
            </Button>
          </div>
        </div>
        <div className="space-y-3">
          {targetAudience.map((audience: string, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                placeholder={`Target audience ${index + 1}${
                  index === 0 || index === 1 || index === 2 || index === 3
                    ? " (required)"
                    : ""
                }`}
                value={audience}
                onChange={(e) => updateTargetAudience(index, e.target.value)}
                className="flex-1"
              />
              {/* {index < 4 && (
                <Badge
                  variant={index < 4 ? "default" : "secondary"}
                  className="text-xs"
                >
                  API #{index + 1}
                </Badge>
              )}
              {index >= 4 && (
                <Badge variant="secondary" className="text-xs">
                  UI Only
                </Badge>
              )} */}
              {targetAudience.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeTargetAudience(index)}
                  title={`Remove audience ${index + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Learning Outcomes</h3>
          <div className="flex gap-2">
            <Badge variant="outline">At least 4*</Badge>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addLearningOutcome}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Outcome
            </Button>
          </div>
        </div>
        <div className="space-y-3">
          {learningOutcomes.map((outcome: string, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <Textarea
                placeholder={`Learning outcome ${index + 1}${
                  index === 0 || index === 1 || index === 2 || index === 3
                    ? " (required)"
                    : ""
                }`}
                value={outcome}
                onChange={(e) => updateLearningOutcome(index, e.target.value)}
                rows={2}
                className="flex-1"
              />
              {/* {index < 4 && (
                <Badge variant="default" className="text-xs">
                  API #{index + 1}
                </Badge>
              )}
              {index >= 4 && (
                <Badge variant="secondary" className="text-xs">
                  UI Only
                </Badge>
              )} */}
              {learningOutcomes.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeLearningOutcome(index)}
                  title={`Remove outcome ${index + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Required Materials</h3>
          <div className="flex gap-2">
            <Badge variant="outline">At least 4*</Badge>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addRequiredMaterial}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Material
            </Button>
          </div>
        </div>
        <div className="space-y-3">
          {requiredMaterials.map((material: string, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                placeholder={`Required material ${index + 1}${
                  index === 0 || index === 1 || index === 2 || index === 3
                    ? " (required)"
                    : ""
                }`}
                value={material}
                onChange={(e) => updateRequiredMaterial(index, e.target.value)}
                className="flex-1"
              />
              {/* {index < 4 && (
                <Badge variant="default" className="text-xs">
                  API #{index + 1}
                </Badge>
              )}
              {index >= 4 && (
                <Badge variant="secondary" className="text-xs">
                  UI Only
                </Badge>
              )} */}
              {requiredMaterials.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeRequiredMaterial(index)}
                  title={`Remove material ${index + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* <Alert>
        <AlertDescription>
          <strong>Current Limitation:</strong> The API currently accepts only
          the first 4 items from each section. Additional items are for UI
          purposes only and won't be saved. Consider asking your backend team to
          make the API more flexible.
        </AlertDescription>
      </Alert> */}
    </div>
  );
}

function ReviewStep({
  formData,
  targetAudience,
  learningOutcomes,
  requiredMaterials,
}: {
  formData: any;
  targetAudience: string[];
  learningOutcomes: string[];
  requiredMaterials: string[];
}) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold flex items-center justify-center gap-2">
          <BookOpenCheck className="h-6 w-6 text-blue-600" />
          Course Preview
        </h3>
        <p className="text-muted-foreground">
          Review your course before publishing
        </p>
      </div>

      {/* Hero Section with Course Image and Preview Video */}
      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Course Image */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Course Image</h4>
            {formData.course_image ? (
              <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={formData.course_image}
                  alt={formData.name || "Course image"}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="aspect-video rounded-lg bg-gray-100 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-2" />
                  <p>No course image uploaded</p>
                </div>
              </div>
            )}
          </div>

          {/* Preview Video */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Preview Video</h4>
            {formData.preview_id ? (
              <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                <video
                  controls
                  className="w-full h-full"
                  poster={formData.course_image || undefined}
                >
                  <source src={formData.preview_id} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              <div className="aspect-video rounded-lg bg-gray-100 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Play className="h-12 w-12 mx-auto mb-2" />
                  <p>No preview video uploaded</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Course Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-blue-600" />
            Course Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-lg mb-2">{formData.name}</h4>
                <Badge variant="secondary" className="mb-2">
                  {formData.category?.name}
                </Badge>
                <p className="text-muted-foreground">
                  {formData.preview_description}
                </p>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{formData.estimated_time}</span>
                </div>
                <Badge variant="outline">{formData.level}</Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold">Pricing</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-green-600">
                      ${formData.price}
                    </span>
                    {formData.original_price > formData.price && (
                      <span className="text-lg text-gray-500 line-through">
                        ${formData.original_price}
                      </span>
                    )}
                  </div>
                  {formData.original_price > formData.price && (
                    <Badge variant="destructive" className="text-xs">
                      {Math.round(
                        ((formData.original_price - formData.price) /
                          formData.original_price) *
                          100
                      )}
                      % OFF
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h5 className="font-semibold mb-2">Description</h5>
            <p className="text-muted-foreground leading-relaxed">
              {formData.description}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Curriculum with Video Previews */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Course Curriculum
            <Badge variant="secondary" className="ml-auto">
              {formData.curriculum?.length || 0} Modules
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {formData.curriculum?.map(
            (curriculumModule: any, moduleIndex: number) => (
              <div
                key={moduleIndex}
                className="border rounded-lg p-4 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h5 className="font-semibold">
                      Module {moduleIndex + 1}: {curriculumModule.title}
                    </h5>
                    {curriculumModule.course_note?.title && (
                      <p className="text-sm text-muted-foreground mt-1">
                        📝 {curriculumModule.course_note.title}
                      </p>
                    )}
                  </div>
                  <Badge variant="outline">
                    {curriculumModule.video?.length || 0} Videos
                  </Badge>
                </div>

                {curriculumModule.course_note?.description && (
                  <p className="text-sm text-muted-foreground bg-gray-50 dark:bg-gray-900 p-3 rounded">
                    {curriculumModule.course_note.description?.description1 ||
                      ""}
                  </p>
                )}

                {/* Videos Grid */}
                {curriculumModule.video?.length > 0 && (
                  <div className="space-y-3">
                    <h6 className="font-medium text-sm">Videos:</h6>
                    <div className="grid gap-4">
                      {curriculumModule.video.map(
                        (video: any, videoIndex: number) => (
                          <div
                            key={videoIndex}
                            className="border rounded-lg p-3"
                          >
                            <div className="flex items-start gap-3">
                              {video.video_file ? (
                                <div className="relative w-32 h-18 rounded overflow-hidden bg-black flex-shrink-0">
                                  <video
                                    controls
                                    className="w-full h-full object-cover"
                                    preload="metadata"
                                  >
                                    <source
                                      src={video.video_file}
                                      type="video/mp4"
                                    />
                                  </video>
                                </div>
                              ) : (
                                <div className="w-32 h-18 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                                  <Play className="h-6 w-6 text-gray-400" />
                                </div>
                              )}

                              <div className="flex-1 min-w-0">
                                <h6 className="font-medium truncate">
                                  {video.title || `Video ${videoIndex + 1}`}
                                </h6>
                                {video.description && (
                                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                    {video.description}
                                  </p>
                                )}
                                {video.duration && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <Clock className="h-3 w-3 text-gray-400" />
                                    <span className="text-xs text-muted-foreground">
                                      {video.duration}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          )}

          {(!formData.curriculum || formData.curriculum.length === 0) && (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No curriculum modules added yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Course Information */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Target Audience */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4 text-blue-600" />
              Target Audience
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {targetAudience
                .filter((audience: string) => audience.trim())
                .map((audience: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Target className="h-3 w-3 text-blue-500 mt-1 flex-shrink-0" />
                    <span>{audience}</span>
                  </li>
                ))}
            </ul>
            {targetAudience.filter((a) => a.trim()).length === 0 && (
              <p className="text-sm text-muted-foreground">
                No target audience specified
              </p>
            )}
          </CardContent>
        </Card>

        {/* Learning Outcomes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpenCheck className="h-4 w-4 text-green-600" />
              Learning Outcomes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {learningOutcomes
                .filter((outcome: string) => outcome.trim())
                .map((outcome: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-1 flex-shrink-0" />
                    <span>{outcome}</span>
                  </li>
                ))}
            </ul>
            {learningOutcomes.filter((o) => o.trim()).length === 0 && (
              <p className="text-sm text-muted-foreground">
                No learning outcomes specified
              </p>
            )}
          </CardContent>
        </Card>

        {/* Required Materials */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="h-4 w-4 text-orange-600" />
              Required Materials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {requiredMaterials
                .filter((material: string) => material.trim())
                .map((material: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mt-1 flex-shrink-0" />
                    <span>{material}</span>
                  </li>
                ))}
            </ul>
            {requiredMaterials.filter((m) => m.trim()).length === 0 && (
              <p className="text-sm text-muted-foreground">
                No required materials specified
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Summary Statistics */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {formData.curriculum?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Modules</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {formData.curriculum?.reduce(
                  (acc: number, module: any) =>
                    acc + (module.video?.length || 0),
                  0
                ) || 0}
              </div>
              <div className="text-sm text-muted-foreground">Videos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {targetAudience.filter((a) => a.trim()).length}
              </div>
              <div className="text-sm text-muted-foreground">Target Groups</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {learningOutcomes.filter((o) => o.trim()).length}
              </div>
              <div className="text-sm text-muted-foreground">Outcomes</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
