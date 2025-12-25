'use client';

import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { zhCN, enUS, ja } from 'date-fns/locale';
import { Post } from '@/types';
import { Calendar, Tag, ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useI18n } from '@/hooks/useI18n';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const { locale, _hasHydrated } = useI18n();
  const reduceMotion = useReducedMotion();
  const currentLocale = _hasHydrated ? locale : 'zh';
  
  const snippet = post.description || (post.body.slice(0, 150).replace(/[#*`]/g, '') + '...');

  const dateLocales = {
    zh: zhCN,
    en: enUS,
    ja: ja,
  };

  const OPTIMIZED_DOMAINS = [
    'github.com',
    'avatars.githubusercontent.com',
    'user-images.githubusercontent.com',
    'private-user-images.githubusercontent.com',
  ];

  const shouldOptimize = (url: string) => {
    try {
      if (url.startsWith('/') || url.startsWith('data:')) return true; // Always optimize local/data images
      const hostname = new URL(url).hostname;
      return OPTIMIZED_DOMAINS.includes(hostname);
    } catch {
      return false;
    }
  };

  return (
    <motion.div
      whileHover={reduceMotion ? undefined : { y: -8, scale: 1.02 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      className="h-full"
    >
      <Link href={`/${post.lang || 'zh'}/${post.slug}`} aria-label={`查看文章 ${post.title}`} className="block h-full">
        <article role="article" aria-labelledby={`post-title-${post.id}`} className="bg-white dark:bg-stone-800/50 p-5 sm:p-8 rounded-2xl sm:rounded-[2rem] shadow-sm sm:shadow-lg hover:shadow-md sm:hover:shadow-2xl border border-cheese-200/50 dark:border-stone-700/50 flex flex-col h-full relative overflow-hidden group transition-all duration-700 ease-theme-spring">
          <div className="relative z-10 flex flex-col h-full">
            {post.coverImage && (
              <div className="mb-6 -mx-5 sm:-mx-8 -mt-5 sm:-mt-8 relative h-48 sm:h-64 overflow-hidden shadow-sm">
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

            <div className="flex items-center gap-4 text-sm text-cheese-800/60 dark:text-cheese-200/60 mb-4 font-medium">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.created_at}>
                  {format(new Date(post.created_at), currentLocale === 'zh' ? 'yyyy年MM月dd日' : 'MMM d, yyyy', {
                    locale: dateLocales[currentLocale]
                  })}
                </time>
              </div>
            </div>

            <h2 id={`post-title-${post.id}`} className="text-2xl font-bold text-cheese-950 dark:text-cheese-50 mb-4 tracking-tight group-hover:text-cheese-600 dark:group-hover:text-cheese-400 transition-colors duration-300">
              {post.title}
            </h2>

            <p className="text-cheese-900/70 dark:text-cheese-200/70 text-base leading-relaxed mb-6 flex-grow font-medium line-clamp-3">
              {snippet}
            </p>

            <div className="flex flex-wrap gap-2 mt-auto pt-4">
              {post.labels.map((label) => (
                <span
                  key={label.id}
                  className="text-xs font-bold px-3 py-1.5 bg-cheese-50/80 dark:bg-stone-700 backdrop-blur-sm text-cheese-700 dark:text-cheese-300 rounded-xl border border-cheese-200/60 dark:border-stone-600 shadow-sm transition-all duration-700 ease-theme-spring"
                >
                  {label.name}
                </span>
              ))}
            </div>
            
            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300 text-cheese-600 dark:text-cheese-400">
              <ArrowRight className="w-6 h-6" />
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
