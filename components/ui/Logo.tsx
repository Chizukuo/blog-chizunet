'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

type LogoProps = {
  compact?: boolean;
  className?: string;
};

export default function Logo({ compact = false, className = '' }: LogoProps) {
  const containerSize = compact ? 'w-10 h-10' : 'w-12 h-12 sm:w-14 sm:h-14';
  const titleSize = compact ? 'text-base sm:text-lg' : 'text-lg sm:text-xl';
  const showBlogBadge = !compact;
  const scaleClass = compact ? 'group-hover:scale-100' : 'motion-safe:group-hover:scale-105';

  return (
    <Link href="/" aria-label="Homepage — CHIZU NET" className={`group flex items-center p-2 sm:p-0 ${compact ? 'gap-2' : 'gap-3'} no-underline ${className}`}>
      <div className={`relative ${containerSize} flex items-center justify-center bg-cheese-100 dark:bg-cheese-700 rounded-xl shadow-sm dark:shadow-md ring-1 ring-cheese-200 dark:ring-stone-800 overflow-hidden`}>
        <Image
          src="/favicon.ico"
          alt="CHIZU NET logo"
          width={compact ? 32 : 48}
          height={compact ? 32 : 48}
          className={`select-none ${scaleClass} motion-safe:transition-transform duration-300 ease-theme-spring motion-reduce:transition-none`}
        />

        {/* Shine Effect (purely decorative) */}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
      </div>

      <div className="flex flex-col leading-none">
        <div className="flex items-baseline gap-1">
          <span className={`${titleSize} font-black tracking-tighter text-cheese-950 dark:text-cheese-50 group-hover:text-cheese-600 transition-colors`}>
            CHIZU<span className="text-cheese-500">NET</span>
          </span>
          {showBlogBadge && (
            <span className="text-[10px] font-black text-cheese-500/80 dark:text-cheese-400/80 uppercase tracking-widest">BLOG</span>
          )}
        </div>
        {!compact && (
          <span className="text-[10px] font-bold tracking-[0.1em] text-cheese-900/40 dark:text-cheese-100/40 uppercase mt-0.5">
            Thoughts & Code
          </span>
        )}
      </div>
    </Link>
  );
}
