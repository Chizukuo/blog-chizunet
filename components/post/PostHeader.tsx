'use client';

import { useI18n } from '@/hooks/useI18n';
import { translations } from '@/lib/translations';
import { format } from "date-fns";
import { zhCN, enUS, ja } from "date-fns/locale";
import { Calendar, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Post } from '@/types';

interface PostHeaderProps {
  post: Post;
}

export default function PostHeader({ post }: PostHeaderProps) {
  const { locale, _hasHydrated } = useI18n();
  const currentLocale = _hasHydrated ? locale : 'zh';
  const t = translations[currentLocale];

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
    <header className="mb-8 sm:mb-12 space-y-4 sm:space-y-6 notranslate px-4 sm:px-0">
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-cheese-600 dark:text-cheese-400 font-bold hover:gap-3 transition-all"
      >
        <ArrowLeft className="w-5 h-5" />
        {t.backToHome}
      </Link>
      
      <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-cheese-950 dark:text-cheese-50 leading-tight tracking-tighter">
        {post.title}
      </h1>

      <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm sm:text-base text-cheese-900/60 dark:text-cheese-200/60 font-medium">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-cheese-100 dark:bg-stone-800 flex items-center justify-center">
            <User className="w-4 h-4 text-cheese-600" />
          </div>
          <span>{post.user.login}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          <time dateTime={post.created_at}>
            {format(new Date(post.created_at), currentLocale === 'zh' ? "yyyy年MM月dd日" : "MMMM d, yyyy", {
              locale: dateLocales[currentLocale]
            })}
          </time>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {post.labels.map((label) => (
          <span
            key={label.id}
            className="text-xs font-bold px-3 py-1.5 bg-cheese-100/50 dark:bg-stone-800/50 backdrop-blur-sm text-cheese-700 dark:text-cheese-300 rounded-xl border border-cheese-200/60 dark:border-stone-700 shadow-sm"
          >
            {label.name}
          </span>
        ))}
      </div>

      {post.coverImage && (
        <div className="mt-8 sm:mt-12 relative w-full aspect-video sm:aspect-[2/1] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-xl border border-cheese-200/50 dark:border-stone-800/50 group">
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
