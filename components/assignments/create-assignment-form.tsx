"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarIcon, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCreateAssignment } from "@/hooks/use-assignments";
import { useCourses } from "@/hooks/use-courses";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function CreateAssignmentForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [dueDate, setDueDate] = useState<Date>();
  const [totalMarks, setTotalMarks] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const router = useRouter();
  const { mutate: createAssignment, isPending, error } = useCreateAssignment();
  const { data: courses, isLoading: coursesLoading } = useCourses();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dueDate) return;

    const assignmentData = {
      course: selectedCourse,
      title,
      description,
      due_date: dueDate.toISOString(),
      total_marks: totalMarks ? Number.parseInt(totalMarks) : undefined,
      file,
      teacher: courses ? courses[0].instructor : undefined,
    };

    createAssignment(assignmentData, {
      onSuccess: () => {
        router.push("/assignments");
      },
    });
  };

  const isFormValid = title && description && selectedCourse && dueDate;

  return (
    <Card className="max-w-2xl mx-auto shadow-none ">
      <CardHeader>
        <CardTitle>Assignment Details</CardTitle>
        <CardDescription>
          Fill in the information below to create a new assignment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="course">Course *</Label>
            <Select
              value={selectedCourse}
              onValueChange={setSelectedCourse}
              disabled={coursesLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses?.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Assignment Title *</Label>
            <Input
              id="title"
              placeholder="Enter assignment title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Enter assignment description and instructions"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Due Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalMarks">Total Marks</Label>
              <Input
                id="totalMarks"
                type="number"
                placeholder="100"
                value={totalMarks}
                onChange={(e) => setTotalMarks(e.target.value)}
                min="1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Assignment File (Optional)</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="file"
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
              {file && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Upload className="mr-1 h-4 w-4" />
                  {file.name}
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-4">
            <Button
              type="submit"
              disabled={!isFormValid || isPending}
              className="flex-1"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Assignment"
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
  );
}
