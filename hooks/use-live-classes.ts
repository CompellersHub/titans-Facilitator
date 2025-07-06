/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { LiveClass, CreateLiveClassData } from "@/lib/types";

const LIVE_CLASS_KEYS = {
  all: ["live-classes"] as const,
  lists: () => [...LIVE_CLASS_KEYS.all, "list"] as const,
  list: (filters: Record<string, any>) =>
    [...LIVE_CLASS_KEYS.lists(), { filters }] as const,
  details: () => [...LIVE_CLASS_KEYS.all, "detail"] as const,
  detail: (id: string) => [...LIVE_CLASS_KEYS.details(), id] as const,
};

export function useLiveClasses(filters?: Record<string, any>) {
  return useQuery({
    queryKey: LIVE_CLASS_KEYS.list(filters || {}),
    queryFn: () => apiClient.get<LiveClass[]>("/courses/CreateLiveClass/"),
  });
}

export function useLiveClass(classId: string) {
  return useQuery({
    queryKey: LIVE_CLASS_KEYS.detail(classId),
    queryFn: () =>
      apiClient.get<LiveClass>(`/courses/live-classes/${classId}/`),
    enabled: !!classId,
  });
}

export function useCreateLiveClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (classData: CreateLiveClassData) => {
      const formData = new FormData();
      formData.append("course_id", classData.course_id);
      formData.append("teacher_id", classData.teacher_id);
      formData.append("start_time", classData.start_time);
      formData.append("end_time", classData.end_time);
      formData.append("link", classData.link);

      const response = await fetch(
        `${apiClient["baseUrl"]}/courses/CreateLiveClass/`,
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
        throw new Error(errorData.message || "Failed to create live class");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LIVE_CLASS_KEYS.lists() });
    },
  });
}

export function useUpdateLiveClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      classId,
      data,
    }: {
      classId: string;
      data: Partial<CreateLiveClassData>;
    }) => {
      const formData = new FormData();
      if (data.course_id) formData.append("course_id", data.course_id);
      if (data.teacher_id) formData.append("teacher_id", data.teacher_id);
      if (data.start_time) formData.append("start_time", data.start_time);
      if (data.end_time) formData.append("end_time", data.end_time);
      if (data.link) formData.append("link", data.link);

      const response = await fetch(
        `${apiClient["baseUrl"]}/courses/CreateLiveClass/${classId}/`,
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
        throw new Error(errorData.message || "Failed to update live class");
      }

      return response.json();
    },
    onSuccess: (_, { classId }) => {
      queryClient.invalidateQueries({
        queryKey: LIVE_CLASS_KEYS.detail(classId),
      });
      queryClient.invalidateQueries({ queryKey: LIVE_CLASS_KEYS.lists() });
    },
  });
}

export function useDeleteLiveClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (classId: string) =>
      apiClient.delete(`/courses/CreateLiveClass/${classId}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LIVE_CLASS_KEYS.lists() });
    },
  });
}
