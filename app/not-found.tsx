import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center space-y-8 px-4">
      {/* Icon instead of 3D model */}
      <div className="w-24 h-24 flex items-center justify-center rounded-[2rem] bg-cheese-500/10 dark:bg-cheese-500/5 border border-cheese-300/30 dark:border-stone-700/30 text-cheese-500 shadow-inner mb-2 relative">
        <FileQuestion className="w-12 h-12" strokeWidth={1.5} />
      </div>

      <div className="space-y-3 max-w-md">
        <h1 className="text-8xl font-black text-cheese-950 dark:text-cheese-50 tracking-tighter tabular-nums">404</h1>
        <p className="text-xl font-bold text-cheese-900/70 dark:text-cheese-200/70">
          This page has been eaten.
        </p>
        <p className="text-sm text-cheese-900/45 dark:text-cheese-200/45 font-medium">
          就像被咏掉的那块奶酪，这个页面找不到了。
        </p>
        <p className="text-sm text-cheese-900/45 dark:text-cheese-200/45 font-medium">
          このページはどこかに消えてしまいました。
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/zh"
          className="inline-flex items-center gap-2 px-6 py-3 bg-cheese-500 hover:bg-cheese-600 text-white font-bold rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-cheese-500/25"
        >
          <ArrowLeft className="w-5 h-5" />
          返回首页
        </Link>
        <Link
          href="/en"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 dark:bg-stone-800/80 hover:bg-cheese-100 dark:hover:bg-stone-700 text-cheese-800 dark:text-cheese-200 font-bold rounded-2xl transition-all hover:scale-105 active:scale-95 border border-cheese-200/60 dark:border-stone-700"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
