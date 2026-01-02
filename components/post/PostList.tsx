'use client';

import { useState, useEffect } from 'react';
import { translations } from '@/lib/translations';
import { getPosts } from '@/lib/github';
import { Post, Locale } from '@/types';
import PostCard from './PostCard';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface PostListProps {
  initialPosts: Post[];
  lang: Locale;
}

/**
 * 文章列表组件，支持分页加载更多
 */
export default function PostList({ initialPosts, lang }: PostListProps) {
  const reduceMotion = useReducedMotion();
  const t = translations[lang];
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialPosts.length >= 12);

  useEffect(() => {
    setPosts(initialPosts);
    setPage(1);
    setHasMore(initialPosts.length >= 12);
  }, [initialPosts]);

  const loadMore = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const nextPage = page + 1;
      const newPosts = await getPosts(lang, nextPage, 12);
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
  };

  return (
    <div className="space-y-12 sm:space-y-20 px-4 sm:px-0">
      <section className="text-left space-y-4 sm:space-y-6 py-8 sm:py-12 max-w-3xl">
        <motion.h1 
          key={`title-${lang}`}
          initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
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
          key={`desc-${lang}`}
          initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={reduceMotion ? undefined : { delay: 0.1 }}
          className="text-lg md:text-2xl text-cheese-900/80 dark:text-cheese-200/80 font-medium leading-relaxed"
        >
          {t.description}
        </motion.p>
      </section>

      <section className="grid gap-6 sm:gap-8 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 relative min-h-[400px]">
        <AnimatePresence mode="wait">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={reduceMotion ? undefined : { delay: index * 0.1 }}
              >
                <PostCard post={post} lang={lang} />
              </motion.div>
            ))
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-20 glass-panel rounded-[2rem]"
            >
              <p className="text-gray-500 text-lg">{t.noPosts}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {hasMore && posts.length > 0 && (
        <div className="flex justify-center pt-8 pb-12">
          <button 
            onClick={loadMore} 
            disabled={loading} 
            className="px-6 py-3 rounded-full bg-cheese-500 hover:bg-cheese-600 text-white font-bold transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {t.loadMore}
          </button>
        </div>
      )}
    </div>
  );
}
