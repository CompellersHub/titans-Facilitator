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

export function DashboardHome() {
  const { user, isLoading: authLoading, initializeAuth } = useAuth();
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useDashboardStats();
  console.log(statsError);

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
            ? user?.bio.substring(0, 100) + "..."
            : "Here's what's happening with your courses today."}
        </p>
      </div>

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
          value={stats?.total_courses}
          icon={BookOpen}
          loading={statsLoading}
        />
        <StatsCard
          title="Total Students"
          value={stats?.total_students}
          icon={Users}
          loading={statsLoading}
        />
        <StatsCard
          title="Pending Assignments"
          value={stats?.pending_assignments}
          icon={FileText}
          loading={statsLoading}
        />
        <StatsCard
          title="Unread Messages"
          value={stats?.unread_messages}
          icon={MessageSquare}
          loading={statsLoading}
        />
        <StatsCard
          title="Upcoming Classes"
          value={stats?.upcoming_classes.length}
          icon={Calendar}
          loading={statsLoading}
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
}: {
  title: string;
  value?: number;
  icon: React.ElementType;
  loading: boolean;
}) {
  return (
    <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/20 dark:to-gray-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-6">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 tracking-wide">
          {title}
        </CardTitle>
        <div className="p-2 rounded-lg bg-gray-100/80 dark:bg-gray-800/80 group-hover:bg-gray-200/80 dark:group-hover:bg-gray-700/80 transition-colors duration-200">
          <Icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </div>
      </CardHeader>

      <CardContent className="pb-6">
        {loading ? (
          <Skeleton className="h-10 w-20" />
        ) : (
          <div className="space-y-1">
            <div className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              {value?.toLocaleString() ?? 0}
            </div>
            <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
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
