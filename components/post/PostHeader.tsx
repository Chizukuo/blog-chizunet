'use client';

import { useI18n } from '@/hooks/useI18n';
import { translations } from '@/lib/translations';
import { calcReadingTime } from '@/lib/reading';
import { format } from "date-fns";
import { zhCN, enUS, ja } from "date-fns/locale";
import { Calendar, Clock, ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Post, Locale } from '@/types';
import { useParams } from 'next/navigation';

interface PostHeaderProps {
  post: Post;
}

function shouldOptimize(url: string): boolean {
  try {
    return url.startsWith('/') || url.startsWith('data:');
  } catch {
    return false;
  }
}

export default function PostHeader({ post }: PostHeaderProps) {
  const { locale, _hasHydrated } = useI18n();
  const params = useParams();
  const urlLocale = (params?.lang as Locale) || undefined;
  const currentLocale = urlLocale || (_hasHydrated ? locale : 'zh');
  const t = translations[currentLocale];

  const dateLocales = { zh: zhCN, en: enUS, ja: ja };
  const readingMinutes = calcReadingTime(post.body, currentLocale);

  const dateFormat = currentLocale === 'zh'
    ? 'yyyy年MM月dd日'
    : currentLocale === 'ja'
    ? 'yyyy年MM月dd日'
    : 'MMMM d, yyyy';

  return (
    <header className="w-full overflow-hidden mb-8 sm:mb-12 space-y-4 sm:space-y-6 notranslate px-4 sm:px-0">
      <Link
        href={`/${currentLocale}`}
        className="inline-flex items-center gap-2 text-sm font-bold text-cheese-600/80 dark:text-cheese-400/80 hover:text-cheese-600 dark:hover:text-cheese-400 hover:gap-3 transition-all duration-200 group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
        {t.backToHome}
      </Link>

      <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-cheese-950 dark:text-cheese-50 leading-tight tracking-tighter">
        {post.title}
      </h1>

      {post.description && (
        <p className="text-base sm:text-xl text-cheese-900/60 dark:text-cheese-200/60 font-medium leading-relaxed max-w-3xl">
          {post.description}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-sm text-cheese-900/55 dark:text-cheese-200/55 font-medium">
        {/* Author avatar */}
        <a
          href={post.user.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-cheese-700 dark:hover:text-cheese-300 transition-colors group/author"
        >
          <div className="w-7 h-7 rounded-full overflow-hidden ring-2 ring-cheese-200/60 dark:ring-stone-700/60 group-hover/author:ring-cheese-400 dark:group-hover/author:ring-cheese-500 transition-all">
            <Image
              src={post.user.avatar_url}
              alt={post.user.login}
              width={28}
              height={28}
              className="w-full h-full object-cover"
              unoptimized={!shouldOptimize(post.user.avatar_url)}
            />
          </div>
          <span>{post.user.login}</span>
        </a>

        <span className="text-cheese-300 dark:text-stone-700 select-none">·</span>

        {/* Publish date */}
        <div className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4" />
          <time dateTime={post.created_at}>
            {format(new Date(post.created_at), dateFormat, { locale: dateLocales[currentLocale] })}
          </time>
        </div>

        <span className="text-cheese-300 dark:text-stone-700 select-none">·</span>

        {/* Reading time */}
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          <span>{readingMinutes} {t.readingTime}</span>
        </div>

        {/* View on GitHub */}
        <a
          href={post.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto flex items-center gap-1 text-xs font-bold text-cheese-500/70 hover:text-cheese-600 dark:text-cheese-400/70 dark:hover:text-cheese-400 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          {t.viewOnGitHub}
        </a>
      </div>

      {/* Clickable tag badges */}
      {post.labels.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.labels.map((label) => (
            <Link
              key={label.id}
              href={`/${currentLocale}/tags/${encodeURIComponent(label.name)}`}
              className="text-xs font-bold px-3 py-1.5 bg-cheese-100/50 dark:bg-stone-800/50 backdrop-blur-sm text-cheese-700 dark:text-cheese-300 rounded-xl border border-cheese-200/60 dark:border-stone-700 shadow-sm hover:bg-cheese-200/60 dark:hover:bg-stone-700/70 hover:border-cheese-300/80 transition-all duration-200"
            >
              #{label.name}
            </Link>
          ))}
        </div>
      )}

      {post.coverImage && (
        <div className="mt-8 sm:mt-12 relative w-full aspect-video sm:aspect-[2/1] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden group">
          <Image
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            priority
            fill
            sizes="100vw"
            unoptimized={!shouldOptimize(post.coverImage)}
          />
        </div>
      )}
    </header>
  );
}
