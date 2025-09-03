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
  Bell,
  TrendingUp,
  Activity,
  Calendar,
  Shield,
  Lock,
  BarChart3,
  Home,
  Wrench,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export function DashboardHome() {
  const { user, isLoading: authLoading, initializeAuth } = useAuth();
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useDashboardStats();
  const { data: students } = useStudents();
  const { data: courses } = useCourses();
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
      {/* Removed empty grid that caused parsing error */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 bg-blue-100 dark:bg-black p-2">
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
        {/* Available Tools */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Available Tools</span>
                </CardTitle>
                <CardDescription>
                  Access powerful tools to enhance your facilitation
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <ToolItem
                title="Compliance Management"
                description="Monitor and ensure regulatory compliance across all programs"
                url="https://compliance.titanscareers.com"
                icon="shield"
              />
              <ToolItem
                title="Anti-Money Laundering (AML)"
                description="Advanced AML monitoring and reporting system"
                url="https://aml.titanscareers.com"
                icon="security"
              />
              <ToolItem
                title="Management Dashboard"
                description="Comprehensive management tools and analytics"
                url="https://management.titanscareers.com"
                icon="dashboard"
              />
              <ToolItem
                title="Main Platform"
                description="Access the core Titans Careers platform"
                url="https://titanscareers.com"
                icon="home"
              />
              <ToolItem
                title="Tools Suite"
                description="Additional utility tools and resources"
                url="https://tools.titanscareers.com"
                icon="tools"
              />
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
                <Link href="/library/create">
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
                <Link href="/students?sendMail=true">
                  <Button
                    variant="outline"
                    className="w-full h-auto p-4 flex flex-col items-center space-y-2 bg-transparent"
                  >
                    <MessageSquare className="h-5 w-5 text-pink-600" />
                    <span className="text-sm font-medium">Send Message</span>
                  </Button>
                </Link>
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

function ToolItem({
  title,
  description,
  url,
  icon,
}: {
  title: string;
  description: string;
  url: string;
  icon: string;
}) {
  const getToolIcon = (iconType: string) => {
    switch (iconType) {
      case "shield":
        return <Shield className="h-4 w-4 text-blue-600" />;
      case "security":
        return <Lock className="h-4 w-4 text-red-600" />;
      case "dashboard":
        return <BarChart3 className="h-4 w-4 text-green-600" />;
      case "home":
        return <Home className="h-4 w-4 text-purple-600" />;
      case "tools":
        return <Wrench className="h-4 w-4 text-orange-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
    >
      <div className="flex-shrink-0 mt-0.5">{getToolIcon(icon)}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
            {title}
          </p>
          <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {description}
        </p>
        <div className="flex items-center mt-2">
          <Badge variant="outline" className="text-xs">
            External Tool
          </Badge>
        </div>
      </div>
    </a>
  );
}

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";

const statCardConfig = {
  "Total Courses": {
    accent: "from-blue-500 to-purple-500",
    tooltip: "All courses you facilitate.",
    link: "/courses",
    trend: 0,
  },
  "Total Students": {
    accent: "from-green-500 to-emerald-500",
    tooltip: "All students enrolled in your courses.",
    link: "/students",
    trend: 0,
  },
  "Pending Assignments": {
    accent: "from-yellow-500 to-orange-500",
    tooltip: "Assignments awaiting grading or submission.",
    link: "/assignments",
    trend: 0,
  },
  "Unread Messages": {
    accent: "from-pink-500 to-red-500",
    tooltip: "Messages you haven't read yet.",
    link: "/messages",
    trend: 0,
  },
  "Upcoming Classes": {
    accent: "from-cyan-500 to-blue-400",
    tooltip: "Classes scheduled in the future.",
    link: "/schedule",
    trend: 0,
  },
  "Live Classes": {
    accent: "from-indigo-500 to-blue-700",
    tooltip: "Classes currently live.",
    link: "/schedule",
    trend: 0,
  },
  "Library Items": {
    accent: "from-emerald-500 to-teal-400",
    tooltip: "Resources in your course library.",
    link: "/courses/library",
    trend: 0,
  },
};

type StatCardTitle = keyof typeof statCardConfig;

function StatsCard({
  title,
  value,
  icon: Icon,
  loading,
}: {
  title: StatCardTitle;
  value?: number;
  icon: React.ElementType;
  loading: boolean;
}) {
  const router = useRouter();
  const config = statCardConfig[title];
  return (
    <Card
      onClick={() => config.link && router.push(config.link)}
      className={`group relative overflow-hidden border-0 bg-gradient-to-br ${config.accent || "from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50"} shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/20 dark:to-gray-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-6">
        <CardTitle className="text-sm font-medium text-white tracking-wide">
          {title}
        </CardTitle>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="p-2 rounded-lg bg-white/20 group-hover:bg-white/40 transition-colors duration-200">
                <Icon className="h-5 w-5 text-white" />
              </div>
            </TooltipTrigger>
            {config.tooltip && <TooltipContent>{config.tooltip}</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent className="pb-6">
        {loading ? (
          <Skeleton className="h-10 w-20" />
        ) : (
          <div className="space-y-1">
            <div className="text-3xl font-bold text-white tracking-tight">
              {value?.toLocaleString() ?? 0}
            </div>
            <div className="h-1 w-8 bg-white/40 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
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
