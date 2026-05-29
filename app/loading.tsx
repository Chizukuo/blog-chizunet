import PostCardSkeleton from '@/components/post/PostCardSkeleton';

/**
 * 全局加载骨架屏 — 使用 PostCard 形状匹配的 skeleton 网格
 * 保持 cheese 品牌一致性
 */
export default function Loading() {
  return (
    <div className="relative z-10 pt-20 px-4 sm:px-0">
      {/* Hero skeleton */}
      <div className="space-y-6 py-8 sm:py-12 max-w-4xl animate-pulse">
        <div className="space-y-4">
          <div className="h-8 w-20 bg-cheese-200/40 dark:bg-stone-800/40 rounded-lg" />
          <div className="h-14 sm:h-20 w-3/4 bg-cheese-200/50 dark:bg-stone-800/50 rounded-2xl" />
        </div>
        <div className="h-6 w-2/3 bg-cheese-100/60 dark:bg-stone-800/40 rounded-lg" />
        <div className="flex gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-9 w-28 bg-cheese-100/50 dark:bg-stone-800/30 rounded-2xl" />
          ))}
        </div>
      </div>

      {/* Cards skeleton grid */}
      <div className="grid gap-6 sm:gap-8 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 mt-12 sm:mt-20">
        <PostCardSkeleton featured />
        {[...Array(5)].map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
