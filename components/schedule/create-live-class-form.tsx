"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarIcon,
  Clock,
  Loader2,
  Video,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useCreateLiveClass } from "@/hooks/use-live-classes";
import { useCourses } from "@/hooks/use-courses";
import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { LiveClassProvider } from "@/lib/types";

const PROVIDERS: LiveClassProvider[] = [
  {
    id: "google",
    name: "Google Meet",
    icon: "🎥",
    color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
  },
  {
    id: "zoom",
    name: "Zoom",
    icon: "📹",
    color: "bg-indigo-50 border-indigo-200 hover:bg-indigo-100",
  },
  {
    id: "jitsi",
    name: "Jitsi Meet",
    icon: "🎬",
    color: "bg-green-50 border-green-200 hover:bg-green-100",
  },
  {
    id: "aws",
    name: "AWS Chime",
    icon: "☁️",
    color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
  },
  {
    id: "stream",
    name: "Stream",
    icon: "📺",
    color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
  },
];

export function CreateLiveClassForm() {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [selectedProvider, setSelectedProvider] =
    useState<LiveClassProvider | null>(null);
  const [linkError, setLinkError] = useState<string>("");

  const router = useRouter();
  const { user } = useAuth();
  const { mutate: createLiveClass, isPending, error } = useCreateLiveClass();
  const { data: courses, isLoading: coursesLoading } = useCourses();

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLinkError("");
    if (!selectedDate || !startTime || !endTime || !selectedCourse || !user)
      return;
    if (!meetingLink || !validateUrl(meetingLink)) {
      setLinkError("Please enter a valid meeting URL.");
      return;
    }

    const startDateTime = new Date(selectedDate);
    const [startHour, startMinute] = startTime.split(":");
    startDateTime.setHours(
      Number.parseInt(startHour),
      Number.parseInt(startMinute)
    );

    const endDateTime = new Date(selectedDate);
    const [endHour, endMinute] = endTime.split(":");
    endDateTime.setHours(Number.parseInt(endHour), Number.parseInt(endMinute));

    const classData = {
      course_id: selectedCourse,
      teacher_id: user.pk,
      start_time: startDateTime.toISOString(),
      end_time: endDateTime.toISOString(),
      link: meetingLink,
      provider: selectedProvider?.id,
    };

    createLiveClass(classData, {
      onSuccess: () => {
        router.push("/schedule");
      },
    });
  };

  const generateMeetingLink = (provider: LiveClassProvider) => {
    const links = {
      google: "https://meet.google.com/new",
      zoom: "https://zoom.us/start/webmeeting",
      jitsi: "https://meet.jit.si/TitansClass" + Date.now(),
      aws: "https://chime.aws/",
      stream: "https://getstream.io/",
    };
    setMeetingLink(links[provider.id]);
  };

  const isFormValid =
    selectedCourse && selectedDate && startTime && endTime && meetingLink;

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Video className="h-6 w-6 text-blue-600" />
            <span>Schedule Live Class</span>
          </CardTitle>
          <CardDescription>
            Create a new live class session for your students
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            )}

            {/* Course Selection */}
            <div className="space-y-2">
              <Label htmlFor="course">Select Course *</Label>
              <Select
                value={selectedCourse}
                onValueChange={setSelectedCourse}
                disabled={coursesLoading}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Choose a course for this live class" />
                </SelectTrigger>
                <SelectContent>
                  {courses?.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center text-white text-xs font-bold">
                          {course.name.charAt(0)}
                        </div>
                        <span>{course.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date and Time Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Class Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-12 justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate
                        ? format(selectedDate, "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time *</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">End Time *</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Provider Selection */}
            <div className="space-y-4">
              <Label>Select Video Platform *</Label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {PROVIDERS.map((provider) => (
                  <Card
                    key={provider.id}
                    className={cn(
                      "cursor-pointer transition-all duration-200 hover:shadow-md border-2 border-dashed",
                      selectedProvider?.id === provider.id
                        ? "ring-2 shadow-md border-2 border-white"
                        : "border-muted",
                      // Company color backgrounds
                      provider.id === "zoom"
                        ? "bg-blue-600 text-white border-blue-600 dark:bg-blue-700 dark:text-white"
                        : provider.id === "google"
                        ? "bg-green-500 text-white border-green-500 dark:bg-green-600 dark:text-white"
                        : provider.id === "jitsi"
                        ? "bg-teal-500 text-white border-teal-500 dark:bg-teal-600 dark:text-white"
                        : provider.id === "aws"
                        ? "bg-orange-500 text-white border-orange-500 dark:bg-orange-600 dark:text-white"
                        : provider.id === "stream"
                        ? "bg-purple-600 text-white border-purple-600 dark:bg-purple-700 dark:text-white"
                        : "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                    )}
                    style={{
                      background:
                        selectedProvider?.id === provider.id
                          ? provider.id === "zoom"
                            ? "linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)"
                            : provider.id === "google"
                            ? "linear-gradient(90deg, #34a853 0%, #4285f4 100%)"
                            : provider.id === "jitsi"
                            ? "linear-gradient(90deg, #14b8a6 0%, #22d3ee 100%)"
                            : provider.id === "aws"
                            ? "linear-gradient(90deg, #f59e42 0%, #fbbf24 100%)"
                            : provider.id === "stream"
                            ? "linear-gradient(90deg, #a78bfa 0%, #7c3aed 100%)"
                            : "linear-gradient(90deg, #2563eb 0%, #7c3aed 100%)"
                          : undefined,
                      color:
                        selectedProvider?.id === provider.id
                          ? "#fff"
                          : undefined,
                    }}
                    onClick={() => {
                      setSelectedProvider(provider);
                      generateMeetingLink(provider);
                    }}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-2">{provider.icon}</div>
                      <p className="text-sm font-medium">{provider.name}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Meeting Link */}
            <div className="space-y-2">
              <Label htmlFor="meetingLink">Meeting Link *</Label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="meetingLink"
                    type="url"
                    placeholder="https://meet.google.com/abc-defg-hij"
                    value={meetingLink}
                    onChange={(e) => {
                      setMeetingLink(e.target.value);
                      setLinkError("");
                    }}
                    className="pl-10 h-12"
                    required
                  />
                </div>
                {selectedProvider && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => generateMeetingLink(selectedProvider)}
                    className="h-12"
                  >
                    Generate
                  </Button>
                )}
              </div>
              {linkError && (
                <p className="text-xs text-red-600 font-semibold mt-1">
                  {linkError}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {selectedProvider
                  ? `Generate a new ${selectedProvider.name} meeting link or paste your own`
                  : "Select a platform above to generate a meeting link"}
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4 pt-6">
              <Button
                type="submit"
                disabled={!isFormValid || isPending}
                className="flex-1  "
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scheduling Class...
                  </>
                ) : (
                  <>
                    <Video className="mr-2 h-4 w-4" />
                    Schedule Live Class
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className=""
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
