'use client';

import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { zhCN, enUS, ja } from 'date-fns/locale';
import { Post, Locale } from '@/types';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { calcReadingTime } from '@/lib/reading';
import { translations } from '@/lib/translations';
import { useRouter } from 'next/navigation';

interface PostCardProps {
  post: Post;
  lang: Locale;
}

/**
 * 文章卡片组件，用于在列表中展示文章摘要
 */
function shouldOptimize(url: string): boolean {
  try {
    return url.startsWith('/') || url.startsWith('data:');
  } catch {
    return false;
  }
}

export default function PostCard({ post, lang }: PostCardProps) {
  const reduceMotion = useReducedMotion();
  const t = translations[lang];
  const router = useRouter();

  const snippet = post.description || (post.body.slice(0, 150).replace(/[#*`]/g, '') + '...');
  const readingMinutes = calcReadingTime(post.body, lang);
  const postHref = `/${lang}/${post.slug}`;

  const dateLocales = { zh: zhCN, en: enUS, ja: ja };

  return (
    <motion.div
      whileHover={reduceMotion ? undefined : { y: -8, scale: 1.02 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      className="h-full"
    >
      <article
        role="link"
        tabIndex={0}
        aria-label={`查看文章 ${post.title}`}
        aria-labelledby={`post-title-${post.id}`}
        onClick={() => router.push(postHref)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            router.push(postHref);
          }
        }}
        className="bg-white dark:bg-stone-800/50 p-5 sm:p-8 rounded-2xl sm:rounded-[2rem] shadow-sm sm:shadow-lg hover:shadow-md sm:hover:shadow-2xl border border-cheese-200/50 dark:border-stone-700/50 flex flex-col h-full relative overflow-hidden group transition-all duration-700 ease-theme-spring cursor-pointer"
      >
        <div className="relative z-10 flex flex-col h-full">
            {post.coverImage && (
              <div className="mb-6 -mx-5 sm:-mx-8 -mt-5 sm:-mt-8 relative h-48 sm:h-64 overflow-hidden">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-theme-spring"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={false}
                  unoptimized={!shouldOptimize(post.coverImage)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
              </div>
            )}

            <div className="flex items-center gap-3 flex-wrap text-xs text-cheese-800/55 dark:text-cheese-200/55 mb-4 font-medium">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <time dateTime={post.created_at}>
                  {format(new Date(post.created_at), lang === 'zh' || lang === 'ja' ? 'yyyy年MM月dd日' : 'MMM d, yyyy', {
                    locale: dateLocales[lang]
                  })}
                </time>
              </div>
              <span className="text-cheese-300 dark:text-stone-700 select-none">·</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{readingMinutes} {t.readingTime}</span>
              </div>
            </div>

            <h2 id={`post-title-${post.id}`} className="text-2xl font-bold text-cheese-950 dark:text-cheese-50 mb-4 tracking-tight group-hover:text-cheese-600 dark:group-hover:text-cheese-400 transition-colors duration-300">
              <Link
                href={postHref}
                onClick={(e) => e.stopPropagation()}
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cheese-500 rounded"
              >
                {post.title}
              </Link>
            </h2>

            <p className="text-cheese-900/70 dark:text-cheese-200/70 text-base leading-relaxed mb-6 flex-grow font-medium line-clamp-3">
              {snippet}
            </p>

            <div className="flex flex-wrap gap-2 mt-auto pt-4">
              {post.labels.map((label) => (
                <Link
                  key={label.id}
                  href={`/${lang}/tags/${encodeURIComponent(label.name)}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs font-bold px-3 py-1.5 bg-cheese-50/80 dark:bg-stone-700 backdrop-blur-sm text-cheese-700 dark:text-cheese-300 rounded-xl border border-cheese-200/60 dark:border-stone-600 shadow-sm hover:bg-cheese-100 dark:hover:bg-stone-600 hover:border-cheese-300/80 transition-all duration-200"
                >
                  #{label.name}
                </Link>
              ))}
            </div>
            
            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300 text-cheese-600 dark:text-cheese-400">
              <ArrowRight className="w-6 h-6" />
            </div>
        </div>
      </article>
    </motion.div>
  );
}
