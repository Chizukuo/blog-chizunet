'use client';

import { useEffect, useState, useRef } from 'react';
import { useI18n } from '@/hooks/useI18n';
import dynamic from 'next/dynamic';
import { getPostBySlug, getPosts } from '@/lib/github';
import { Post } from '@/types';
import PostHeader from './PostHeader';
import SeriesCard from './SeriesCard';
import ShareButton from '@/components/ui/ShareButton';
import PostNavigation from './PostNavigation';
import TableOfContents from './TableOfContents';
import ReadingProgress from './ReadingProgress';
import { extractHeadings } from '@/lib/parser';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const MarkdownRenderer = dynamic(() => import('./MarkdownRenderer'));
const GiscusComments = dynamic(() => import('./GiscusComments'), { ssr: false });
const RelatedPosts = dynamic(() => import('./RelatedPosts'));
const ReadingMode = dynamic(() => import('./ReadingMode'), { ssr: false });

interface PostContentProps {
  initialPost: Post;
  slug: string;
}

/**
 * 文章详情内容组件，负责处理文章数据的获取和渲染
 * 集成：TOC 侧边栏、阅读进度条、阅读模式
 */
export default function PostContent({ initialPost, slug }: PostContentProps) {
  const { locale, _hasHydrated } = useI18n();
  const [post, setPost] = useState<Post>(initialPost);
  const [seriesPosts, setSeriesPosts] = useState<Post[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const reduceMotion = useReducedMotion();
  const contentRef = useRef<HTMLDivElement>(null);

  // Extract headings for TOC
  const headings = extractHeadings(post.body);

  useEffect(() => {
    if (!_hasHydrated) return;

    const fetchPostData = async () => {
      setLoading(true);
      try {
        const [data, fetchedAllPosts] = await Promise.all([
          getPostBySlug(slug, locale),
          getPosts(locale)
        ]);

        if (data) {
          setPost(data);
          if (data.series) {
            setSeriesPosts(fetchedAllPosts.filter(p => p.series === data.series));
          } else {
            setSeriesPosts([]);
          }
        }
        
        if (fetchedAllPosts) {
          setAllPosts(fetchedAllPosts);
        }
      } catch (error) {
        console.error('Failed to fetch post data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [locale, slug, _hasHydrated]);

  return (
    <>
      {/* Reading progress bar — fixed to top of viewport */}
      <ReadingProgress />

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

                {post.series && seriesPosts.length > 0 && (
                  <SeriesCard currentPost={post} seriesPosts={seriesPosts} />
                )}

                {/* Reading mode entry + content area */}
                <div className="flex items-center justify-end mb-4 px-4 sm:px-0 gap-2">
                  <ReadingMode content={post.body} />
                </div>

                <div
                  ref={contentRef}
                  className="bg-white/50 dark:bg-stone-900/50 backdrop-blur-md p-4 sm:p-8 md:p-12 rounded-none sm:rounded-[2.5rem] shadow-none sm:shadow-xl border-x-0 sm:border-x border-y border-cheese-200/50 dark:border-stone-800/50 mb-12 relative min-h-[200px]"
                >
                  {loading && (
                    <div className="absolute inset-0 bg-white/20 dark:bg-black/20 backdrop-blur-[2px] z-20 flex items-center justify-center rounded-[2.5rem]">
                      <div className={`w-10 h-10 border-4 border-cheese-500 border-t-transparent rounded-full ${reduceMotion ? '' : 'animate-spin'}`} aria-hidden={Boolean(reduceMotion)} />
                    </div>
                  )}
                  <MarkdownRenderer content={post.body} />
                </div>
              </motion.div>
            </AnimatePresence>

            <ShareButton title={post.title} />

            <PostNavigation currentPost={post} allPosts={allPosts} />

            <GiscusComments slug={slug} />
            
            <RelatedPosts currentPost={post} allPosts={allPosts} />
          </div>

          {/* TOC sidebar — visible on xl+ screens */}
          {headings.length > 0 && (
            <TableOfContents headings={headings} />
          )}
        </div>
      </article>
    </>
  );
}
