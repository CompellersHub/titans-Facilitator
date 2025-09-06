"use client";
import {
  Calendar,
  Clock,
  User,
  Edit,
  Trash2,
  ExternalLink,
  Copy,
  Users,
  Video,
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
import { useLiveClass } from "@/hooks/use-live-classes";
import { useUpdateLiveClass, useDeleteLiveClass } from "@/hooks/use-live-classes";
import { useRouter } from "next/navigation";
import { format, isAfter, isBefore } from "date-fns";
import { toast } from "sonner";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface LiveClassDetailsProps {
  classId: string;
}

export function LiveClassDetails({ classId }: LiveClassDetailsProps) {
  const { data: liveClass, isLoading, error } = useLiveClass(classId);
  const { mutate: updateLiveClass } = useUpdateLiveClass();
  const { mutate: deleteLiveClass, isPending: deleting } = useDeleteLiveClass();
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [editLink, setEditLink] = useState("");
  const [editStart, setEditStart] = useState("");
  const [editEnd, setEditEnd] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied successfully!");
  };

  const handleDelete = () => {
    deleteLiveClass(classId, {
      onSuccess: () => {
        toast.success("Live class deleted successfully");
        setDeleteDialogOpen(false);
        router.push("/schedule");
      },
      onError: (error) => {
        console.error("Delete error:", error);
        toast.error("Failed to delete live class");
        setDeleteDialogOpen(false);
      },
    });
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load live class details. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return <LiveClassDetailsSkeleton />;
  }

  if (!liveClass) {
    return (
      <Alert>
        <AlertDescription>Live class not found.</AlertDescription>
      </Alert>
    );
  }

  const getClassStatus = () => {
    const now = new Date();
    const startTime = new Date(liveClass.start_time);
    const endTime = new Date(liveClass.end_time);

    if (isBefore(now, startTime)) return "upcoming";
    if (isAfter(now, startTime) && isBefore(now, endTime)) return "live";
    return "completed";
  };

  const status = getClassStatus();
  const startTime = new Date(liveClass.start_time);
  const endTime = new Date(liveClass.end_time);

  const statusConfig = {
    upcoming: { color: "bg-blue-100 text-blue-800", label: "Upcoming" },
    live: {
      color: "bg-green-100 text-green-800",
      label: "Live Now",
      pulse: true,
    },
    completed: { color: "bg-gray-100 text-gray-800", label: "Completed" },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {liveClass.course.name}
          </h1>
          <p className="text-muted-foreground">Live Class Details</p>
        </div>
        <div className="flex space-x-2">
          {status === "live" && (
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => window.open(liveClass.link, "_blank")}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Join Live Class
            </Button>
          )}
          <Button variant="outline" onClick={() => {
            setEditLink(liveClass.link);
            setEditStart(liveClass.start_time.slice(0,16));
            setEditEnd(liveClass.end_time.slice(0,16));
            setEditOpen(true);
          }}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <ConfirmDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            title="Delete Live Class?"
            description="Are you sure you want to delete this live class? This action cannot be undone."
            confirmText="Delete"
            cancelText="Cancel"
            onConfirm={handleDelete}
            loading={deleting}
            trigger={
              <Button
                variant="outline"
                className="text-destructive bg-transparent"
                disabled={deleting}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            }
          />
        </div>
      </div>

      {/* Edit Modal */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Live Class</h2>
            <label className="block mb-2 font-semibold">Meeting Link</label>
            <input type="url" value={editLink} onChange={e => setEditLink(e.target.value)} className="w-full mb-4 p-2 border rounded" />
            <label className="block mb-2 font-semibold">Start Time</label>
            <input type="datetime-local" value={editStart} onChange={e => setEditStart(e.target.value)} className="w-full mb-4 p-2 border rounded" />
            <label className="block mb-2 font-semibold">End Time</label>
            <input type="datetime-local" value={editEnd} onChange={e => setEditEnd(e.target.value)} className="w-full mb-4 p-2 border rounded" />
            <div className="flex gap-4 mt-4">
              <Button onClick={() => setEditOpen(false)} variant="outline">Cancel</Button>
              <Button onClick={() => {
                updateLiveClass({
                  classId,
                  data: {
                    link: editLink,
                    start_time: new Date(editStart).toISOString(),
                    end_time: new Date(editEnd).toISOString(),
                  },
                }, {
                  onSuccess: () => {
                    toast.success("Live class updated.");
                    setEditOpen(false);
                  },
                  onError: () => toast.error("Failed to update live class."),
                });
              }}>
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Video className="h-5 w-5 text-blue-600" />
                  <span>Class Information</span>
                </CardTitle>
                <Badge
                  className={`${statusConfig[status].color} ${
                    statusConfig[status].label === "live" ? "animate-pulse" : ""
                  }`}
                >
                  {statusConfig[status].label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Date</span>
                  </div>
                  <p className="font-medium">
                    {format(startTime, "EEEE, MMMM dd, yyyy")}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>Time</span>
                  </div>
                  <p className="font-medium">
                    {format(startTime, "HH:mm")} - {format(endTime, "HH:mm")}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  <span>Meeting Link</span>
                </div>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 p-2 bg-muted rounded text-sm font-mono">
                    {liveClass.link}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(liveClass.link)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => window.open(liveClass.link, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      window.open(`mailto:?subject=Join Live Class&body=Join here: ${liveClass.link}`);
                    }}
                  >
                    <Users className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="details" className="space-y-4">
            <TabsList>
              <TabsTrigger value="details">Class Details</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="materials">Materials</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Course Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Course Name</h4>
                      <p className="text-muted-foreground">
                        {liveClass.course.name}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Instructor</h4>
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {liveClass.teacher
                              ? `${liveClass.teacher.first_name} ${liveClass.teacher.last_name}`
                              : "No instructor assigned"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Course Instructor
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="students" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Enrolled Students</CardTitle>
                  <CardDescription>
                    Students who can join this live class
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">
                      Student list coming soon
                    </h3>
                    <p className="text-muted-foreground">
                      Integration with student enrollment system in progress
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="materials" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Class Materials</CardTitle>
                  <CardDescription>
                    Resources and materials for this live class
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Video className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">
                      No materials uploaded
                    </h3>
                    <p className="text-muted-foreground">
                      Upload presentation slides, documents, or other resources
                    </p>
                    <Button className="mt-4 bg-transparent" variant="outline">
                      Upload Materials
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {status === "live" && (
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Join Live Class
                </Button>
              )}
              <Button className="w-full bg-transparent" variant="outline">
                <Copy className="mr-2 h-4 w-4" />
                Copy Meeting Link
              </Button>
              <Button className="w-full bg-transparent" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Add to Calendar
              </Button>
              <Button className="w-full bg-transparent" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Send Invitations
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Class Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Duration</span>
                <span className="font-medium">
                  {Math.round(
                    (endTime.getTime() - startTime.getTime()) / (1000 * 60)
                  )}{" "}
                  minutes
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge className={statusConfig[status].color}>
                  {statusConfig[status].label}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Created</span>
                <span className="font-medium">
                  {liveClass.created_at
                    ? format(new Date(liveClass.created_at), "MMM dd, yyyy")
                    : "N/A"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function LiveClassDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-32 mt-2" />
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-20" />
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
