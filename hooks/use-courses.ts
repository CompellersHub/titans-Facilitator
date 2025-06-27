import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { Course } from "@/lib/types"

const COURSE_KEYS = {
  all: ["courses"] as const,
  lists: () => [...COURSE_KEYS.all, "list"] as const,
  list: (filters: Record<string, any>) => [...COURSE_KEYS.lists(), { filters }] as const,
  details: () => [...COURSE_KEYS.all, "detail"] as const,
  detail: (id: string) => [...COURSE_KEYS.details(), id] as const,
}

export function useCourses(filters?: Record<string, any>) {
  return useQuery({
    queryKey: COURSE_KEYS.list(filters || {}),
    queryFn: () => apiClient.get<Course[]>("/courses/courses/"),
  })
}

export function useCourse(courseId: string) {
  return useQuery({
    queryKey: COURSE_KEYS.detail(courseId),
    queryFn: () => apiClient.get<Course>(`/courses/courses/${courseId}/`),
    enabled: !!courseId,
  })
}

export function useCreateCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (courseData: Partial<Course>) => apiClient.post<{ course: Course }>("/courses/courses/", courseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COURSE_KEYS.lists() })
    },
  })
}

export function useUpdateCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ courseId, data }: { courseId: string; data: Partial<Course> }) =>
      apiClient.put<{ course: Course }>(`/courses/courses/${courseId}/`, data),
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: COURSE_KEYS.detail(courseId) })
      queryClient.invalidateQueries({ queryKey: COURSE_KEYS.lists() })
    },
  })
}

export function useDeleteCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (courseId: string) => apiClient.delete(`/courses/courses/${courseId}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COURSE_KEYS.lists() })
    },
  })
}
