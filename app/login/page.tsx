import { Suspense } from 'react';
import { LoginForm } from '@/components/login-form';

function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-4 border-slate-300 border-t-slate-500 dark:border-slate-700 dark:border-t-white rounded-full animate-spin" />
      <p className="text-sm text-slate-600 dark:text-slate-300 animate-pulse">
        Preparing login...
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Suspense fallback={<LoadingFallback />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
