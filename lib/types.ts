export interface User {
  id?: string;
  username?: string;
  user_id: string;
  first_name: string;
  last_name: string;
  role?: "TEACHER" | "ADMIN";
  bio?: string;
  email?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
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

// Course Types
export interface Course {
  id: string;
  title: string;
  description: string;
  code: string;
  credits: number;
  facilitatorId: string;
  students: Student[];
  assignments: Assignment[];
  schedule: CourseSchedule[];
  status: "active" | "inactive" | "completed";
  createdAt: string;
  updatedAt: string;
}

export interface CourseSchedule {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  location: string;
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

// Assignment Types
export interface Assignment {
  id: string;
  title: string;
  description: string;
  courseId: string;
  dueDate: string;
  maxPoints: number;
  type: "quiz" | "project" | "exam" | "homework";
  status: "draft" | "published" | "closed";
  submissions: AssignmentSubmission[];
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  content: string;
  attachments: string[];
  grade?: number;
  feedback?: string;
  submittedAt: string;
  gradedAt?: string;
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
  totalCourses: number;
  totalStudents: number;
  pendingAssignments: number;
  unreadMessages: number;
  upcomingClasses: number;
}
