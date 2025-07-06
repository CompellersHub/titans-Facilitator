"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  BookOpen,
  Users,
  Clock,
  EuroIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useCourses } from "@/hooks/use-courses";
import Link from "next/link";
import Image from "next/image";
import { Course } from "@/lib/types";

export function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: courses, isLoading, error } = useCourses();

  const filteredCourses = courses?.filter((course) =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load courses. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
          <p className="text-muted-foreground">
            Manage your course catalog and curriculum
          </p>
        </div>
        <Link href="/courses/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Course
          </Button>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-48 w-full rounded-md" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses?.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}

      {filteredCourses?.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No courses found</h3>
          <p className="text-muted-foreground">
            {searchTerm
              ? "Try adjusting your search terms"
              : "Get started by creating your first course"}
          </p>
          {!searchTerm && (
            <Link href="/courses/create">
              <Button className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Create Course
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  const levelColors = {
    beginner: "bg-green-100 text-green-800",
    intermediate: "bg-yellow-100 text-yellow-800",
    advanced: "bg-red-100 text-red-800",
  };

  return (
    <Link href={`/courses/${course.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
        <div className="relative h-48 w-full">
          <Image
            src={course.course_image || "/placeholder.svg?height=200&width=400"}
            alt={course.name}
            fill
            className="object-cover"
          />
          <div className="absolute top-2 right-2">
            <Badge
              className={levelColors[course.level as keyof typeof levelColors]}
            >
              {course.level}
            </Badge>
          </div>
        </div>
        <CardHeader>
          <CardTitle className="text-lg line-clamp-1">{course.name}</CardTitle>
          <CardDescription className="line-clamp-2">
            {course.preview_description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-muted-foreground">
                <EuroIcon className="mr-1 h-4 w-4" />
                {course.price}
              </div>
              <div className="flex items-center text-muted-foreground">
                <Clock className="mr-1 h-4 w-4" />
                {course.estimated_time}
              </div>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="mr-2 h-4 w-4" />
              {course.instructor?.first_name} {course.instructor?.last_name}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <BookOpen className="mr-2 h-4 w-4" />
              {course.curriculum?.length || 0} modules
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
