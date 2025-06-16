import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { Student } from "@/lib/types"

const STUDENT_KEYS = {
  all: ["students"] as const,
  lists: () => [...STUDENT_KEYS.all, "list"] as const,
  list: (filters: Record<string, any>) => [...STUDENT_KEYS.lists(), { filters }] as const,
  details: () => [...STUDENT_KEYS.all, "detail"] as const,
  detail: (id: string) => [...STUDENT_KEYS.details(), id] as const,
}

export function useStudents(filters?: Record<string, any>) {
  return useQuery({
    queryKey: STUDENT_KEYS.list(filters || {}),
    queryFn: () => apiClient.get<{ students: Student[] }>("/students").then((res) => res.students),
  })
}

export function useStudent(studentId: string) {
  return useQuery({
    queryKey: STUDENT_KEYS.detail(studentId),
    queryFn: () => apiClient.get<{ student: Student }>(`/students/${studentId}`).then((res) => res.student),
    enabled: !!studentId,
  })
}

export function useCourseStudents(courseId: string) {
  return useQuery({
    queryKey: [...STUDENT_KEYS.lists(), "course", courseId],
    queryFn: () => apiClient.get<{ students: Student[] }>(`/courses/${courseId}/students`).then((res) => res.students),
    enabled: !!courseId,
  })
}
