/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Calendar,
  FileText,
  User,
  Edit,
  Trash2,
  Download,
  Users,
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
  useAssignment,
  useAssignmentSubmissions,
} from "@/hooks/use-assignments";
import { format } from "date-fns";

interface AssignmentDetailsProps {
  assignmentId: string;
}

export function AssignmentDetails({ assignmentId }: AssignmentDetailsProps) {
  const { data: assignment, isLoading, error } = useAssignment(assignmentId);
  const { data: submissions, isLoading: submissionsLoading } =
    useAssignmentSubmissions(assignmentId);

  console.log(submissions);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load assignment details. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return <AssignmentDetailsSkeleton />;
  }

  if (!assignment) {
    return (
      <Alert>
        <AlertDescription>Assignment not found.</AlertDescription>
      </Alert>
    );
  }

  const dueDate = new Date(assignment.due_date);
  const isOverdue = dueDate < new Date();

  return (
    <div className="space-y-6 ">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {assignment.title}
          </h1>
          <p className="text-muted-foreground">Assignment Details</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="shadow-none">
            <Edit className="mr-2 h-4 w-4 " />
            Edit
          </Button>
          <Button
            variant="outline"
            className="text-destructive bg-transparent shadow-none"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details" className="shadow-none">
            Details
          </TabsTrigger>
          <TabsTrigger value="submissions" className="shadow-none">
            Submissions {submissions && `(${submissions.length})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="shadow-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Due Date</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {format(dueDate, "MMM dd")}
                </div>
                <p className="text-xs text-muted-foreground">
                  {format(dueDate, "yyyy 'at' HH:mm")}
                </p>
                {isOverdue && (
                  <Badge variant="destructive" className="mt-2">
                    Overdue
                  </Badge>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Marks
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {assignment.total_marks}
                </div>
                <p className="text-xs text-muted-foreground">Points</p>
              </CardContent>
            </Card>

            <Card className="shadow-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Submissions
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {submissions?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Student submissions
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>Assignment Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">
                {assignment.description}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>Instructor Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium">
                    {assignment?.teacher?.first_name}{" "}
                    {assignment?.teacher?.last_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {assignment?.teacher?.role}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {assignment.file && (
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle>Assignment File</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download Assignment File
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="submissions" className="space-y-4">
          {submissionsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : submissions && submissions.length > 0 ? (
            <div className="space-y-4">
              {submissions.map((submission) => (
                <SubmissionCard key={submission.id} submission={submission} />
              ))}
            </div>
          ) : (
            <Card className="shadow-none">
              <CardContent className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">
                  No submissions yet
                </h3>
                <p className="text-muted-foreground">
                  Students haven&apos;t submitted their assignments yet.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SubmissionCard({ submission }: { submission: any }) {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">
              {submission.student?.first_name} {submission.student?.last_name}
            </CardTitle>
            <CardDescription>
              Submitted {format(new Date(submission.submitted_at), "PPp")}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            {submission.grade ? (
              <Badge variant="default">{submission.grade} points</Badge>
            ) : (
              <Badge variant="secondary">Not graded</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4">{submission.content}</p>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline">
            View Submission
          </Button>
          {!submission.grade && <Button size="sm">Grade Submission</Button>}
        </div>
      </CardContent>
    </Card>
  );
}

function AssignmentDetailsSkeleton() {
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
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-20" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-24 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
