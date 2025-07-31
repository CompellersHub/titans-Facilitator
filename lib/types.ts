export interface User {
  pk: string;
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  role: "TEACHER" | "ADMIN";
  bio?: string;
  email?: string;
  avatar?: string;
  profile_picture?: string;
  phone_number?: string;
  past_experience?: string;
  course_taken?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user_info: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpResponse {
  message: string;
  teacher_id: string;
  email: string;
  next_step: "verify_otp";
}

export interface VerifyOTPData {
  teacher_id: string;
  email: string;
  otp: string;
}

export interface VerifyOTPResponse {
  message: string;
  access?: string;
  refresh?: string;
  user_info?: User;
}

// Course Types
export interface Course {
  id: string;
  name: string;
  course_image: string;
  preview_id: string;
  preview_description: string;
  description: string;
  curriculum: CourseCurriculum[];
  category: CourseCategory;
  price: number;
  target_audience: Record<string, string>;
  learning_outcomes: Record<string, string>;
  required_materials: Record<string, string>;
  estimated_time: string;
  level: "beginner" | "intermediate" | "advanced";
  instructor: User;
}

export interface CourseCurriculum {
  id?: string;
  title: string;
  order: number;
  video: CourseVideo[];
  course_note: CourseNote | null;
  created_at?: string;
  updated_at?: string;
}

export interface CourseVideo {
  id?: string;
  title: string;
  duration: string | null;
  description: string;
  video_file: string | null;
}

export interface CourseNote {
  id?: string;
  title: string;
  description: string | null;
  note_file: string | null;
}

export interface CourseCategory {
  id: string;
  name: string;
}

export interface CourseModule {
  id: string;
  title: string;
  order: number;
  video: CourseVideo[];
  course_note: CourseNote | null;
  created_at: string;
  updated_at: string;
}

export interface CreateCourseData {
  name: string;
  course_image: File | string;
  preview_id: File | string;
  preview_description: string;
  description: string;
  curriculum: CourseCurriculum[];
  category: CourseCategory;
  price: number;
  original_price: number;
  target_audience: Record<string, string>;
  learning_outcomes: Record<string, string>;
  required_materials: Record<string, string>;
  estimated_time: string;
  level: "beginner" | "intermediate" | "advanced";
  instructor: { user_id: string };
}
export interface CourseLibrary {
  id: string;
  title: string;
  file: string;
  url: string;
  created_at: string;
  course_id: string;
}

export interface CreateCourseLibraryData {
  title: string;
  file?: File | null;
  url?: string;
  course: string;
}

export interface UpdateCourseLibraryData {
  title?: string;
  file?: File | null;
  url?: string;
}

export interface Student {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: "STUDENT";
  phone_number: string | null;
  course: StudentCourse[];
  created_at?: string;
}

export interface StudentCourse {
  id: string;
  name: string;
  course_image: string | null;
  preview_id: string | null;
  preview_description: string | null;
  description: string | null;
  category: CourseCategory | null;
  price: number;
  target_audience: Record<string, string> | null;
  learning_outcomes: Record<string, string> | null;
  instructor: User | null;
  required_materials: Record<string, string> | null;
  estimated_time: string | null;
  level: string | null;
}

export interface UpdateStudentData {
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
}

export interface StudentsByCourseResponse {
  students: Student[];
  total_students: number;
}

// Student Progress Types
export interface StudentProgress {
  user_id: string;
  course_id: string;
  course_name: string;
  progress_percentage: number;
  details: ProgressDetail[];
}

export interface ProgressDetail {
  type: "videos" | "course_notes" | "assignments" | "blog_pdfs";
  completed: number;
  opened: number;
  submitted: number;
  viewed: number;
  total: number;
}
export interface Assignment {
  id: string;
  title: string;
  description: string;
  due_date: string;
  file: string | null;
  total_marks: number;
  teacher: User;
  course_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateAssignmentData {
  course: string;
  title: string;
  description: string;
  due_date: string;
  total_marks?: number;
  file?: File | null;
}

export interface UpdateAssignmentData {
  title?: string;
  description?: string;
  due_date?: string;
  total_marks?: number;
  file?: File | null;
}

export interface AssignmentSubmission {
  id: string;
  assignment_id: string;
  student_id: string;
  student: User;
  content: string;
  attachments: string[];
  grade?: number;
  feedback?: string;
  submitted_at: string;
  graded_at?: string;
  status: "submitted" | "graded" | "pending";
}

// Student Types
export interface Student {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  studentId: string;
  avatar?: string;
  enrolledCourses: string[];
  createdAt: string;
  updatedAt: string;
}

// Message Types
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  subject: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

// Dashboard Types
export interface DashboardStats {
  total_courses: number;
  total_students: number;
  pending_assignments: number;
  unread_messages?: number;
  upcoming_classes: LiveClass[];
  upcoming_classes_count: number;
}

// Live Classes Types
export interface LiveClass {
  id?: string;
  course: {
    id: string;
    name: string;
  };
  teacher: {
    id: string;
    first_name: string;
    last_name: string;
  } | null;
  start_time: string;
  end_time: string;
  link: string;
  created_at?: string;
  provider?: "google" | "zoom" | "jitsi" | "aws" | "stream";
}

export interface CreateLiveClassData {
  course_id: string;
  teacher_id: string;
  start_time: string;
  end_time: string;
  link: string;
  provider?: "google" | "zoom" | "jitsi" | "aws" | "stream";
}

export interface LiveClassProvider {
  id: "google" | "zoom" | "jitsi" | "aws" | "stream";
  name: string;
  icon: string;
  color: string;
}
