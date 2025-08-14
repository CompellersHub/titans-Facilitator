"use client";

import React from "react";
import { CheckCircle, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const SignupSuccess = () => {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Account Created Successfully!
        </h1>

        {/* Main Message */}
        <div className="mb-6">
          <p className="text-gray-600 text-base leading-relaxed mb-4">
            Thank you for creating an account with us. Your information will be
            reviewed and a mail will be sent to you with clearance to login into
            your account.
          </p>
        </div>

        {/* Info Cards */}
        <div className="space-y-3 mb-8">
          <div className="flex items-center justify-center bg-blue-50 rounded-lg p-3">
            <Mail className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-sm text-blue-700">
              Check your email for updates
            </span>
          </div>

          <div className="flex items-center justify-center bg-amber-50 rounded-lg p-3">
            <Clock className="h-5 w-5 text-amber-600 mr-2" />
            <span className="text-sm text-amber-700">
              Review process may take 24-48 hours
            </span>
          </div>
        </div>

        {/* Action Button */}
        <Button onClick={() => (window.location.href = "/")} className="w-full">
          Back to Home
        </Button>

        {/* Footer Text */}
        <p className="text-xs text-gray-500 mt-6">
          Need help? Contact our support team for assistance.
        </p>
      </div>
    </div>
  );
};

export default SignupSuccess;
