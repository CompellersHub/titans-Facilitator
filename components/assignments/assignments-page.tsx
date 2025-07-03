"use client";

import { useState } from "react";
import { Plus, Search, Filter, Calendar, FileText, Users } from "lucide-react";
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
import { useAssignments } from "@/hooks/use-assignments";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

export function AssignmentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: assignments, isLoading, error } = useAssignments();

  const filteredAssignments = assignments?.filter((assignment) =>
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load assignments. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
          <p className="text-muted-foreground">
            Manage and track your course assignments
          </p>
        </div>
        <Link href="/assignments/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Assignment
          </Button>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 shadow-none"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="shadow-none">
              <CardHeader>
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAssignments?.map((assignment) => (
            <AssignmentCard key={assignment.id} assignment={assignment} />
          ))}
        </div>
      )}

      {filteredAssignments?.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No assignments found</h3>
          <p className="text-muted-foreground">
            {searchTerm
              ? "Try adjusting your search terms"
              : "Get started by creating your first assignment"}
          </p>
          {!searchTerm && (
            <Link href="/assignments/create">
              <Button className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Create Assignment
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function AssignmentCard({ assignment }: { assignment: any }) {
  const dueDate = new Date(assignment.due_date);
  const isOverdue = dueDate < new Date();
  const isDueSoon =
    dueDate < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && !isOverdue;

  return (
    <Link href={`/assignments/${assignment.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer shadow-none">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg">{assignment.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {assignment.description}
              </CardDescription>
            </div>
            <Badge
              variant={
                isOverdue ? "destructive" : isDueSoon ? "secondary" : "default"
              }
            >
              {isOverdue ? "Overdue" : isDueSoon ? "Due Soon" : "Active"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4" />
              Due {formatDistanceToNow(dueDate, { addSuffix: true })}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <FileText className="mr-2 h-4 w-4" />
              {assignment.total_marks} points
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="mr-2 h-4 w-4" />
              Course ID: {assignment.course_id}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
