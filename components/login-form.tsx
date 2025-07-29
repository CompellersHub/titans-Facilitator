"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";

import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
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
import { useAuth } from "@/hooks/use-auth";
import { ModeToggle } from "@/components/mode-toggle";
import Image from "next/image";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login, isLoginLoading, loginError, user } = useAuth();

  // Get success message from URL params
  const successMessage = searchParams.get("message");

  //   useEffect(() => {
  //     initializeAuth();
  //     console.log(isAuthenticated);
  //     if (isAuthenticated) {
  //       router.push("/");
  //     }
  //   }, [initializeAuth, isAuthenticated, router]);
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  const isFormValid = email.trim() !== "" && password.trim() !== "";

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>

      <div className="text-center space-y-2">
        <div className="flex justify-center">
          {/* <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <GraduationCap className="h-7 w-7 text-primary-foreground" />
          </div> */}
          <Image
            src={"https://titanscareers.com/assets/logo-DMzVeG9H.png"}
            // layout="responsive"
            alt="Titans Career"
            width={100}
            height={100}
          />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground">
          Sign in to your facilitator account
        </p>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-xl">Sign in</CardTitle>
          <CardDescription>
            Enter your credentials to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {successMessage && (
              <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
                <AlertDescription className="text-green-800 dark:text-green-200">
                  {successMessage}
                </AlertDescription>
              </Alert>
            )}

            {loginError && (
              <Alert variant="destructive">
                <AlertDescription>
                  {loginError.message ||
                    "Invalid email or password. Please try again."}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoginLoading}
                className=""
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoginLoading}
                  className=" pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoginLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="remember" className="text-sm font-normal">
                  Remember me
                </Label>
              </div>
              <Button variant="link" className="px-0 text-sm">
                Forgot password?
              </Button>
            </div>

            <Button
              type="submit"
              className="w-full "
              disabled={!isFormValid || isLoginLoading}
            >
              {isLoginLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          Don&apos;t have an account?{" "}
          <Button variant="link" className="px-0 text-sm">
            Contact your administrator
          </Button>
        </p>
      </div>
    </div>
  );
}
