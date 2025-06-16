"use client";

// import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { LoginCredentials, User } from "@/lib/types";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";
// const router = useRouter();

const AUTH_KEYS = {
  user: ["auth", "user"] as const,
  token: ["auth", "token"] as const,
};

// Update the auth hook to handle both tokens
export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  // Get current user
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: AUTH_KEYS.user,
    queryFn: () =>
      // console.log("")
      apiClient.get<{ user: User }>("/api/auth/user").then((res) => {
        // console.log(res);
        return res;
      }),
    enabled: !!apiClient.getAccessToken(),
    retry: false,
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => apiClient.login(credentials),
    onSuccess: (data) => {
      console.log(data);
      apiClient.setTokens(data.access, data.refresh);
      // localStorage.setItem("titans_access_token", data.access);
      // localStorage.setItem("titans_refresh_token", data.refresh);
      Cookies.set("titans_access_token", data.access, {
        path: "/",
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production",
        expires: 7, // 7 days
      });

      // Optionally store refresh token too
      Cookies.set("titans_refresh_token", data.refresh, {
        path: "/",
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production",
        expires: 7,
      });
      queryClient.setQueryData(AUTH_KEYS.user, data.user_info);
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.user });
      router.push("/");
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => apiClient.post("/auth/logout/"),
    onSuccess: () => {
      apiClient.setTokens(null, null);
      localStorage.removeItem("titans_access_token");
      localStorage.removeItem("titans_refresh_token");
      Cookies.remove("titans_access_token");
      Cookies.remove("titans_refresh_token");
      queryClient.clear();
    },
  });

  // Initialize tokens from localStorage
  const initializeAuth = () => {
    // const accessToken = localStorage.getItem("titans_access_token");
    // const refreshToken = localStorage.getItem("titans_refresh_token");
    const accessToken = Cookies.get("titans_access_token");
    const refreshToken = Cookies.get("titans_refresh_token");
    if (accessToken && refreshToken) {
      apiClient.setTokens(accessToken, refreshToken);
    }
  };
  // ✅ Call on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  // ✅ Redirect if already logged in
  useEffect(() => {
    console.log(user);
    if (user && pathname === "/login") {
      router.push("/");
    }
  }, [user, router, pathname]);

  return {
    user,
    isLoading,
    error,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    loginError: loginMutation.error,
    initializeAuth,
    isAuthenticated: !!user,
  };
}
