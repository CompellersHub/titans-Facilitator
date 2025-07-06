/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type {
  Course,
  CourseCategory,
  CourseModule,
  CreateCourseData,
} from "@/lib/types";

const COURSE_KEYS = {
  all: ["courses"] as const,
  lists: () => [...COURSE_KEYS.all, "list"] as const,
  list: (filters: Record<string, any>) =>
    [...COURSE_KEYS.lists(), { filters }] as const,
  details: () => [...COURSE_KEYS.all, "detail"] as const,
  detail: (id: string) => [...COURSE_KEYS.details(), id] as const,
  categories: ["course-categories"] as const,
  modules: ["course-modules"] as const,
};

export function useCourses(filters?: Record<string, any>) {
  return useQuery({
    queryKey: COURSE_KEYS.list(filters || {}),
    queryFn: () => apiClient.get<Course[]>("/courses/courses/"),
  });
}

export function useCourse(courseId: string) {
  return useQuery({
    queryKey: COURSE_KEYS.detail(courseId),
    queryFn: () => apiClient.get<Course>(`/courses/courses/${courseId}/`),
    enabled: !!courseId,
  });
}

export function useCourseCategories() {
  return useQuery({
    queryKey: COURSE_KEYS.categories,
    queryFn: () => apiClient.get<CourseCategory[]>("/courses/categories/"),
  });
}

export function useCourseModules() {
  return useQuery({
    queryKey: COURSE_KEYS.modules,
    queryFn: () => apiClient.get<CourseModule[]>("/courses/modules/"),
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseData: CreateCourseData) => {
      const formData = new FormData();

      // Basic course information
      formData.append("name", courseData.name);
      formData.append("preview_description", courseData.preview_description);
      formData.append("description", courseData.description);
      formData.append("price", courseData.price.toString());
      formData.append("estimated_time", courseData.estimated_time);
      formData.append("level", courseData.level);

      // Handle file uploads
      if (courseData.course_image instanceof File) {
        formData.append("course_image", courseData.course_image);
      }
      if (courseData.preview_id instanceof File) {
        formData.append("preview_id", courseData.preview_id);
      }

      // Category
      formData.append("category", JSON.stringify(courseData.category.name));

      // Complex nested data
      formData.append("curriculum", JSON.stringify(courseData.curriculum));
      formData.append(
        "target_audience",
        JSON.stringify(courseData.target_audience)
      );
      formData.append(
        "learning_outcomes",
        JSON.stringify(courseData.learning_outcomes)
      );
      formData.append(
        "required_materials",
        JSON.stringify(courseData.required_materials)
      );
      formData.append("instructor", JSON.stringify(courseData.instructor));

      const response = await fetch(`${apiClient["baseUrl"]}/courses/courses/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiClient.getAccessToken()}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create course");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COURSE_KEYS.lists() });
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryData: { name: string }) =>
      apiClient.post<CourseCategory>("/courses/categories/", categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COURSE_KEYS.categories });
    },
  });
}

export function useCreateModule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (moduleData: { title: string; order: number }) =>
      apiClient.post<CourseModule>("/courses/modules/", moduleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COURSE_KEYS.modules });
    },
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      data,
    }: {
      courseId: string;
      data: Partial<CreateCourseData>;
    }) => apiClient.put<Course>(`/courses/courses/${courseId}/`, data),
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: COURSE_KEYS.detail(courseId) });
      queryClient.invalidateQueries({ queryKey: COURSE_KEYS.lists() });
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) =>
      apiClient.delete(`/courses/courses/${courseId}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COURSE_KEYS.lists() });
    },
  });
}
