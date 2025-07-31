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
      // Since we're now using S3 URLs, we send JSON data instead of FormData
      const payload = {
        name: courseData.name,
        preview_description: courseData.preview_description,
        description: courseData.description,
        price: courseData.price,
        original_price: courseData.original_price || courseData.price, // Add original_price
        estimated_time: courseData.estimated_time,
        level: courseData.level,
        course_image: courseData.course_image, // Now expects URL string
        preview_id: courseData.preview_id, // Now expects URL string
        category: courseData.category,
        curriculum: courseData.curriculum,
        target_audience: courseData.target_audience,
        learning_outcomes: courseData.learning_outcomes,
        required_materials: courseData.required_materials,
        instructor: courseData.instructor,
      };

      return apiClient.post<Course>("/courses/courses/", payload);
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
