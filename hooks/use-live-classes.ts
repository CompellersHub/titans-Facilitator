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
      // Send JSON payload instead of FormData
      const response = await fetch(
        `${apiClient["baseUrl"]}/courses/CreateLiveClass/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiClient.getAccessToken()}`,
          },
          body: JSON.stringify(classData),
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
      // Send JSON payload instead of FormData
      const response = await fetch(
        `${apiClient["baseUrl"]}/courses/CreateLiveClass/${classId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiClient.getAccessToken()}`,
          },
          body: JSON.stringify(data),
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
