"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  BookOpen,
  FileText,
  ExternalLink,
  Download,
  Calendar,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCourseLibrary } from "@/hooks/use-course-library";
import { useCourses } from "@/hooks/use-courses";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import type { Course, CourseLibrary } from "@/lib/types";

type FilType = {
  type: string;
  color: string;
  icon: string;
};

export function CourseLibraryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const { data: libraryItems, isLoading, error } = useCourseLibrary();
  const { data: courses } = useCourses();
  //   const courses = [];

  const filteredItems = libraryItems?.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCourse =
      selectedCourse === "all" || item.course_id === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  const getFileType = (filename: string) => {
    const extension = filename.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return { type: "PDF", color: "bg-red-100 text-red-800", icon: "📄" };
      case "doc":
      case "docx":
        return { type: "DOC", color: "bg-blue-100 text-blue-800", icon: "📝" };
      case "ppt":
      case "pptx":
        return {
          type: "PPT",
          color: "bg-orange-100 text-orange-800",
          icon: "📊",
        };
      case "jpg":
      case "jpeg":
      case "png":
        return {
          type: "IMG",
          color: "bg-green-100 text-green-800",
          icon: "🖼️",
        };
      case "mp4":
      case "avi":
        return {
          type: "VIDEO",
          color: "bg-purple-100 text-purple-800",
          icon: "🎥",
        };
      default:
        return { type: "FILE", color: "bg-gray-100 text-gray-800", icon: "📁" };
    }
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load course library. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Course Library</h1>
          <p className="text-muted-foreground">
            Manage your course resources and materials
          </p>
        </div>
        <Link href="/library/create">
          <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Resource
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Resources
                </p>
                <p className="text-2xl font-bold text-emerald-600">
                  {libraryItems?.length || 0}
                </p>
              </div>
              <div className="h-8 w-8 bg-emerald-100 rounded-full flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Files
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {libraryItems?.filter((item) => item.file).length || 0}
                </p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  External Links
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {libraryItems?.filter((item) => item.url).length || 0}
                </p>
              </div>
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <ExternalLink className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Courses
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {new Set(libraryItems?.map((item) => item.course_id)).size ||
                    0}
                </p>
              </div>
              <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {courses?.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          More Filters
        </Button>
      </div>

      {/* Library Items Grid */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems?.map((item) => (
            <LibraryItemCard
              key={item.id}
              item={item}
              courses={courses}
              getFileType={getFileType}
            />
          ))}
        </div>
      )}

      {filteredItems?.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No resources found</h3>
          <p className="text-muted-foreground">
            {searchTerm
              ? "Try adjusting your search terms"
              : "Get started by adding your first resource"}
          </p>
          {!searchTerm && (
            <Link href="/library/create">
              <Button className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Add Resource
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

function LibraryItemCard({
  item,
  courses,
  getFileType,
}: {
  item: CourseLibrary;
  courses: Course[] | undefined;
  getFileType: (filename: string) => FilType;
}) {
  const course = courses?.find((c) => c.id === item.course_id);
  const fileInfo = item.file ? getFileType(item.file) : null;

  return (
    <Link href={`/library/${item.id}`}>
      <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <CardTitle className="text-lg line-clamp-2 group-hover:text-emerald-600 transition-colors">
                {item.title}
              </CardTitle>
              <CardDescription className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span className="line-clamp-1">
                  {course?.name || "Unknown Course"}
                </span>
              </CardDescription>
            </div>
            {fileInfo && (
              <Badge className={fileInfo.color}>
                <span className="mr-1">{fileInfo.icon}</span>
                {fileInfo.type}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Preview */}
          <div className="relative h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden">
            {item.file && fileInfo?.type === "IMG" ? (
              <Image
                src={item.file.startsWith('http') ? item.file : `https://api.titanscareers.com${item.file}`}
                alt={item.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl mb-2">
                    {item.url ? "🔗" : fileInfo?.icon || "📄"}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {item.url ? "External Link" : "File Resource"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-1 h-4 w-4" />
              {item.created_at && !isNaN(new Date(item.created_at).getTime())
                ? format(new Date(item.created_at), "MMM dd, yyyy")
                : "Unknown date"}
            </div>
            <div className="flex space-x-1">
              {item.file && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log(item.file);
                    window.open(
                      `https://api.titanscareers.com${item.file}`,
                      "_blank"
                    );
                  }}
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}
              {item.url && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(item.url, "_blank");
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
