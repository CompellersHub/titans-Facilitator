import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { DashboardStats } from "@/lib/types";

const DASHBOARD_KEYS = {
  stats: ["dashboard", "stats"] as const,
  recentActivity: ["dashboard", "activity"] as const,
};

export function useDashboardStats() {
  return useQuery({
    queryKey: DASHBOARD_KEYS.stats,
    queryFn: () =>
      apiClient
        .get<{ stats: DashboardStats }>(`/customuser/teacher/dashboard`)
        .then((res) => res as unknown as DashboardStats),
    refetchInterval: 5 * 60 * 1000,
  });
}

// export function useRecentActivity() {
//   return useQuery({
//     queryKey: DASHBOARD_KEYS.recentActivity,
//     queryFn: () =>
//       apiClient
//         .get<{ activities: any[] }>(
//           `/customuser/teacher/course-progress/${"6828477f04ee1e945fa33bef"}`
//         )
//         .then((res) => res.activities),
//     refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
//   });
// }
