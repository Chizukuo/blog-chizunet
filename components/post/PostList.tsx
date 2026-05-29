'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { translations } from '@/lib/translations';
import { Post, Locale } from '@/types';
import PostCard from './PostCard';
import PostCardSkeleton from './PostCardSkeleton';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { FileText, Hash, Layers, Sparkles, Inbox } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';

interface PostListProps {
  initialPosts: Post[];
  lang: Locale;
  stats?: { totalPosts: number; totalTags: number; totalSeries: number };
}

/**
 * 文章列表组件 — Hero + Featured + 无限滚动
 * Apple 风格：交错动画、spring 曲线、流畅交互
 */
export default function PostList({ initialPosts, lang, stats }: PostListProps) {
  const reduceMotion = useReducedMotion();
  const currentLang: Locale = (lang && ['zh', 'en', 'ja'].includes(lang)) ? lang : 'zh';
  const t = translations[currentLang] ?? translations['zh'];
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialPosts.length >= 12);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPosts(initialPosts);
    setPage(1);
    setHasMore(initialPosts.length >= 12);
  }, [initialPosts]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const nextPage = page + 1;
      const res = await fetch(`/api/posts?lang=${currentLang}&page=${nextPage}&perPage=12`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      const newPosts: Post[] = data.posts || [];
      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
        setPage(nextPage);
        if (newPosts.length < 12) setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more posts", error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, currentLang]);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, loadMore]);

  // Apple spring animation config
  const springTransition = { type: 'spring' as const, stiffness: 300, damping: 30 };

  // Stat items for Hero area
  const statItems = stats ? [
    { icon: FileText, value: stats.totalPosts, label: t.postsCount },
    { icon: Hash, value: stats.totalTags, label: t.tagsCountLabel },
    { icon: Layers, value: stats.totalSeries, label: t.seriesCount },
  ] : [];

  return (
    <div className="space-y-12 sm:space-y-20 px-4 sm:px-0">
      {/* ── Hero Section ── */}
      <section className="text-left space-y-6 sm:space-y-8 py-8 sm:py-12 max-w-4xl">
        <motion.h1
          key={`title-${currentLang}`}
          initial={reduceMotion ? undefined : { opacity: 0, y: 30 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={reduceMotion ? undefined : { ...springTransition, delay: 0 }}
          className="font-black leading-none tracking-tighter"
        >
          <span className="block text-3xl md:text-5xl text-cheese-900/40 dark:text-cheese-100/40 mb-2 font-bold">
            {t.blog}
          </span>
          <span className="block text-5xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-cheese-500 to-cheese-700 filter drop-shadow-sm pb-4">
            {t.title}
          </span>
        </motion.h1>

        <motion.p
          key={`desc-${currentLang}`}
          initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={reduceMotion ? undefined : { ...springTransition, delay: 0.1 }}
          className="text-lg md:text-2xl text-cheese-900/80 dark:text-cheese-200/80 font-medium leading-relaxed"
        >
          {t.description}
        </motion.p>

        {/* Stats bar */}
        {statItems.length > 0 && (
          <motion.div
            initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={reduceMotion ? undefined : { ...springTransition, delay: 0.2 }}
            className="flex flex-wrap items-center gap-3 sm:gap-4"
          >
            {statItems.map(({ icon: Icon, value, label }, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/50 dark:bg-stone-800/30 backdrop-blur-sm border border-cheese-200/40 dark:border-stone-700/30 text-sm font-bold text-cheese-800/80 dark:text-cheese-200/60"
              >
                <Icon className="w-4 h-4 text-cheese-500/70" />
                <span className="tabular-nums text-cheese-600 dark:text-cheese-400">{value}</span>
                <span className="text-cheese-800/50 dark:text-cheese-200/40">{label}</span>
              </div>
            ))}
          </motion.div>
        )}
      </section>

      {/* ── Post Grid ── */}
      <section className="grid gap-6 sm:gap-8 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 relative min-h-[400px]">
        <AnimatePresence mode="wait">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={reduceMotion ? undefined : {
                  ...springTransition,
                  delay: Math.min(index * 0.06, 0.5),
                }}
                className={index === 0 && post.coverImage ? 'md:col-span-2' : ''}
              >
                <PostCard
                  post={post}
                  lang={currentLang}
                  priority={index < 4}
                  featured={index === 0 && !!post.coverImage}
                />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full">
              <EmptyState message={t.noPosts} icon={Inbox} />
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* ── Infinite Scroll Sentinel ── */}
      <div ref={sentinelRef} className="w-full" />

      {/* Loading skeletons */}
      {loading && (
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {[...Array(3)].map((_, i) => (
            <PostCardSkeleton key={`skeleton-${i}`} />
          ))}
        </div>
      )}

      {/* End of list message */}
      {!hasMore && posts.length > 0 && (
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0 }}
          animate={reduceMotion ? undefined : { opacity: 1 }}
          className="flex items-center justify-center gap-2 py-8 text-sm font-medium text-cheese-900/30 dark:text-cheese-200/25"
        >
          <Sparkles className="w-4 h-4" />
          <span>{t.noMorePosts}</span>
        </motion.div>
      )}
    </div>
  );
}
