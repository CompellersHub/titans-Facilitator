/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Calendar,
  Clock,
  Users,
  Video,
  ExternalLink,
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
import { useLiveClasses } from "@/hooks/use-live-classes";
import { format, isAfter, isBefore, addHours } from "date-fns";
import Link from "next/link";
import type { LiveClass } from "@/lib/types";

export function SchedulePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "upcoming" | "live" | "completed"
  >("all");
  const { data: liveClasses, isLoading, error } = useLiveClasses();

  const getClassStatus = (liveClass: LiveClass) => {
    const now = new Date();
    const startTime = new Date(liveClass.start_time);
    const endTime = new Date(liveClass.end_time);

    if (isBefore(now, startTime)) return "upcoming";
    if (isAfter(now, startTime) && isBefore(now, endTime)) return "live";
    return "completed";
  };

  const filteredClasses = liveClasses?.filter((liveClass) => {
    const matchesSearch = liveClass.course.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const status = getClassStatus(liveClass);
    const matchesFilter = filterStatus === "all" || status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const upcomingClasses =
    liveClasses?.filter((c) => getClassStatus(c) === "upcoming") || [];
  const liveNow =
    liveClasses?.filter((c) => getClassStatus(c) === "live") || [];

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load live classes. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Live Classes Schedule
          </h1>
          <p className="text-muted-foreground">
            Manage your live class sessions and virtual meetings
          </p>
        </div>
        <Link href="/schedule/create">
          <Button className="">
            <Plus className="mr-2 h-4 w-4" />
            Schedule Class
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Live Now
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {liveNow.length}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <Video className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Upcoming
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {upcomingClasses.length}
                </p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Classes
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {liveClasses?.length || 0}
                </p>
              </div>
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Calendar className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  This Week
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {liveClasses?.filter((c) => {
                    const classDate = new Date(c.start_time);
                    const weekFromNow = addHours(new Date(), 168); // 7 days
                    return (
                      isAfter(classDate, new Date()) &&
                      isBefore(classDate, weekFromNow)
                    );
                  }).length || 0}
                </p>
              </div>
              <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          <div className="flex space-x-2">
            {["all", "upcoming", "live", "completed"].map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus(status as any)}
                className="capitalize"
              >
                {status}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Classes Grid */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredClasses?.map((liveClass) => (
            <LiveClassCard key={liveClass.id} liveClass={liveClass} />
          ))}
        </div>
      )}

      {filteredClasses?.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No classes found</h3>
          <p className="text-muted-foreground">
            {searchTerm
              ? "Try adjusting your search terms"
              : "Get started by scheduling your first live class"}
          </p>
          {!searchTerm && (
            <Link href="/schedule/create">
              <Button className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Schedule Class
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

function LiveClassCard({ liveClass }: { liveClass: LiveClass }) {
  const getClassStatus = (liveClass: LiveClass) => {
    const now = new Date();
    const startTime = new Date(liveClass.start_time);
    const endTime = new Date(liveClass.end_time);

    if (isBefore(now, startTime)) return "upcoming";
    if (isAfter(now, startTime) && isBefore(now, endTime)) return "live";
    return "completed";
  };

  const status = getClassStatus(liveClass);
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
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg line-clamp-1">
              {liveClass.course.name}
            </CardTitle>
            <CardDescription className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>
                {liveClass.teacher
                  ? `${liveClass.teacher.first_name} ${liveClass.teacher.last_name}`
                  : "No instructor assigned"}
              </span>
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              className={`${statusConfig[status].color} ${
                statusConfig[status].label === "live" ? "animate-pulse" : ""
              }`}
            >
              {statusConfig[status].label}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            {format(startTime, "MMM dd, yyyy")}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-2 h-4 w-4" />
            {format(startTime, "HH:mm")} - {format(endTime, "HH:mm")}
          </div>
        </div>

        <div className="flex space-x-2">
          <Link href={`/schedule/${liveClass.id}`} className="flex-1">
            <Button
              variant="outline"
              size="sm"
              className="w-full bg-transparent"
            >
              View Details
            </Button>
          </Link>
          {status === "live" && (
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => window.open(liveClass.link, "_blank")}
            >
              <ExternalLink className="mr-1 h-4 w-4" />
              Join
            </Button>
          )}
          {status === "upcoming" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(liveClass.link, "_blank")}
            >
              <ExternalLink className="mr-1 h-4 w-4" />
              Link
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
