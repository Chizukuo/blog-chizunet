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
  priority?: boolean;
  featured?: boolean;
}

/**
 * 文章卡片组件 — Apple 风格：精致圆角、glass 质感、spring hover
 * featured 模式：横向双列大卡
 */
function shouldOptimize(url: string): boolean {
  try {
    return url.startsWith('/') || url.startsWith('data:');
  } catch {
    return false;
  }
}

export default function PostCard({ post, lang, priority, featured }: PostCardProps) {
  const reduceMotion = useReducedMotion();
  const t = translations[lang];
  const router = useRouter();

  const snippet = post.description || (post.body.slice(0, 150).replace(/[#*`]/g, '') + '...');
  const readingMinutes = calcReadingTime(post.body, lang);
  const postHref = `/${lang}/${post.slug}`;

  const dateLocales = { zh: zhCN, en: enUS, ja: ja };

  return (
    <motion.div
      whileHover={reduceMotion ? undefined : { y: -6, scale: 1.015 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="h-full"
    >
      <article
        role="link"
        tabIndex={0}
        aria-label={`${t.readMore}: ${post.title}`}
        aria-labelledby={`post-title-${post.id}`}
        onClick={() => router.push(postHref)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            router.push(postHref);
          }
        }}
        className={`
          bg-white/80 dark:bg-stone-800/40 backdrop-blur-sm
          rounded-2xl sm:rounded-[2rem]
          shadow-sm sm:shadow-lg
          hover:shadow-xl sm:hover:shadow-2xl hover:shadow-cheese-500/[0.06] dark:hover:shadow-black/30
          border border-cheese-200/50 dark:border-stone-700/40
          hover:border-cheese-300/70 dark:hover:border-stone-600/70
          flex ${featured ? 'flex-col md:flex-row' : 'flex-col'} h-full
          relative overflow-hidden group
          transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
          cursor-pointer
        `}
      >
        {/* Cover Image */}
        {post.coverImage && (
          <div className={`relative overflow-hidden ${
            featured
              ? 'md:w-[45%] h-56 sm:h-64 md:h-auto md:min-h-[280px]'
              : 'h-48 sm:h-56'
          }`}>
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
              sizes={featured
                ? '(max-width: 768px) 100vw, 45vw'
                : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
              }
              priority={priority}
              unoptimized={!shouldOptimize(post.coverImage)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10" />
          </div>
        )}

        {/* Content */}
        <div className={`relative z-10 flex flex-col flex-1 p-5 sm:p-7 ${featured ? 'md:p-8 justify-center' : ''}`}>
          {/* Category badge */}
          {post.category && (
            <div className={`${featured ? 'mb-4' : 'absolute top-0 right-0 z-20'}`}>
              <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-cheese-500 text-white shadow-lg shadow-cheese-500/20 ${
                featured ? 'rounded-lg inline-block' : 'rounded-bl-2xl rounded-tr-none'
              }`}>
                {post.category}
              </div>
            </div>
          )}

          {/* Meta line */}
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
            {post.series && (
              <>
                <span className="text-cheese-300 dark:text-stone-700 select-none">·</span>
                <div className="text-[10px] font-black text-cheese-600 dark:text-cheese-400 uppercase tracking-widest bg-cheese-50 dark:bg-stone-800 px-2 py-0.5 rounded-md border border-cheese-100 dark:border-stone-700">
                  {post.series}
                </div>
              </>
            )}
          </div>

          {/* Title */}
          <h2
            id={`post-title-${post.id}`}
            className={`font-bold text-cheese-950 dark:text-cheese-50 mb-3 tracking-tight group-hover:text-cheese-600 dark:group-hover:text-cheese-400 transition-colors duration-300 ${
              featured ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
            }`}
          >
            <Link
              href={postHref}
              onClick={(e) => e.stopPropagation()}
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cheese-500 rounded"
            >
              {post.title}
            </Link>
          </h2>

          {/* Snippet */}
          <p className={`text-cheese-900/70 dark:text-cheese-200/70 leading-relaxed mb-5 flex-grow font-medium ${
            featured ? 'text-base line-clamp-4' : 'text-sm sm:text-base line-clamp-3'
          }`}>
            {snippet}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-auto">
            {post.labels.map((label) => (
              <Link
                key={label.id}
                href={`/${lang}/tags/${encodeURIComponent(label.name)}`}
                onClick={(e) => e.stopPropagation()}
                className="text-xs font-bold px-3 py-1.5 bg-cheese-50/80 dark:bg-stone-700/60 backdrop-blur-sm text-cheese-700 dark:text-cheese-300 rounded-xl border border-cheese-200/60 dark:border-stone-600 shadow-sm hover:bg-cheese-100 dark:hover:bg-stone-600 hover:border-cheese-300/80 transition-all duration-200"
              >
                #{label.name}
              </Link>
            ))}
          </div>

          {/* Arrow indicator */}
          <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300 text-cheese-600 dark:text-cheese-400">
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>
      </article>
    </motion.div>
  );
}
