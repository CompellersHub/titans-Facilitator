import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { Assignment, AssignmentSubmission } from "@/lib/types"

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
    queryFn: () => apiClient.get<{ assignments: Assignment[] }>("/assignments").then((res) => res.assignments),
  })
}

export function useAssignment(assignmentId: string) {
  return useQuery({
    queryKey: ASSIGNMENT_KEYS.detail(assignmentId),
    queryFn: () =>
      apiClient.get<{ assignment: Assignment }>(`/assignments/${assignmentId}`).then((res) => res.assignment),
    enabled: !!assignmentId,
  })
}

export function useCreateAssignment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (assignmentData: Partial<Assignment>) =>
      apiClient.post<{ assignment: Assignment }>("/assignments", assignmentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSIGNMENT_KEYS.lists() })
    },
  })
}

export function useAssignmentSubmissions(assignmentId: string) {
  return useQuery({
    queryKey: ASSIGNMENT_KEYS.submissions(assignmentId),
    queryFn: () =>
      apiClient
        .get<{ submissions: AssignmentSubmission[] }>(`/assignments/${assignmentId}/submissions`)
        .then((res) => res.submissions),
    enabled: !!assignmentId,
  })
}

export function useGradeSubmission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ submissionId, grade, feedback }: { submissionId: string; grade: number; feedback?: string }) =>
      apiClient.patch(`/submissions/${submissionId}/grade`, { grade, feedback }),
    onSuccess: (_, { submissionId }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ASSIGNMENT_KEYS.all })
    },
  })
}
