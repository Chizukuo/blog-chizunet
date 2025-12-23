import Link from "next/link";
import { ArrowLeft, Ghost } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-8">
      <div className="relative">
        <Ghost className="w-24 h-24 text-cheese-500 animate-bounce" />
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-2 bg-black/10 dark:bg-white/10 blur-md rounded-full"></div>
      </div>
      
      <div className="space-y-2">
        <h1 className="text-6xl font-black text-cheese-950 dark:text-cheese-50">404</h1>
        <p className="text-xl text-cheese-900/60 dark:text-cheese-200/60 font-medium">
          Oops! This page has vanished into the cheese holes.
        </p>
      </div>

      <Link 
        href="/" 
        className="inline-flex items-center gap-2 px-6 py-3 bg-cheese-500 hover:bg-cheese-600 text-white font-bold rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-cheese-500/20"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </Link>
    </div>
  );
}
