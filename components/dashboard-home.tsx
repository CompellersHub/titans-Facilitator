/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useDashboardStats } from "@/hooks/use-dashboard";
import { useStudents } from "@/hooks/use-students";
import { useCourses } from "@/hooks/use-courses";
import { useAssignments } from "@/hooks/use-assignments";
import { useLiveClasses } from "@/hooks/use-live-classes";
import { useCourseLibrary } from "@/hooks/use-course-library";
import {
  BookOpen,
  Users,
  FileText,
  MessageSquare,
  Plus,
  Video,
  Library,
  GraduationCap,
  UserPlus,
  Bell,
  TrendingUp,
  Activity,
  Calendar,
} from "lucide-react";
import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";
import Link from "next/link";

export function DashboardHome() {
  const { user, isLoading: authLoading, initializeAuth } = useAuth();
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useDashboardStats();
  // Fetch data for recent activities
  const { data: students } = useStudents();
  const { data: courses } = useCourses();
  const { data: assignments } = useAssignments();
  const { data: liveClasses } = useLiveClasses();
  const { data: libraryItems } = useCourseLibrary();
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
  const recentActivities = generateRecentActivities({
    students,
    courses,
    assignments,
    liveClasses,
    libraryItems,
  });

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
          value={courses?.length}
          icon={BookOpen}
          loading={statsLoading}
        />
        <StatsCard
          title="Total Students"
          value={students?.length}
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
        <StatsCard
          title="Live Classes"
          value={liveClasses?.length}
          icon={Video}
          loading={statsLoading}
        />
        <StatsCard
          title="Library Items"
          value={libraryItems?.length}
          icon={Library}
          loading={statsLoading}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Recent Activity</span>
                </CardTitle>
                <CardDescription>
                  Your latest interactions and updates
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities
                  .slice(0, 5)
                  .map((activity, index) => (
                    <RecentActivityItem key={index} activity={activity} />
                  ))
              ) : (
                <div className="text-center py-6">
                  <Activity className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No recent activity to display
                  </p>
                </div>
              )}
              {recentActivities.length > 5 && (
                <Button variant="ghost" size="sm" className="w-full">
                  View all activities
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Quick Actions</span>
            </CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <Link href="/courses/create">
                  <Button
                    variant="outline"
                    className="w-full h-auto p-4 flex flex-col items-center space-y-2 bg-transparent"
                  >
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium">Create Course</span>
                  </Button>
                </Link>
                <Link href="/schedule/create">
                  <Button
                    variant="outline"
                    className="w-full h-auto p-4 flex flex-col items-center space-y-2 bg-transparent"
                  >
                    <Video className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium">Schedule Class</span>
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Link href="/assignments/create">
                  <Button
                    variant="outline"
                    className="w-full h-auto p-4 flex flex-col items-center space-y-2 bg-transparent"
                  >
                    <GraduationCap className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium">New Assignment</span>
                  </Button>
                </Link>
                <Link href="/courses/library/create">
                  <Button
                    variant="outline"
                    className="w-full h-auto p-4 flex flex-col items-center space-y-2 bg-transparent"
                  >
                    <Library className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm font-medium">Add Resource</span>
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Link href="/students">
                  <Button
                    variant="outline"
                    className="w-full h-auto p-4 flex flex-col items-center space-y-2 bg-transparent"
                  >
                    <Users className="h-5 w-5 text-orange-600" />
                    <span className="text-sm font-medium">View Students</span>
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full h-auto p-4 flex flex-col items-center space-y-2 bg-transparent"
                >
                  <MessageSquare className="h-5 w-5 text-pink-600" />
                  <span className="text-sm font-medium">Send Message</span>
                </Button>
              </div>

              <Link href="/courses">
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  View All Courses
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function RecentActivityItem({ activity }: { activity: any }) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "course":
        return <BookOpen className="h-4 w-4 text-blue-600" />;
      case "student":
        return <UserPlus className="h-4 w-4 text-green-600" />;
      case "assignment":
        return <GraduationCap className="h-4 w-4 text-purple-600" />;
      case "live_class":
        return <Video className="h-4 w-4 text-red-600" />;
      case "library":
        return <Library className="h-4 w-4 text-emerald-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTimeDisplay = (date: Date) => {
    if (isToday(date)) {
      return `Today at ${format(date, "HH:mm")}`;
    } else if (isYesterday(date)) {
      return `Yesterday at ${format(date, "HH:mm")}`;
    } else {
      return formatDistanceToNow(date, { addSuffix: true });
    }
  };

  return (
    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex-shrink-0 mt-0.5">
        {getActivityIcon(activity.type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{activity.title}</p>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {activity.description}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted-foreground">
            {getTimeDisplay(activity.date)}
          </span>
          {activity.badge && (
            <Badge variant="secondary" className="text-xs">
              {activity.badge}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

function generateRecentActivities({
  students,
  courses,
  assignments,
  liveClasses,
  libraryItems,
}: {
  students?: any[];
  courses?: any[];
  assignments?: any[];
  liveClasses?: any[];
  libraryItems?: any[];
}) {
  const activities: any[] = [];

  // Recent courses
  if (courses) {
    courses.slice(0, 2).forEach((course: any) => {
      activities.push({
        type: "course",
        title: "New course created",
        description: `Created "${course.name}" course`,
        date: new Date(course.created_at || Date.now()),
        badge: course.level,
      });
    });
  }

  // Recent students (mock recent enrollments)
  if (students) {
    students.slice(0, 2).forEach((student: any) => {
      activities.push({
        type: "student",
        title: "New student enrolled",
        description: `${
          student.first_name || student.username
        } joined the platform`,
        date: new Date(student.created_at || Date.now()),
        badge: `${student.course.length} courses`,
      });
    });
  }

  // Recent assignments
  if (assignments) {
    assignments.slice(0, 2).forEach((assignment: any) => {
      activities.push({
        type: "assignment",
        title: "Assignment created",
        description: `Created "${assignment.title}" assignment`,
        date: new Date(assignment.created_at || Date.now()),
        badge: `${assignment.total_marks} pts`,
      });
    });
  }

  // Recent live classes
  if (liveClasses) {
    liveClasses.slice(0, 2).forEach((liveClass: any) => {
      activities.push({
        type: "live_class",
        title: "Live class scheduled",
        description: `Scheduled class for "${liveClass.course.name}"`,
        date: new Date(liveClass.created_at || Date.now()),
        badge: format(new Date(liveClass.start_time), "MMM dd"),
      });
    });
  }

  // Recent library items
  if (libraryItems) {
    libraryItems.slice(0, 2).forEach((item: any) => {
      activities.push({
        type: "library",
        title: "Resource added",
        description: `Added "${item.title}" to course library`,
        date: new Date(item.created_at || Date.now()),
        badge: item.file ? "File" : "Link",
      });
    });
  }

  // Sort by date (most recent first)
  return activities.sort((a, b) => b.date.getTime() - a.date.getTime());
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
