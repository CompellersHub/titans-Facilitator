/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { BookOpen } from "lucide-react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  Plus,
  Loader2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  useCreateCourse,
  useCourseCategories,
  useCourseModules,
  useCreateCategory,
} from "@/hooks/use-courses";
import { uploadToS3, S3_FOLDERS } from "@/lib/s3-upload";
import type {
  CourseCurriculum,
  CourseModule,
  CourseVideo,
  CreateCourseData,
} from "@/lib/types";

export function CreateCourseForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<CreateCourseData>>({
    name: "",
    preview_description: "",
    description: "",
    price: 0,
    estimated_time: "",
    level: "beginner",
    curriculum: [],
  });

  // Separate state for dynamic arrays
  const [targetAudience, setTargetAudience] = useState<string[]>([""]);
  const [learningOutcomes, setLearningOutcomes] = useState<string[]>([""]);
  const [requiredMaterials, setRequiredMaterials] = useState<string[]>([""]);

  const [uploadProgress, setUploadProgress] = useState<
    Record<string, number | undefined>
  >({});
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});
  const [newCategoryName, setNewCategoryName] = useState("");

  const router = useRouter();
  const { mutate: createCourse, isPending, error } = useCreateCourse();
  const { data: categories } = useCourseCategories();
  const { data: modules } = useCourseModules();
  const { mutate: createCategory } = useCreateCategory();

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
    folder: string
  ) => {
    try {
      // Clear any previous errors for this field
      setUploadErrors((prev) => ({ ...prev, [field]: "" }));

      setUploadProgress((prev) => ({ ...prev, [field]: 0 }));
      const url = await uploadToS3({
        file,
        folder,
        onProgress: (progress) =>
          setUploadProgress((prev) => ({ ...prev, [field]: progress })),
      });
      setFormData((prev) => ({ ...prev, [field]: url }));

      // Clear progress after successful upload
      setTimeout(() => {
        setUploadProgress((prev) => ({ ...prev, [field]: undefined }));
      }, 2000);
    } catch (error) {
      console.error("Upload failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";
      setUploadErrors((prev) => ({ ...prev, [field]: errorMessage }));
      setUploadProgress((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const addCurriculumModule = () => {
    const newModule: CourseCurriculum = {
      title: "",
      order: formData.curriculum?.length || 0,
      video: [],
      course_note: null,
    };
    setFormData((prev) => ({
      ...prev,
      curriculum: [...(prev.curriculum || []), newModule],
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
      createCategory({ name: newCategoryName.trim() });
      setNewCategoryName("");
    }
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.description) return;

    // Convert arrays to Record<string, string> format
    const convertArrayToRecord = (arr: string[]) => {
      const record: Record<string, string> = {};
      arr.forEach((item, index) => {
        if (item.trim()) {
          record[`item${index + 1}`] = item.trim();
        }
      });
      // Ensure at least one empty field if all are empty
      if (Object.keys(record).length === 0) {
        record["item1"] = "";
      }
      return record;
    };

    const courseData: CreateCourseData = {
      ...formData,
      target_audience: convertArrayToRecord(targetAudience),
      learning_outcomes: convertArrayToRecord(learningOutcomes),
      required_materials: convertArrayToRecord(requiredMaterials),
      instructor: { user_id: "2" }, // Current user ID
    } as CreateCourseData;

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
          formData.name && formData.description && formData.preview_description
        );
      case 1:
        return formData.curriculum && formData.curriculum.length > 0;
      case 2:
        return true;
      default:
        return true;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
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
              onFileUpload={handleFileUpload}
              uploadProgress={uploadProgress}
              uploadErrors={uploadErrors}
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
              onUpdateModule={updateCurriculumModule}
              onAddVideo={addVideoToModule}
              onFileUpload={handleFileUpload}
              uploadProgress={uploadProgress}
              uploadErrors={uploadErrors}
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
          <ArrowLeft className="mr-2 h-4 w-4" />
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
  onFileUpload,
  uploadProgress,
  uploadErrors,
  newCategoryName,
  setNewCategoryName,
  onCreateCategory,
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
          <Label>Category</Label>
          <div className="flex space-x-2">
            <Select
              value={formData.category?.name || ""}
              onValueChange={(value) =>
                setFormData((prev: any) => ({
                  ...prev,
                  category: { name: value },
                }))
              }
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category: any) => (
                  <SelectItem key={category.id} value={category.name}>
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
        <div className="space-y-2">
          <Label>Course Image</Label>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file)
                  onFileUpload(file, "course_image", S3_FOLDERS.COURSE_IMAGES);
              }}
              className="hidden"
              id="course_image"
            />
            <Label htmlFor="course_image" className="cursor-pointer">
              <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Click to upload course image
              </p>
            </Label>
            {uploadProgress.course_image !== undefined && (
              <Progress value={uploadProgress.course_image} className="mt-2" />
            )}
            {uploadErrors.course_image && (
              <Alert variant="destructive" className="mt-2">
                <AlertDescription className="text-xs">
                  {uploadErrors.course_image}
                </AlertDescription>
              </Alert>
            )}
            {formData.course_image && (
              <p className="text-xs text-green-600 mt-1">
                ✓ Image uploaded successfully
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Preview Video</Label>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
            <Input
              type="file"
              accept="video/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onFileUpload(file, "preview_id", S3_FOLDERS.VIDEOS);
              }}
              className="hidden"
              id="preview_video"
            />
            <Label htmlFor="preview_video" className="cursor-pointer">
              <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Click to upload preview video
              </p>
            </Label>
            {uploadProgress.preview_id !== undefined && (
              <Progress value={uploadProgress.preview_id} className="mt-2" />
            )}
            {uploadErrors.preview_id && (
              <Alert variant="destructive" className="mt-2">
                <AlertDescription className="text-xs">
                  {uploadErrors.preview_id}
                </AlertDescription>
              </Alert>
            )}
            {formData.preview_id && (
              <p className="text-xs text-green-600 mt-1">
                ✓ Video uploaded successfully
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CurriculumStep({
  formData,
  setFormData,
  modules,
  onAddModule,
  onUpdateModule,
  onAddVideo,
  onFileUpload,
  uploadProgress,
}: any) {
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
                        course_note: module.course_note,
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
                <div className="flex items-center space-x-4">
                  <Input
                    placeholder="Module title"
                    value={module.title}
                    onChange={(e) =>
                      onUpdateModule(moduleIndex, { title: e.target.value })
                    }
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAddVideo(moduleIndex)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Video
                  </Button>
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
                          placeholder="Video title"
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
                        <div className="space-y-2">
                          <Input
                            type="file"
                            accept="video/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const uploadKey = `video_${moduleIndex}_${videoIndex}`;
                                onFileUpload(
                                  file,
                                  uploadKey,
                                  S3_FOLDERS.VIDEOS
                                ).then((url: string) => {
                                  const updatedVideos = [...module.video];
                                  updatedVideos[videoIndex] = {
                                    ...video,
                                    video_file: url,
                                  };
                                  onUpdateModule(moduleIndex, {
                                    video: updatedVideos,
                                  });
                                });
                              }
                            }}
                            className="text-xs"
                          />
                          {uploadProgress[
                            `video_${moduleIndex}_${videoIndex}`
                          ] !== undefined && (
                            <Progress
                              value={
                                uploadProgress[
                                  `video_${moduleIndex}_${videoIndex}`
                                ]
                              }
                            />
                          )}
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
    const updated = targetAudience.map((item, i) =>
      i === index ? value : item
    );
    setTargetAudience(updated);
  };

  const removeTargetAudience = (index: number) => {
    setTargetAudience(targetAudience.filter((_, i) => i !== index));
  };

  const addLearningOutcome = () => {
    setLearningOutcomes([...learningOutcomes, ""]);
  };

  const updateLearningOutcome = (index: number, value: string) => {
    const updated = learningOutcomes.map((item, i) =>
      i === index ? value : item
    );
    setLearningOutcomes(updated);
  };

  const removeLearningOutcome = (index: number) => {
    setLearningOutcomes(learningOutcomes.filter((_, i) => i !== index));
  };

  const addRequiredMaterial = () => {
    setRequiredMaterials([...requiredMaterials, ""]);
  };

  const updateRequiredMaterial = (index: number, value: string) => {
    const updated = requiredMaterials.map((item, i) =>
      i === index ? value : item
    );
    setRequiredMaterials(updated);
  };

  const removeRequiredMaterial = (index: number) => {
    setRequiredMaterials(requiredMaterials.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Target Audience</h3>
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
        <div className="space-y-3">
          {targetAudience.map((audience: string, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                placeholder={`Target audience ${index + 1}`}
                value={audience}
                onChange={(e) => updateTargetAudience(index, e.target.value)}
                className="flex-1"
              />
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
        <div className="space-y-3">
          {learningOutcomes.map((outcome: string, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <Textarea
                placeholder={`Learning outcome ${index + 1}`}
                value={outcome}
                onChange={(e) => updateLearningOutcome(index, e.target.value)}
                rows={2}
                className="flex-1"
              />
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
        <div className="space-y-3">
          {requiredMaterials.map((material: string, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                placeholder={`Required material ${index + 1}`}
                value={material}
                onChange={(e) => updateRequiredMaterial(index, e.target.value)}
                className="flex-1"
              />
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
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Review Your Course</h3>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <strong>Name:</strong> {formData.name}
            </div>
            <div>
              <strong>Price:</strong> ${formData.price}
            </div>
            <div>
              <strong>Level:</strong> {formData.level}
            </div>
            <div>
              <strong>Duration:</strong> {formData.estimated_time}
            </div>
            <div>
              <strong>Category:</strong> {formData.category?.name}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Curriculum</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <strong>Modules:</strong> {formData.curriculum?.length || 0}
            </div>
            <div>
              <strong>Total Videos:</strong>{" "}
              {formData.curriculum?.reduce(
                (acc: number, module: any) => acc + module.video.length,
                0
              ) || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <strong>Target Audience:</strong>
              <ul className="list-disc list-inside mt-1">
                {targetAudience
                  .filter((audience: string) => audience.trim())
                  .map((audience: string, index: number) => (
                    <li key={index} className="text-sm">
                      {audience}
                    </li>
                  ))}
              </ul>
            </div>
            <div>
              <strong>Learning Outcomes:</strong>
              <ul className="list-disc list-inside mt-1">
                {learningOutcomes
                  .filter((outcome: string) => outcome.trim())
                  .map((outcome: string, index: number) => (
                    <li key={index} className="text-sm">
                      {outcome}
                    </li>
                  ))}
              </ul>
            </div>
            <div>
              <strong>Required Materials:</strong>
              <ul className="list-disc list-inside mt-1">
                {requiredMaterials
                  .filter((material: string) => material.trim())
                  .map((material: string, index: number) => (
                    <li key={index} className="text-sm">
                      {material}
                    </li>
                  ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
