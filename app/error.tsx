'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center space-y-8 px-4">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 bg-red-200 dark:bg-red-900/20 blur-2xl rounded-full animate-pulse" />
        <div className="relative w-full h-full bg-white dark:bg-stone-800 rounded-[2rem] flex items-center justify-center border border-red-200 dark:border-stone-700 shadow-xl">
          <AlertTriangle className="w-10 h-10 text-red-400" />
        </div>
      </div>

      <div className="space-y-3 max-w-md">
        <h1 className="text-4xl font-black text-cheese-950 dark:text-cheese-50 tracking-tighter">
          出错了
        </h1>
        <p className="text-lg font-bold text-cheese-900/70 dark:text-cheese-200/70">
          页面发生了意外错误
        </p>
        {error.digest && (
          <p className="text-xs text-cheese-900/40 dark:text-cheese-200/30 font-mono">
            错误 ID: {error.digest}
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-3 bg-cheese-500 hover:bg-cheese-600 text-white font-bold rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-cheese-500/25"
        >
          <RefreshCw className="w-4 h-4" />
          重试
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 dark:bg-stone-800/80 hover:bg-cheese-100 dark:hover:bg-stone-700 text-cheese-800 dark:text-cheese-200 font-bold rounded-2xl transition-all hover:scale-105 active:scale-95 border border-cheese-200/60 dark:border-stone-700"
        >
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </Link>
      </div>
    </div>
  );
}
