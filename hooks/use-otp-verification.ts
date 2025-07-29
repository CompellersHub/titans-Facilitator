"use client";

import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { VerifyOTPData } from "@/lib/types";

export function useOTPVerification() {
  // Verify OTP mutation
  const verifyMutation = useMutation({
    mutationFn: (data: VerifyOTPData) => apiClient.verifyOTP(data),
    onError: (error) => {
      console.error("OTP verification failed:", error);
    },
  });

  // Resend OTP mutation
  const resendMutation = useMutation({
    mutationFn: (data: { teacher_id: string; email: string }) =>
      apiClient.resendOTP(data),
    onError: (error) => {
      console.error("Resend OTP failed:", error);
    },
  });

  return {
    verifyOTP: verifyMutation.mutate,
    resendOTP: resendMutation.mutate,
    isVerifying: verifyMutation.isPending,
    isResending: resendMutation.isPending,
    verifyError: verifyMutation.error,
    resendError: resendMutation.error,
    verifyData: verifyMutation.data,
    resendData: resendMutation.data,
  };
}
