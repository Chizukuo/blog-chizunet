'use client';

import { useEffect, useState } from 'react';
import { useI18n } from '@/hooks/useI18n';
import { getPostBySlug } from '@/lib/github';
import { Post } from '@/types';
import MarkdownRenderer from './MarkdownRenderer';
import PostHeader from './PostHeader';
import GiscusComments from './GiscusComments';
import TableOfContents from './TableOfContents';
import { Heading } from '@/lib/parser';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface PostContentProps {
  initialPost: Post;
  slug: string;
}

/**
 * 文章详情内容组件，负责处理文章数据的获取和渲染
 */
export default function PostContent({ initialPost, slug }: PostContentProps) {
  const { locale, _hasHydrated } = useI18n();
  const [post, setPost] = useState<Post>(initialPost);
  const [loading, setLoading] = useState(false);
  const [headings, setHeadings] = useState<Heading[]>([]);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!_hasHydrated) return;

    const fetchPost = async () => {
      setLoading(true);
      try {
        const data = await getPostBySlug(slug, locale);
        if (data) setPost(data);
      } catch (error) {
        console.error('Failed to fetch post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [locale, slug, _hasHydrated]);

  return (
    <article className="max-w-5xl 2xl:max-w-7xl mx-auto relative z-10 pt-20 px-0 sm:px-4 lg:px-8">
      <div className="flex flex-col xl:flex-row items-start gap-12">
        <div className="flex-1 min-w-0 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={locale}
              initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
              transition={reduceMotion ? undefined : { duration: 0.3 }}
            >
              <PostHeader post={post} />

              <div className="bg-white/50 dark:bg-stone-900/50 backdrop-blur-md p-4 sm:p-8 md:p-12 rounded-none sm:rounded-[2.5rem] shadow-none sm:shadow-xl border-x-0 sm:border-x border-y border-cheese-200/50 dark:border-stone-800/50 mb-12 relative min-h-[200px]">
                {loading && (
                  <div className="absolute inset-0 bg-white/20 dark:bg-black/20 backdrop-blur-[2px] z-20 flex items-center justify-center rounded-[2.5rem]">
                    <div className={`w-10 h-10 border-4 border-cheese-500 border-t-transparent rounded-full ${reduceMotion ? '' : 'animate-spin'}`} aria-hidden={Boolean(reduceMotion)} />
                  </div>
                )}
                <MarkdownRenderer 
                  content={post.body} 
                  onHeadingsDetected={setHeadings}
                />
              </div>
            </motion.div>
          </AnimatePresence>

          <GiscusComments slug={slug} />
        </div>
        
        <TableOfContents headings={headings} />
      </div>
    </article>
  );
}
