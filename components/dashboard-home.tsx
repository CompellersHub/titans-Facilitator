"use client";

import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/use-auth";
import { useDashboardStats } from "@/hooks/use-dashboard";
import {
  BookOpen,
  Users,
  FileText,
  MessageSquare,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function DashboardHome() {
  const { user, isLoading: authLoading, initializeAuth } = useAuth();
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useDashboardStats();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (authLoading) {
    return <DashboardHomeSkeleton />;
  }
  console.log("User object:", JSON.stringify(user, null, 2));
  const displayName = user
    ? `${user.first_name} ${user.last_name}`
    : "Facilitator";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {displayName}!
        </h1>
        <p className="text-muted-foreground">
          {user?.bio
            ? user.bio.substring(0, 100) + "..."
            : "Here's what's happening with your courses today."}
        </p>
      </div>
      {/* {user && (
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <div className="flex justify-between">
                <span className="font-medium">Name:</span>
                <span>
                  {user.first_name} {user.last_name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Username:</span>
                <span>{user.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">User ID:</span>
                <span>{user.pk}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )} */}

      {statsError && (
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load dashboard statistics. Please check your connection
            and try again.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatsCard
          title="Total Courses"
          value={stats?.totalCourses}
          icon={BookOpen}
          loading={statsLoading}
          cardColor="bg-blue-50"
        />
        <StatsCard
          title="Total Students"
          value={stats?.totalStudents}
          icon={Users}
          loading={statsLoading}
          cardColor="bg-orange-50"
        />
        <StatsCard
          title="Pending Assignments"
          value={stats?.pendingAssignments}
          icon={FileText}
          loading={statsLoading}
          cardColor="bg-yellow-50"
        />
        <StatsCard
          title="Unread Messages"
          value={stats?.unreadMessages}
          icon={MessageSquare}
          loading={statsLoading}
          cardColor="bg-emerald-50"
        />
        <StatsCard
          title="Upcoming Classes"
          value={stats?.upcomingClasses}
          icon={Calendar}
          loading={statsLoading}
          cardColor="bg-purple-50"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest interactions and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No recent activity to display.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Quick action buttons will be added here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatsCard({
  title,
  value,
  icon: Icon,
  loading,
  cardColor,
}: {
  title: string;
  value?: number;
  icon: React.ElementType;
  loading: boolean;
  cardColor: string;
}) {
  return (
    <Card className={cn(cardColor, "border-none shadow-md")}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground ">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <div className="text-3xl font-bold text-primary">{value ?? 0}</div>
        )}
      </CardContent>
    </Card>
  );
}

function DashboardHomeSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96 mt-2" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
