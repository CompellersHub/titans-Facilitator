"use client";


import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import {
  Search,
  Filter,
  Users,
  BookOpen,
  Phone,
  Mail,
  GraduationCap,
  Eye,
  Edit,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStudents } from "@/hooks/use-students";
import { useCourses } from "@/hooks/use-courses";
import { useSendMail } from "@/hooks/use-send-mail";
import { format } from "date-fns";
import Link from "next/link";
import type { Student } from "@/lib/types";
import { Checkbox } from "../ui/checkbox";

const ITEMS_PER_PAGE = 10;

export function StudentsPage() {
  const [teacherName, setTeacherName] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [mailSheetOpen, setMailSheetOpen] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [mailSubject, setMailSubject] = useState("");
  const [mailBody, setMailBody] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [enrollmentFilter, setEnrollmentFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Student>("last_name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const { data: students, isLoading, error } = useStudents();
  const { data: courses } = useCourses();
  const { mutate: sendMail } = useSendMail();

  const filteredStudents = students?.filter((student) => {
    const matchesSearch =
      student.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.username.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCourse =
      selectedCourse === "all" ||
      student.course.some((course) => course.id === selectedCourse);

    const matchesEnrollment =
      enrollmentFilter === "all" ||
      (enrollmentFilter === "enrolled" && student.course.length > 0) ||
      (enrollmentFilter === "not-enrolled" && student.course.length === 0);

    return matchesSearch && matchesCourse && matchesEnrollment;
  });

  // Sort students
  const sortedStudents = filteredStudents?.sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // Handle special cases
    if (sortField === "course") {
      aValue = a.course.length.toString();
      bValue = b.course.length.toString();
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  // Pagination
  const totalPages = Math.ceil((sortedStudents?.length || 0) / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedStudents = sortedStudents?.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const totalStudents = students?.length || 0;
  const enrolledStudents =
    students?.filter((s) => s.course.length > 0).length || 0;
  const unenrolledStudents = totalStudents - enrolledStudents;
  const averageCoursesPerStudent =
    totalStudents > 0
      ? (students?.reduce((acc, s) => acc + s.course.length, 0) || 0) /
        totalStudents
      : 0;

  const handleSort = (field: keyof Student) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load students. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">
            Manage and track your student enrollments
          </p>
        </div>
        <Dialog open={mailSheetOpen} onOpenChange={setMailSheetOpen}>
          <DialogTrigger asChild>
            <Button>
              <Mail className="mr-2 h-4 w-4" />
              Send Mail
            </Button>
          </DialogTrigger>
          <DialogContent className="mx-auto w-full max-w-4xl wide-dialog">
            {/* Modern Send Mail Modal UX - Full Width */}
            <div className="flex flex-col h-full w-full max-w-4xl min-h-[600px] px-0 mx-auto">
              <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-gradient-to-r from-blue-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-800 rounded-t-2xl">
                <div>
                  <DialogTitle className="text-2xl font-bold flex items-center gap-4">
                    <Mail className="h-8 w-8 text-blue-600 "  />
                    Send Mail to Students
                  </DialogTitle>
                  <DialogDescription className="mt-2 text-lg text-muted-foreground">
                    Select recipients and compose your message below.
                  </DialogDescription>
                </div>
                <DialogClose asChild>
                  <button className="text-3xl text-muted-foreground hover:text-blue-600 transition-colors" aria-label="Close">×</button>
                </DialogClose>
              </div>
              <div className="flex-1 overflow-y-auto px-10 py-8 bg-background grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left: Compose Section */}
                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-base font-semibold mb-2" htmlFor="teacher-name">Your Name</label>
                      <Input
                        id="teacher-name"
                        placeholder="Enter your name"
                        value={teacherName}
                        onChange={(e) => setTeacherName(e.target.value)}
                        className="bg-white dark:bg-input/40 border border-input focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-base font-semibold mb-2" htmlFor="teacher-email">Your Email</label>
                      <Input
                        id="teacher-email"
                        placeholder="Enter your email"
                        value={teacherEmail}
                        onChange={(e) => setTeacherEmail(e.target.value)}
                        className="bg-white dark:bg-input/40 border border-input focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-base font-semibold mb-2" htmlFor="mail-subject">Subject</label>
                    <Input
                      id="mail-subject"
                      placeholder="Subject"
                      value={mailSubject}
                      onChange={(e) => setMailSubject(e.target.value)}
                      className="bg-white dark:bg-input/40 border border-input focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-lg"
                    />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <label className="block text-base font-semibold mb-2" htmlFor="mail-body">Message</label>
                    <textarea
                      id="mail-body"
                      className="w-full min-h-[220px] md:min-h-[260px] border rounded-xl p-5 bg-white dark:bg-input/40 border-input focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-lg resize-vertical shadow-sm flex-1"
                      placeholder="Write your message to selected students..."
                      value={mailBody}
                      onChange={(e) => setMailBody(e.target.value)}
                      style={{ fontSize: '1.15rem', lineHeight: '1.7' }}
                    />
                  </div>
                </div>
                {/* Right: Recipients Section */}
                <div className="flex flex-col h-full gap-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-xl">Recipients</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs px-2 py-1"
                      onClick={() => {
                        if (students && selectedStudents.length === students.length) {
                          setSelectedStudents([]);
                        } else {
                          setSelectedStudents(students?.map(s => s.id) || []);
                        }
                      }}
                      disabled={students?.length === 0}
                    >
                      {students && selectedStudents.length === students.length ? "Deselect All" : "Select All"}
                    </Button>
                  </div>
                  <div className="grid gap-2 max-h-[520px] overflow-y-auto border rounded-xl p-4 flex-1 bg-white dark:bg-zinc-900">
                    {students?.map((student) => (
                      <label key={student.id} className="flex flex-col md:flex-row md:items-center gap-2 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950 rounded px-2 py-2 transition-colors">
                        <div className="flex items-center gap-2 min-w-0">
                          <Checkbox
                            checked={selectedStudents.includes(student.id)}
                            onCheckedChange={(checked: boolean) => {
                              setSelectedStudents((prev) =>
                                checked
                                  ? [...prev, student.id]
                                  : prev.filter((id) => id !== student.id)
                              );
                            }}
                          />
                          <span className="text-base font-medium truncate">
                            <span className="font-semibold text-blue-700 dark:text-blue-300">{student.first_name} {student.last_name}</span>
                            <span className="text-xs text-muted-foreground ml-2">{student.email}</span>
                          </span>
                        </div>
                        {student.course.length > 0 && (
                          <div className="flex flex-wrap gap-1 ml-7 md:ml-0">
                            {student.course.map((course, idx) => {
                              // Color flow: blue, green, orange, purple, repeat
                              const badgeColors = [
                                'bg-blue-100 text-blue-700 border-blue-300',
                                'bg-green-100 text-green-700 border-green-300',
                                'bg-orange-100 text-orange-700 border-orange-300',
                                'bg-purple-100 text-purple-700 border-purple-300',
                              ];
                              const color = badgeColors[idx % badgeColors.length];
                              return (
                                <span
                                  key={course.id}
                                  className={`px-2 py-0.5 rounded border text-xs font-semibold ${color}`}
                                >
                                  {course.name.length > 18 ? `${course.name.slice(0, 18)}...` : course.name}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
                <div className="border-t border-border px-3 py-2 bg-gradient-to-r from-blue-50/60 via-white/60 to-emerald-50/60 dark:from-gray-900/40 dark:to-gray-800/40 rounded-b-2xl flex items-center gap-4">
                <Button
                  className="w-full text-lg font-semibold py-4"
                  disabled={
                    selectedStudents.length === 0 ||
                    !mailSubject ||
                    !mailBody ||
                    !teacherName ||
                    !teacherEmail
                  }
                  onClick={() => {
                    const studentEmails = selectedStudents
                      .map(id => students?.find(s => s.id === id)?.email)
                      .filter((email): email is string => Boolean(email));
                    sendMail(
                      {
                        student_email: studentEmails,
                        subject: mailSubject,
                        message: mailBody,
                        teacher_name: teacherName,
                        teacher_email: teacherEmail,
                      },
                      {
                        onSuccess: () => {
                          setMailSheetOpen(false);
                          setSelectedStudents([]);
                          setMailSubject("");
                          setMailBody("");
                          setTeacherName("");
                          setTeacherEmail("");
                        },
                        onError: () => {
                          alert("Failed to send mail. Please try again.");
                        },
                      }
                    );
                  }}
                >
                  Send Mail
                </Button>
              </div>
            </div>
          </DialogContent>
  </Dialog>
  {/* ...existing code... */}
</div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Students
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {totalStudents}
                </p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Enrolled
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {enrolledStudents}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <GraduationCap className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Not Enrolled
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {unenrolledStudents}
                </p>
              </div>
              <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Avg Courses
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {averageCoursesPerStudent.toFixed(1)}
                </p>
              </div>
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {courses?.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={enrollmentFilter} onValueChange={setEnrollmentFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by enrollment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Students</SelectItem>
              <SelectItem value="enrolled">Enrolled</SelectItem>
              <SelectItem value="not-enrolled">Not Enrolled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          More Filters
        </Button>
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Students ({filteredStudents?.length || 0})</CardTitle>
          <CardDescription>
            Showing {startIndex + 1} to{" "}
            {Math.min(
              startIndex + ITEMS_PER_PAGE,
              filteredStudents?.length || 0
            )}{" "}
            of {filteredStudents?.length || 0} students
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort("email")}
                    >
                      Email{" "}
                      {sortField === "email" &&
                        (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort("course" as keyof Student)}
                    >
                      Courses{" "}
                      {sortField === "course" &&
                        (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedStudents?.map((student) => (
                    <StudentTableRow key={student.id} student={student} />
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}

          {filteredStudents?.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No students found</h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "No students match the current filters"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StudentTableRow({ student }: { student: Student }) {
  const displayName =
    student.first_name && student.last_name
      ? `${student.first_name} ${student.last_name}`
      : student.username;
  const [singleMailOpen, setSingleMailOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const { mutate: sendMail } = useSendMail();

  return (
    <>
      <TableRow className="hover:bg-muted/50">
        <TableCell>
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`}
              />
              <AvatarFallback className="text-xs">
                {student.first_name?.[0] || student.username[0]}
                {student.last_name?.[0] || student.username[1] || ""}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{displayName}</div>
              <div className="text-sm text-muted-foreground">
                @{student.username}
              </div>
            </div>
          </div>
        </TableCell>
        <TableCell>
        <div className="flex items-center space-x-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{student.email}</span>
        </div>
      </TableCell>
      <TableCell>
        {student.phone_number ? (
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{student.phone_number}</span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">Not provided</span>
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{student.course.length}</Badge>
          {student.course.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {student.course.slice(0, 2).map((course) => (
                <Badge key={course.id} variant="outline" className="text-xs">
                  {course.name.length > 15
                    ? `${course.name.slice(0, 15)}...`
                    : course.name}
                </Badge>
              ))}
              {student.course.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{student.course.length - 2}
                </Badge>
              )}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={student.course.length > 0 ? "default" : "secondary"}>
          {student.course.length > 0 ? "Enrolled" : "Not Enrolled"}
        </Badge>
      </TableCell>
      <TableCell>
        {student.created_at ? (
          <span className="text-sm text-muted-foreground">
            {format(new Date(student.created_at), "MMM dd, yyyy")}
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">-</span>
        )}
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/students/${student.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit Student
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSingleMailOpen(true)}>
              <Mail className="mr-2 h-4 w-4" />
              Send Message
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
    <Dialog open={singleMailOpen} onOpenChange={setSingleMailOpen}>
      <DialogContent className="mx-auto w-full max-w-lg wide-dialog border-2 border-blue-500 shadow-2xl bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-800">
        <div className="flex flex-col h-full w-full max-w-lg min-h-[400px] px-0 mx-auto">
          <div className="flex items-center justify-between px-4 py-3 border-b border-blue-400 bg-gradient-to-r from-blue-100 via-white to-emerald-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-800 rounded-t-2xl">
            <div>
              <DialogTitle className="text-xl font-bold flex items-center gap-4 text-blue-700 dark:text-blue-300">
                <Mail className="h-6 w-6 text-blue-600" />
                Send Mail to {displayName}
              </DialogTitle>
              <DialogDescription className="mt-2 text-base text-muted-foreground">
                Compose your message below.
              </DialogDescription>
            </div>
            <DialogClose asChild>
              <button className="text-2xl text-muted-foreground hover:text-blue-600 transition-colors" aria-label="Close">×</button>
            </DialogClose>
          </div>
          <form className="px-6 py-6 bg-background flex flex-col gap-6">
            <div>
              <label className="block text-base font-semibold mb-2 text-blue-700 dark:text-blue-300" htmlFor="mail-subject">Subject</label>
              <Input
                id="mail-subject"
                placeholder="Subject"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="border-blue-400 focus:border-blue-600 focus:ring-blue-200 text-base"
              />
            </div>
            <div>
              <label className="block text-base font-semibold mb-2 text-blue-700 dark:text-blue-300" htmlFor="mail-body">Message</label>
              <textarea
                id="mail-body"
                className="w-full min-h-[120px] border border-blue-400 rounded-xl p-4 bg-white dark:bg-input/40 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-base resize-vertical shadow-sm"
                placeholder={`Write your message to ${displayName}...`}
                value={body}
                onChange={e => setBody(e.target.value)}
                style={{ fontSize: '1.1rem', lineHeight: '1.7' }}
              />
            </div>
          </form>
          <div className="border-t border-blue-400 px-4 py-3 bg-gradient-to-r from-blue-100/60 via-white/60 to-emerald-100/60 dark:from-gray-900/40 dark:to-gray-800/40 rounded-b-2xl flex items-center gap-4">
            <Button
              className="w-full text-base font-semibold py-3 bg-gradient-to-r from-blue-500 via-emerald-400 to-blue-600 text-white shadow-md hover:from-blue-600 hover:to-emerald-500 transition-colors"
              disabled={!subject || !body}
              onClick={() => {
                sendMail({
                  student_email: [student.email],
                  subject,
                  message: body,
                  teacher_name: '', // Optionally fill from context
                  teacher_email: '', // Optionally fill from context
                }, {
                  onSuccess: () => {
                    setSingleMailOpen(false);
                    setSubject("");
                    setBody("");
                  },
                  onError: () => {
                    alert("Failed to send mail. Please try again.");
                  },
                });
              }}
            >
              Send Mail
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
