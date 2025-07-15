/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { Assignment, CreateAssignmentData, UpdateAssignmentData, AssignmentSubmission } from "@/lib/types"

const ASSIGNMENT_KEYS = {
  all: ["assignments"] as const,
  lists: () => [...ASSIGNMENT_KEYS.all, "list"] as const,
  list: (filters: Record<string, any>) => [...ASSIGNMENT_KEYS.lists(), { filters }] as const,
  details: () => [...ASSIGNMENT_KEYS.all, "detail"] as const,
  detail: (id: string) => [...ASSIGNMENT_KEYS.details(), id] as const,
  submissions: (assignmentId: string) => [...ASSIGNMENT_KEYS.detail(assignmentId), "submissions"] as const,
}

export function useAssignments(filters?: Record<string, any>) {
  return useQuery({
    queryKey: ASSIGNMENT_KEYS.list(filters || {}),
    queryFn: () => apiClient.get<Assignment[]>("/courses/assignments/"),
  })
}

export function useAssignment(assignmentId: string) {
  return useQuery({
    queryKey: ASSIGNMENT_KEYS.detail(assignmentId),
    queryFn: () => apiClient.get<Assignment>(`/courses/assignments/${assignmentId}/`),
    enabled: !!assignmentId,
  })
}

export function useCreateAssignment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (assignmentData: CreateAssignmentData) => {
      const formData = new FormData()
      formData.append("course", assignmentData.course)
      formData.append("title", assignmentData.title)
      formData.append("description", assignmentData.description)
      formData.append("due_date", assignmentData.due_date)
      if (assignmentData.total_marks) {
        formData.append("total_marks", assignmentData.total_marks.toString())
      }
      if (assignmentData.file) {
        formData.append("file", assignmentData.file)
      }

      const response = await fetch(`${apiClient["baseUrl"]}/courses/assignments/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiClient.getAccessToken()}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to create assignment")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSIGNMENT_KEYS.lists() })
    },
  })
}

export function useUpdateAssignment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ assignmentId, data }: { assignmentId: string; data: UpdateAssignmentData }) => {
      const formData = new FormData()
      if (data.title) formData.append("title", data.title)
      if (data.description) formData.append("description", data.description)
      if (data.due_date) formData.append("due_date", data.due_date)
      if (data.total_marks) formData.append("total_marks", data.total_marks.toString())
      if (data.file) formData.append("file", data.file)

      const response = await fetch(`${apiClient["baseUrl"]}/courses/assignments/${assignmentId}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${apiClient.getAccessToken()}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to update assignment")
      }

      return response.json()
    },
    onSuccess: (_, { assignmentId }) => {
      queryClient.invalidateQueries({ queryKey: ASSIGNMENT_KEYS.detail(assignmentId) })
      queryClient.invalidateQueries({ queryKey: ASSIGNMENT_KEYS.lists() })
    },
  })
}

export function useDeleteAssignment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (assignmentId: string) => apiClient.delete(`/courses/assignments/${assignmentId}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSIGNMENT_KEYS.lists() })
    },
  })
}

export function useAssignmentSubmissions(assignmentId: string) {
  return useQuery({
    queryKey: ASSIGNMENT_KEYS.submissions(assignmentId),
    queryFn: () => apiClient.get<AssignmentSubmission[]>(`/courses/assignments/${assignmentId}/submissions/`),
    enabled: !!assignmentId,
  })
}

export function useGradeSubmission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ submissionId, grade, feedback }: { submissionId: string; grade: number; feedback?: string }) =>
      apiClient.patch(`/submissions/${submissionId}/grade/`, { grade, feedback }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSIGNMENT_KEYS.all })
    },
  })
}
