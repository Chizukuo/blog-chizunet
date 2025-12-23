'use client';

import { useEffect, useState } from 'react';
import { useI18n } from '@/hooks/useI18n';
import { translations } from '@/lib/translations';
import { getPosts } from '@/lib/github';
import { Post } from '@/types';
import PostCard from './PostCard';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface PostListProps {
  initialPosts: Post[];
}

export default function PostList({ initialPosts }: PostListProps) {
  const { locale, _hasHydrated } = useI18n();
  const reduceMotion = useReducedMotion();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  
  const currentLocale = _hasHydrated ? locale : 'zh';
  const t = translations[currentLocale];

  useEffect(() => {
    // Only fetch if we have hydrated and the locale is different from 'zh'
    // or if we've already changed the locale once.
    if (!_hasHydrated) return;
    
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const data = await getPosts(locale);
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [locale, _hasHydrated]);

  return (
    <div className="space-y-12 sm:space-y-20 px-4 sm:px-0">
      <section className="text-left space-y-4 sm:space-y-6 py-8 sm:py-12 max-w-3xl">
        <motion.h1 
          key={`title-${locale}`}
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
          key={`desc-${locale}`}
          initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={reduceMotion ? undefined : { delay: 0.1 }}
          className="text-lg md:text-2xl text-cheese-900/80 dark:text-cheese-200/80 font-medium leading-relaxed"
        >
          {t.description}
        </motion.p>
      </section>

      <section className="grid gap-6 sm:gap-8 md:grid-cols-2 relative min-h-[400px]">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={reduceMotion ? undefined : { opacity: 0 }}
              animate={reduceMotion ? undefined : { opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
              className="col-span-full flex justify-center py-20"
            >
              <div className="w-12 h-12 border-4 border-cheese-500 border-t-transparent rounded-full animate-spin motion-reduce:animate-none" aria-hidden={Boolean(reduceMotion)} />
            </motion.div>
          ) : posts.length > 0 ? (
            posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={reduceMotion ? undefined : { delay: index * 0.1 }}
              >
                <PostCard post={post} />
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
    </div>
  );
}
