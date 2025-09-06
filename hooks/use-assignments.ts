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
    queryFn: async () => {
      try {
        return await apiClient.get<Assignment[]>("/courses/assignments/");
      } catch (error) {
        console.error("Failed to fetch assignments:", error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: 1000,
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
      try {
        const formData = new FormData();
        formData.append("course", assignmentData.course);
        formData.append("title", assignmentData.title);
        formData.append("description", assignmentData.description);
        formData.append("due_date", assignmentData.due_date);
        if (assignmentData.total_marks !== undefined) formData.append("total_marks", assignmentData.total_marks.toString());
        if (assignmentData.file) formData.append("file", assignmentData.file);

        const response = await fetch(`https://api.titanscareers.com/courses/assignments/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiClient.getAccessToken()}`,
          },
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("Create assignment error:", errorData);
          throw new Error(errorData.message || errorData.detail || "Failed to create assignment");
        }

        return response.json();
      } catch (error) {
        console.error("Failed to create assignment:", error);
        throw error;
      }
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
      try {
        // Send JSON payload with S3 URL
        const response = await fetch(`https://api.titanscareers.com/courses/assignments/${assignmentId}/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiClient.getAccessToken()}`,
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("Update assignment error:", errorData);
          throw new Error(errorData.message || errorData.detail || "Failed to update assignment");
        }

        return response.json();
      } catch (error) {
        console.error("Failed to update assignment:", error);
        throw error;
      }
    },
    onSuccess: (_, { assignmentId }) => {
      queryClient.invalidateQueries({ queryKey: ASSIGNMENT_KEYS.detail(assignmentId) });
      queryClient.invalidateQueries({ queryKey: ASSIGNMENT_KEYS.lists() });
    },
  });
}

export function useDeleteAssignment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (assignmentId: string) => {
      try {
        const response = await fetch(`https://api.titanscareers.com/courses/assignments/${assignmentId}/`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${apiClient.getAccessToken()}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("Delete assignment error:", errorData);
          throw new Error(errorData.message || errorData.detail || "Failed to delete assignment");
        }

        // Return success even if response is empty (204 No Content)
        return { success: true };
      } catch (error) {
        console.error("Failed to delete assignment:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSIGNMENT_KEYS.lists() })
    },
  })
}

export function useAssignmentsByCourse(courseId: string) {
  return useQuery({
    queryKey: [...ASSIGNMENT_KEYS.all, "by-course", courseId],
    queryFn: async () => {
      try {
        return await apiClient.get<Assignment[]>(`/courses/assignments/by_course/${courseId}/`);
      } catch (error) {
        console.error("Failed to fetch assignments by course:", error);
        throw error;
      }
    },
    enabled: !!courseId,
    retry: 3,
    retryDelay: 1000,
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
