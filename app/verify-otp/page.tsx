import { Suspense } from 'react';
import { VerifyOTPForm } from "../../components/verify-otp-form";

function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-4 border-slate-300 border-t-slate-500 dark:border-slate-700 dark:border-t-white rounded-full animate-spin" />
      <p className="text-sm text-slate-600 dark:text-slate-300 animate-pulse">
        Preparing otp...
      </p>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
       <Suspense fallback={<LoadingFallback />}>
      <VerifyOTPForm />
      </Suspense>
    </div>
  );
}
