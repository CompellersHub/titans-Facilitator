"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Shield,
  Loader2,
  CheckCircle,
  RefreshCw,
  Mail,
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { apiClient } from "@/lib/api-client";
import { useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";

export function VerifyOTPForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  // Get params from URL
  const teacherId = searchParams?.get("teacher_id") ?? "";
  const email = searchParams?.get("email") ?? "";
  const message = searchParams?.get("message") ?? "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect if missing required params
  useEffect(() => {
    if (!teacherId || !email) {
      router.push("/sign-up");
    }
  }, [teacherId, email, router]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple characters

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Handle paste
    if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then((clipText) => {
        const pastedOtp = clipText.replace(/\D/g, "").slice(0, 6).split("");
        const newOtp = [...otp];
        pastedOtp.forEach((digit, i) => {
          if (i < 6) newOtp[i] = digit;
        });
        setOtp(newOtp);
        // Focus the next empty input or the last one
        const nextEmptyIndex = newOtp.findIndex((digit) => !digit);
        const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
        inputRefs.current[focusIndex]?.focus();
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!teacherId || !email) {
      setError("Missing verification details. Please try signing up again.");
      return;
    }

    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await apiClient.verifyOTP({
        teacher_id: teacherId,
        email: email,
        otp: otpString,
      });

      setSuccess("Email verified successfully! Redirecting to login...");

      // If the response includes auth tokens, log the user in automatically
      if (response.access && response.refresh) {
        apiClient.setTokens(response.access, response.refresh);
        Cookies.set("titans_access_token", response.access, {
          path: "/",
          sameSite: "Lax",
          secure: process.env.NODE_ENV === "production",
          expires: 7,
        });
        Cookies.set("titans_refresh_token", response.refresh, {
          path: "/",
          sameSite: "Lax",
          secure: process.env.NODE_ENV === "production",
          expires: 7,
        });

        // Invalidate auth queries to refresh user data
        queryClient.invalidateQueries({ queryKey: ["auth", "user"] });

        setTimeout(() => router.push("/"), 2000);
      } else {
        // Otherwise redirect to login
        setTimeout(
          () => router.push("/login?message=Email verified! Please log in."),
          2000
        );
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Verification failed. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!teacherId || !email || !canResend) return;

    setIsResending(true);
    setError("");

    try {
      await apiClient.resendOTP({
        teacher_id: teacherId,
        email: email,
      });

      setSuccess("New verification code sent to your email!");
      setCanResend(false);
      setCountdown(60);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();

      // Clear success message after a few seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to resend code. Please try again.";
      setError(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  const isFormValid = otp.every((digit) => digit !== "");

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Mode Toggle */}
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>

      {/* Header */}
      <div className="text-center space-y-4">
        <Link
          href="/sign-up"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          Back to Sign Up
        </Link>

        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="relative">
            <Image
              src="https://titanscareers.com/assets/logo-DMzVeG9H.png"
              alt="Titans Career"
              width={64}
              height={64}
              className="rounded-xl"
            />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-background">
              <Shield className="w-3 h-3 text-white ml-0.5 mt-0.5" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Verify Your Email</h1>
            <p className="text-muted-foreground text-sm">
              Almost there! Check your inbox ✉️
            </p>
          </div>
        </div>

        {/* Message from signup */}
        {message && (
          <div className="mb-6">
            <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
              <Mail className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                {message}
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>

      {/* Form Card */}
      <Card className="border-0 shadow-md">
        <CardHeader className="text-center space-y-1 pb-4">
          <CardTitle className="text-xl">Enter Verification Code</CardTitle>
          <CardDescription>
            We sent a 6-digit code to{" "}
            <span className="font-medium text-foreground">{email}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                {success}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input */}
            <div className="space-y-2">
              <Label className="text-center block">Verification Code</Label>
              <div className="flex gap-2 justify-center">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg font-semibold"
                    disabled={isLoading}
                  />
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Verify Email
                </>
              )}
            </Button>

            {/* Resend Code */}
            <div className="text-center pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-2">
                Didn&apos;t receive the code?
              </p>
              <Button
                type="button"
                variant="ghost"
                onClick={handleResendOTP}
                disabled={!canResend || isResending}
                className="text-sm"
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : canResend ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Resend Code
                  </>
                ) : (
                  `Resend in ${countdown}s`
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Help Text */}
      <div className="text-center text-xs text-muted-foreground space-y-1">
        <p>Check your spam folder if you don&apos;t see the email.</p>
        <p>The code expires in 10 minutes.</p>
      </div>
    </div>
  );
}
