"use client";
import {
  Edit,
  Trash2,
  Play,
  Download,
  Users,
  Clock,
  BookOpen,
  Star,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useCourse, useDeleteCourse } from "@/hooks/use-courses";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface CourseDetailsProps {
  courseId: string;
}

export function CourseDetails({ courseId }: CourseDetailsProps) {
  // const router = useRouter();
  const { data: course, isLoading, error } = useCourse(courseId);
  const { mutate: deleteCourse, isPending: isDeleting } = useDeleteCourse();

  const handleDelete = () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this course? This action cannot be undone."
      )
    ) {
      return;
    }

    deleteCourse(courseId, {
      onSuccess: () => {
        window.location.href = "/courses";
      },
      onError: (error) => {
        console.error("Failed to delete course:", error);
        alert("Failed to delete course. Please try again.");
      },
    });
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load course details. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return <CourseDetailsSkeleton />;
  }

  if (!course) {
    return (
      <Alert>
        <AlertDescription>Course not found.</AlertDescription>
      </Alert>
    );
  }

  const levelColors = {
    beginner: "bg-green-100 text-green-800",
    intermediate: "bg-yellow-100 text-yellow-800",
    advanced: "bg-red-100 text-red-800",
  };

  const totalVideos =
    course.curriculum?.reduce((acc, module) => acc + module.video.length, 0) ||
    0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{course.name}</h1>
          <p className="text-muted-foreground">Course Management</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit Course
          </Button>
          <Button
            variant="outline"
            className="text-destructive bg-transparent"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-0">
              <div className="relative h-64 w-full">
                <Image
                  src={
                    course.course_image ||
                    "/placeholder.svg?height=300&width=600"
                  }
                  alt={course.name}
                  fill
                  className="object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <Button
                    size="lg"
                    className="bg-white/90 text-black hover:bg-white"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Preview Course
                  </Button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Badge
                    className={
                      levelColors[course.level as keyof typeof levelColors]
                    }
                  >
                    {course.level}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {course.category.name}
                  </span>
                </div>
                <p className="text-muted-foreground">{course.description}</p>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="curriculum" className="space-y-4">
            <TabsList>
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="instructor">Instructor</TabsTrigger>
            </TabsList>

            <TabsContent value="curriculum" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Course Curriculum</CardTitle>
                  <CardDescription>
                    {course.curriculum?.length || 0} modules • {totalVideos}{" "}
                    videos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {course.curriculum?.map((module, index) => (
                      <AccordionItem
                        key={module.id || index}
                        value={`module-${index}`}
                      >
                        <AccordionTrigger className="text-left">
                          <div className="flex items-center justify-between w-full mr-4">
                            <span>{module.title}</span>
                            <span className="text-sm text-muted-foreground">
                              {module.video.length} videos
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 pl-4">
                            {module.video.map((video, videoIndex) => (
                              <div
                                key={video.id || videoIndex}
                                className="flex items-center justify-between py-2 border-b last:border-b-0"
                              >
                                <div className="flex items-center space-x-3">
                                  <Play className="h-4 w-4 text-muted-foreground" />
                                  <div>
                                    <p className="font-medium">{video.title}</p>
                                    {video.description && (
                                      <p className="text-sm text-muted-foreground">
                                        {video.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {video.duration || "0:00"}
                                </span>
                              </div>
                            ))}
                            {module.course_note && (
                              <div className="flex items-center space-x-3 py-2 border-t">
                                <Download className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">
                                  {module.course_note.title}
                                </span>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Target Audience</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {Object.values(course.target_audience).map(
                        (audience, index) => (
                          <li key={index} className="text-sm">
                            • {audience}
                          </li>
                        )
                      )}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Learning Outcomes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {Object.values(course.learning_outcomes).map(
                        (outcome, index) => (
                          <li key={index} className="text-sm">
                            • {outcome}
                          </li>
                        )
                      )}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Required Materials</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid grid-cols-2 gap-2">
                      {Object.values(course.required_materials).map(
                        (material, index) => (
                          <li key={index} className="text-sm">
                            • {material}
                          </li>
                        )
                      )}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="instructor" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Instructor Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-4">
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                      {course.instructor?.profile_picture ? (
                        <Image
                          src={
                            course.instructor.profile_picture ||
                            "/placeholder.svg"
                          }
                          alt={`${course.instructor.first_name} ${course.instructor.last_name}`}
                          width={64}
                          height={64}
                          className="rounded-full"
                        />
                      ) : (
                        <span className="text-lg font-medium">
                          {course.instructor?.first_name?.[0]}
                          {course.instructor?.last_name?.[0]}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">
                        {course.instructor?.first_name}{" "}
                        {course.instructor?.last_name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {course.instructor?.role}
                      </p>
                      <p className="text-sm leading-relaxed">
                        {course.instructor?.bio}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Price</span>
                </div>
                <span className="font-semibold">${course.price}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Duration</span>
                </div>
                <span className="font-semibold">{course.estimated_time}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Modules</span>
                </div>
                <span className="font-semibold">
                  {course.curriculum?.length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Play className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Videos</span>
                </div>
                <span className="font-semibold">{totalVideos}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full bg-transparent" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                View Enrolled Students
              </Button>
              <Button className="w-full bg-transparent" variant="outline">
                <BookOpen className="mr-2 h-4 w-4" />
                Create Assignment
              </Button>
              <Button className="w-full bg-transparent" variant="outline">
                <Star className="mr-2 h-4 w-4" />
                View Reviews
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function CourseDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-32 mt-2" />
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
        <div>
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
