/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type {
  CourseLibrary,
  CreateCourseLibraryData,
  UpdateCourseLibraryData,
} from "@/lib/types";

const COURSE_LIBRARY_KEYS = {
  all: ["course-library"] as const,
  lists: () => [...COURSE_LIBRARY_KEYS.all, "list"] as const,
  list: (filters: Record<string, any>) =>
    [...COURSE_LIBRARY_KEYS.lists(), { filters }] as const,
  details: () => [...COURSE_LIBRARY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...COURSE_LIBRARY_KEYS.details(), id] as const,
  byCourse: (courseId: string) =>
    [...COURSE_LIBRARY_KEYS.all, "course", courseId] as const,
};

export function useCourseLibrary(filters?: Record<string, any>) {
  return useQuery({
    queryKey: COURSE_LIBRARY_KEYS.list(filters || {}),
    queryFn: () => apiClient.get<CourseLibrary[]>("/courses/courselibrary/"),
  });
}

export function useCourseLibraryItem(libraryId: string) {
  return useQuery({
    queryKey: COURSE_LIBRARY_KEYS.detail(libraryId),
    queryFn: () =>
      apiClient.get<CourseLibrary>(`/courses/courselibrary/${libraryId}/`),
    enabled: !!libraryId,
  });
}

export function useCourseLibraryByCourse(courseId: string) {
  return useQuery({
    queryKey: COURSE_LIBRARY_KEYS.byCourse(courseId),
    queryFn: () =>
      apiClient.get<CourseLibrary[]>(
        `/courses/courselibrary/?course_id=${courseId}`
      ),
    enabled: !!courseId,
  });
}

export function useCreateCourseLibrary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (libraryData: CreateCourseLibraryData) => {
      const formData = new FormData();
      formData.append("title", libraryData.title);
      formData.append("course", libraryData.course);

      if (libraryData.file) {
        formData.append("file", libraryData.file);
      }
      if (libraryData.url) {
        formData.append("url", libraryData.url);
      }

      const response = await fetch(
        `${apiClient["baseUrl"]}/courses/courselibrary/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiClient.getAccessToken()}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create library item");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COURSE_LIBRARY_KEYS.lists() });
    },
  });
}

export function useUpdateCourseLibrary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      libraryId,
      data,
    }: {
      libraryId: string;
      data: UpdateCourseLibraryData;
    }) => {
      const formData = new FormData();

      if (data.title) formData.append("title", data.title);
      if (data.file) formData.append("file", data.file);
      if (data.url) formData.append("url", data.url);

      const response = await fetch(
        `${apiClient["baseUrl"]}/courses/courselibrary/${libraryId}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${apiClient.getAccessToken()}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update library item");
      }

      return response.json();
    },
    onSuccess: (_, { libraryId }) => {
      queryClient.invalidateQueries({
        queryKey: COURSE_LIBRARY_KEYS.detail(libraryId),
      });
      queryClient.invalidateQueries({ queryKey: COURSE_LIBRARY_KEYS.lists() });
    },
  });
}

export function useDeleteCourseLibrary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (libraryId: string) =>
      apiClient.delete(`/courses/courselibrary/${libraryId}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COURSE_LIBRARY_KEYS.lists() });
    },
  });
}
