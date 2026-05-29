'use client';

/**
 * PostCard 骨架屏组件 — 与 PostCard 结构匹配的 shimmer 加载占位
 * Apple 风格：柔和脉冲 + cheese 色调
 */
export default function PostCardSkeleton({ featured = false }: { featured?: boolean }) {
  return (
    <div
      className={`bg-white/60 dark:bg-stone-800/30 rounded-2xl sm:rounded-[2rem] border border-cheese-200/30 dark:border-stone-700/30 overflow-hidden animate-pulse ${
        featured ? 'col-span-full md:col-span-2' : ''
      }`}
    >
      {/* Cover image placeholder */}
      <div className={`bg-cheese-100/60 dark:bg-stone-800/60 ${featured ? 'h-64 sm:h-80' : 'h-48 sm:h-56'}`} />

      <div className="p-5 sm:p-8 space-y-4">
        {/* Meta line */}
        <div className="flex items-center gap-3">
          <div className="h-3 w-20 bg-cheese-200/50 dark:bg-stone-700/50 rounded-full" />
          <div className="h-3 w-3 bg-cheese-200/30 dark:bg-stone-700/30 rounded-full" />
          <div className="h-3 w-16 bg-cheese-200/50 dark:bg-stone-700/50 rounded-full" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <div className={`bg-cheese-200/60 dark:bg-stone-700/60 rounded-lg ${featured ? 'h-7 w-4/5' : 'h-6 w-3/4'}`} />
          {featured && <div className="h-7 w-2/5 bg-cheese-200/40 dark:bg-stone-700/40 rounded-lg" />}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-cheese-100/60 dark:bg-stone-800/50 rounded" />
          <div className="h-4 w-5/6 bg-cheese-100/60 dark:bg-stone-800/50 rounded" />
          <div className="h-4 w-2/3 bg-cheese-100/40 dark:bg-stone-800/30 rounded" />
        </div>

        {/* Tags */}
        <div className="flex gap-2 pt-2">
          <div className="h-7 w-16 bg-cheese-100/50 dark:bg-stone-800/40 rounded-xl" />
          <div className="h-7 w-20 bg-cheese-100/50 dark:bg-stone-800/40 rounded-xl" />
          <div className="h-7 w-14 bg-cheese-100/50 dark:bg-stone-800/40 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
