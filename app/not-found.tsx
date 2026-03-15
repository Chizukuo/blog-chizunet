import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center space-y-10 px-4">
      {/* Cheese SVG illustration */}
      <div className="relative select-none">
        <svg
          width="160"
          height="140"
          viewBox="0 0 160 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="drop-shadow-xl"
        >
          {/* Cheese wedge body */}
          <path
            d="M10 110 L80 10 L150 110 Z"
            fill="#FFCA28"
            stroke="#FFB300"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Rind bottom */}
          <rect x="10" y="110" width="140" height="20" rx="6" fill="#FF8F00" />
          {/* Holes */}
          <circle cx="60" cy="80" r="12" fill="#FFB300" opacity="0.7" />
          <circle cx="100" cy="65" r="8" fill="#FFB300" opacity="0.7" />
          <circle cx="78" cy="50" r="5" fill="#FFB300" opacity="0.6" />
          {/* Bite mark */}
          <path
            d="M120 30 Q135 15 150 30 Q140 45 130 40 Q125 35 120 30Z"
            fill="#FFFDF5"
            className="dark:fill-[#0c0a09]"
          />
        </svg>
        {/* Floating crumbs */}
        <div className="absolute top-2 right-0 w-3 h-3 rounded-full bg-cheese-400 opacity-80 animate-bounce" style={{ animationDelay: '0.2s' }} />
        <div className="absolute top-8 right-6 w-2 h-2 rounded-full bg-cheese-300 opacity-70 animate-bounce" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-4 right-10 w-1.5 h-1.5 rounded-full bg-cheese-500 opacity-60 animate-bounce" style={{ animationDelay: '0.1s' }} />
      </div>

      <div className="space-y-3 max-w-md">
        <h1 className="text-8xl font-black text-cheese-950 dark:text-cheese-50 tracking-tighter tabular-nums">404</h1>
        <p className="text-xl font-bold text-cheese-900/70 dark:text-cheese-200/70">
          This page has been eaten.
        </p>
        <p className="text-sm text-cheese-900/45 dark:text-cheese-200/45 font-medium">
          就像被咏掉的那块奶酪，这个页面找不到了。
        </p>
      </div>

      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-cheese-500 hover:bg-cheese-600 text-white font-bold rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-cheese-500/25"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </Link>
    </div>
  );
}
