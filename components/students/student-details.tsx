/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import {
  Edit,
  Mail,
  Phone,
  BookOpen,
  BarChart3,
  Calendar,
  Award,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useStudent, useStudentProgress } from "@/hooks/use-students";
import { format } from "date-fns";
import Link from "next/link";

interface StudentDetailsProps {
  studentId: string;
}

export function StudentDetails({ studentId }: StudentDetailsProps) {
  const { data: student, isLoading, error } = useStudent(studentId);
  //   const [selectedCourseId, setSelectedCourseId] = useState<string>("");

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load student details. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return <StudentDetailsSkeleton />;
  }

  if (!student) {
    return (
      <Alert>
        <AlertDescription>Student not found.</AlertDescription>
      </Alert>
    );
  }

  const displayName =
    student.first_name && student.last_name
      ? `${student.first_name} ${student.last_name}`
      : student.username;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{displayName}</h1>
          <p className="text-muted-foreground">Student Profile</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Student Info Card */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`}
                  />
                  <AvatarFallback className="text-lg">
                    {student.first_name?.[0] || student.username[0]}
                    {student.last_name?.[0] || student.username[1] || ""}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-xl">{displayName}</CardTitle>
                  <CardDescription className="text-base">
                    @{student.username}
                  </CardDescription>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge variant="secondary">{student.role}</Badge>
                    <Badge variant="outline">
                      {student.course.length} course
                      {student.course.length !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">
                      {student.email}
                    </p>
                  </div>
                </div>
                {student.phone_number && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">
                        {student.phone_number}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {student.created_at && (
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Joined</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(student.created_at), "MMMM dd, yyyy")}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Courses and Progress */}
          <Tabs defaultValue="courses" className="space-y-4">
            <TabsList>
              <TabsTrigger value="courses">Enrolled Courses</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
            </TabsList>

            <TabsContent value="courses" className="space-y-4">
              {student.course.length > 0 ? (
                <div className="grid gap-4">
                  {student.course.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      studentId={student.id}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">
                      No courses enrolled
                    </h3>
                    <p className="text-muted-foreground">
                      This student hasn&apos;t enrolled in any courses yet.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="progress" className="space-y-4">
              {student.course.length > 0 ? (
                <div className="space-y-4">
                  {student.course.map((course) => (
                    <ProgressCard
                      key={course.id}
                      course={course}
                      studentId={student.id}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">
                      No progress data
                    </h3>
                    <p className="text-muted-foreground">
                      Enroll in courses to track progress.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Total Courses
                </span>
                <span className="font-medium">{student.course.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Account Status
                </span>
                <Badge variant="default">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Student ID
                </span>
                <span className="font-mono text-xs">
                  {student.id.slice(-8)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full bg-transparent" variant="outline">
                <Mail className="mr-2 h-4 w-4" />
                Send Message
              </Button>
              <Button className="w-full bg-transparent" variant="outline">
                <BookOpen className="mr-2 h-4 w-4" />
                Enroll in Course
              </Button>
              <Button className="w-full bg-transparent" variant="outline">
                <Award className="mr-2 h-4 w-4" />
                View Certificates
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function CourseCard({ course, studentId }: { course: any; studentId: string }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{course.name}</CardTitle>
            <CardDescription>
              {course.preview_description || "No description available"}
            </CardDescription>
          </div>
          <Badge variant="outline">£{course.price}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            {course.level && <span className="capitalize">{course.level}</span>}
            {course.estimated_time && (
              <>
                <span>•</span>
                <span>{course.estimated_time}</span>
              </>
            )}
          </div>
          <Link href={`/courses/${course.id}`}>
            <Button size="sm" variant="outline">
              View Course
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function ProgressCard({
  course,
  studentId,
}: {
  course: any;
  studentId: string;
}) {
  const { data: progress, isLoading } = useStudentProgress(
    studentId,
    course.id
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full mb-4" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!progress) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{course.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No progress data available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{progress.course_name}</CardTitle>
          <Badge
            variant={
              progress.progress_percentage > 50 ? "default" : "secondary"
            }
          >
            {progress.progress_percentage}% Complete
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={progress.progress_percentage} className="w-full" />

        <div className="grid grid-cols-2 gap-4">
          {progress.details.map((detail) => (
            <div key={detail.type} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium capitalize">
                  {detail.type.replace("_", " ")}
                </span>
                <span className="text-xs text-muted-foreground">
                  {detail.completed}/{detail.total}
                </span>
              </div>
              <Progress
                value={
                  detail.total > 0 ? (detail.completed / detail.total) * 100 : 0
                }
                className="h-2"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function StudentDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-32 mt-2" />
        </div>
        <Skeleton className="h-10 w-24" />
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
