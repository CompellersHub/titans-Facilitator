// User and Authentication Types
export interface User {
  id: string
  user_id: string
  first_name: string
  last_name: string
  role: "TEACHER" | "ADMIN"
  bio?: string
  email?: string
  avatar?: string
  profile_picture?: string
  phone_number?: string
  past_experience?: string
  course_taken?: string
  created_at?: string
  updated_at?: string
}

export interface AuthResponse {
  access: string
  refresh: string
  user_info: User
}

export interface LoginCredentials {
  email: string
  password: string
}

// Course Types
export interface Course {
  id: string
  name: string
  course_image: string
  preview_id: string
  preview_description: string
  description: string
  curriculum: CourseCurriculum[]
  category: CourseCategory
  price: number
  target_audience: Record<string, string>
  learning_outcomes: Record<string, string>
  required_materials: Record<string, string>
  estimated_time: string
  level: "beginner" | "intermediate" | "advanced"
  instructor: User
}

export interface CourseCurriculum {
  id: string
  title: string
  order: number
  video: CourseVideo[]
  course_note: string | null
  created_at: string
  updated_at: string
}

export interface CourseVideo {
  id: string
  title: string
  duration: string | null
  description: string
  video_file: string | null
}

export interface CourseCategory {
  id: string
  name: string
}

export interface CourseSchedule {
  id: string
  dayOfWeek: number
  startTime: string
  endTime: string
  location: string
}

// Student Types
export interface Student {
  id: string
  email: string
  firstName: string
  lastName: string
  studentId: string
  avatar?: string
  enrolledCourses: string[]
  createdAt: string
  updatedAt: string
}

// Assignment Types
export interface Assignment {
  id: string
  title: string
  description: string
  due_date: string
  file: string | null
  total_marks: number
  teacher: User
  course_id: string
  created_at?: string
  updated_at?: string
}

export interface CreateAssignmentData {
  course: string
  title: string
  description: string
  due_date: string
  total_marks?: number
  file?: File | null
}

export interface UpdateAssignmentData {
  title?: string
  description?: string
  due_date?: string
  total_marks?: number
  file?: File | null
}

export interface AssignmentSubmission {
  id: string
  assignment_id: string
  student_id: string
  student: User
  content: string
  attachments: string[]
  grade?: number
  feedback?: string
  submitted_at: string
  graded_at?: string
  status: "submitted" | "graded" | "pending"
}

// Message Types
export interface Message {
  id: string
  senderId: string
  receiverId: string
  subject: string
  content: string
  isRead: boolean
  createdAt: string
}

// Dashboard Types
export interface DashboardStats {
  totalCourses: number
  totalStudents: number
  pendingAssignments: number
  unreadMessages: number
  upcomingClasses: number
}
