'use client';

import Link from 'next/link';
import { Post, Locale } from '@/types';
import { useI18n } from '@/hooks/useI18n';
import { translations } from '@/lib/translations';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

interface PostNavigationProps {
  currentPost: Post;
  allPosts: Post[];
}

/**
 * 上下篇导航 — Apple 风格宽区域触控卡片
 * 使用 glass-panel + spring hover 动画
 */
export default function PostNavigation({ currentPost, allPosts }: PostNavigationProps) {
  const { locale, _hasHydrated } = useI18n();
  const currentLocale = _hasHydrated ? locale : 'zh';
  const t = (translations as any)[currentLocale] ?? translations['zh'];
  const reduceMotion = useReducedMotion();

  // Sort posts by date descending (newest first, like the list)
  const sorted = [...allPosts].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const currentIndex = sorted.findIndex((p) => p.slug === currentPost.slug);
  if (currentIndex === -1) return null;

  // Newer = previous in list (index - 1), Older = next in list (index + 1)
  const newerPost = currentIndex > 0 ? sorted[currentIndex - 1] : null;
  const olderPost = currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null;

  if (!newerPost && !olderPost) return null;

  return (
    <nav
      aria-label="Post navigation"
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-12 mb-16 px-4 sm:px-0"
    >
      {/* Previous (newer) */}
      {newerPost ? (
        <motion.div
          whileHover={reduceMotion ? undefined : { y: -4, scale: 1.01 }}
          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
        >
          <Link
            href={`/${currentLocale}/${newerPost.slug}`}
            className="group flex flex-col h-full p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/50 dark:bg-stone-800/30 backdrop-blur-md border border-cheese-200/40 dark:border-stone-700/40 hover:border-cheese-300/80 dark:hover:border-stone-600 hover:shadow-lg hover:shadow-cheese-500/5 transition-all duration-500"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cheese-500/70 dark:text-cheese-400/70 mb-3 flex items-center gap-1.5">
              <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform duration-300" />
              {t.previousPost}
            </span>
            <span className="text-base sm:text-lg font-bold text-cheese-950 dark:text-cheese-50 leading-snug line-clamp-2 group-hover:text-cheese-600 dark:group-hover:text-cheese-400 transition-colors duration-300">
              {newerPost.title}
            </span>
            {newerPost.description && (
              <span className="mt-2 text-xs text-cheese-900/40 dark:text-cheese-200/40 line-clamp-1 font-medium">
                {newerPost.description}
              </span>
            )}
          </Link>
        </motion.div>
      ) : (
        <div />
      )}

      {/* Next (older) */}
      {olderPost ? (
        <motion.div
          whileHover={reduceMotion ? undefined : { y: -4, scale: 1.01 }}
          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
        >
          <Link
            href={`/${currentLocale}/${olderPost.slug}`}
            className="group flex flex-col h-full p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/50 dark:bg-stone-800/30 backdrop-blur-md border border-cheese-200/40 dark:border-stone-700/40 hover:border-cheese-300/80 dark:hover:border-stone-600 hover:shadow-lg hover:shadow-cheese-500/5 transition-all duration-500 text-right"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cheese-500/70 dark:text-cheese-400/70 mb-3 flex items-center justify-end gap-1.5">
              {t.nextPost}
              <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
            <span className="text-base sm:text-lg font-bold text-cheese-950 dark:text-cheese-50 leading-snug line-clamp-2 group-hover:text-cheese-600 dark:group-hover:text-cheese-400 transition-colors duration-300">
              {olderPost.title}
            </span>
            {olderPost.description && (
              <span className="mt-2 text-xs text-cheese-900/40 dark:text-cheese-200/40 line-clamp-1 font-medium">
                {olderPost.description}
              </span>
            )}
          </Link>
        </motion.div>
      ) : (
        <div />
      )}
    </nav>
  );
}
