import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type {
  Student,
  UpdateStudentData,
  StudentsByCourseResponse,
  StudentProgress,
} from "@/lib/types";

const STUDENT_KEYS = {
  all: ["students"] as const,
  lists: () => [...STUDENT_KEYS.all, "list"] as const,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  list: (filters: Record<string, any>) =>
    [...STUDENT_KEYS.lists(), { filters }] as const,
  details: () => [...STUDENT_KEYS.all, "detail"] as const,
  detail: (id: string) => [...STUDENT_KEYS.details(), id] as const,
  byCourse: (courseId: string) =>
    [...STUDENT_KEYS.all, "course", courseId] as const,
  progress: (userId: string, courseId: string) =>
    [...STUDENT_KEYS.all, "progress", userId, courseId] as const,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useStudents(filters?: Record<string, any>) {
  return useQuery({
    queryKey: STUDENT_KEYS.list(filters || {}),
    queryFn: () => apiClient.get<Student[]>("/customuser/student/"),
  });
}

export function useStudent(studentId: string) {
  return useQuery({
    queryKey: STUDENT_KEYS.detail(studentId),
    queryFn: () => apiClient.get<Student>(`/customuser/student/${studentId}/`),
    enabled: !!studentId,
  });
}

export function useStudentsByCourse(courseId: string) {
  return useQuery({
    queryKey: STUDENT_KEYS.byCourse(courseId),
    queryFn: () =>
      apiClient.get<StudentsByCourseResponse>(
        `/customuser/students/filter/${courseId}`
      ),
    enabled: !!courseId,
  });
}

export function useStudentProgress(userId: string, courseId: string) {
  return useQuery({
    queryKey: STUDENT_KEYS.progress(userId, courseId),
    queryFn: () =>
      apiClient.get<StudentProgress>(
        `/customuser/user-course-progress/${userId}/${courseId}/`
      ),
    enabled: !!userId && !!courseId,
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      studentId,
      data,
    }: {
      studentId: string;
      data: UpdateStudentData;
    }) => {
      return apiClient.put<Student>(`/customuser/student/${studentId}/`, data);
    },
    onSuccess: (_, { studentId }) => {
      queryClient.invalidateQueries({
        queryKey: STUDENT_KEYS.detail(studentId),
      });
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.lists() });
    },
  });
}

// Legacy hooks for backward compatibility
export function useCourseStudents(courseId: string) {
  return useStudentsByCourse(courseId);
}
