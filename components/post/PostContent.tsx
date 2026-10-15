'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import { Post } from '@/types';
import PostHeader from './PostHeader';
import SeriesCard from './SeriesCard';
import ShareButton from '@/components/ui/ShareButton';
import PostNavigation from './PostNavigation';
import TableOfContents from './TableOfContents';
import ReadingProgress from './ReadingProgress';
import { extractHeadings } from '@/lib/parser';

const MarkdownRenderer = dynamic(() => import('./MarkdownRenderer'));
const GiscusComments = dynamic(() => import('./GiscusComments'), { ssr: false });
const RelatedPosts = dynamic(() => import('./RelatedPosts'));
const ReadingMode = dynamic(() => import('./ReadingMode'), { ssr: false });

interface PostContentProps {
  post: Post;
  /** 同语言下的全部文章（服务端获取），用于上一篇/下一篇、相关文章与系列 */
  allPosts: Post[];
  slug: string;
}

/**
 * 文章详情内容组件
 * 数据全部由服务端（ISR）提供，不在客户端重复请求，避免加载遮罩闪烁和语言错位。
 * 集成：TOC 侧边栏、阅读进度条、阅读模式
 */
export default function PostContent({ post, allPosts, slug }: PostContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  // Extract headings for TOC
  const headings = extractHeadings(post.body);
  const seriesPosts = post.series ? allPosts.filter(p => p.series === post.series) : [];

  return (
    <>
      {/* Reading progress bar — fixed to top of viewport */}
      <ReadingProgress />

      <article className="max-w-5xl 2xl:max-w-7xl mx-auto relative z-10 pt-20 px-0 sm:px-4 lg:px-8">
        <div className="flex flex-col xl:flex-row items-start gap-12">
          <div className="flex-1 min-w-0 w-full">
            <div>
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
                className="bg-white/50 dark:bg-stone-900/50 backdrop-blur-md p-4 sm:p-8 md:p-12 rounded-none sm:rounded-panel shadow-none sm:shadow-xl border-x-0 sm:border-x border-y border-cheese-200/50 dark:border-stone-800/50 mb-12 relative min-h-[200px]"
              >
                <MarkdownRenderer content={post.body} />
              </div>
            </div>

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
