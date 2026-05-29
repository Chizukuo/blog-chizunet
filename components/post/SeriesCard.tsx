'use client';

import { Post } from '@/types';
import { useI18n } from '@/hooks/useI18n';
import { translations } from '@/lib/translations';
import { Layers, ChevronRight, ChevronLeft, List } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface SeriesCardProps {
  currentPost: Post;
  seriesPosts: Post[];
}

export default function SeriesCard({ currentPost, seriesPosts }: SeriesCardProps) {
  const { locale, _hasHydrated } = useI18n();
  const currentLocale = _hasHydrated ? locale : 'zh';
  const t = (translations as any)[currentLocale] ?? translations['zh'];

  if (!currentPost.series || seriesPosts.length <= 1) return null;

  // Sort posts by date (assuming series follows chronological order)
  const sortedPosts = [...seriesPosts].sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const currentIndex = sortedPosts.findIndex(p => p.slug === currentPost.slug);
  const total = sortedPosts.length;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel !bg-cheese-50/50 dark:!bg-stone-900/40 border-cheese-200/60 dark:border-stone-800/60 rounded-3xl p-6 mb-8 overflow-hidden relative"
    >
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
        <Layers size={80} className="text-cheese-500" />
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-cheese-500 flex items-center justify-center text-white shadow-lg shadow-cheese-500/20">
          <Layers size={18} />
        </div>
        <div>
          <p className="text-[10px] font-black text-cheese-600 dark:text-cheese-400 uppercase tracking-widest">{t.series}</p>
          <h3 className="font-bold text-cheese-950 dark:text-cheese-50">{currentPost.series}</h3>
        </div>
        <div className="ml-auto text-xs font-bold px-3 py-1 bg-white/50 dark:bg-stone-800/50 rounded-full border border-cheese-100 dark:border-stone-700 text-stone-500">
          {currentIndex + 1} / {total}
        </div>
      </div>

      <div className="space-y-2 relative z-10">
        {sortedPosts.map((post, index) => (
          <Link 
            key={post.slug}
            href={`/${currentLocale}/${post.slug}`}
            className={`group flex items-center gap-3 p-3 rounded-2xl transition-all ${
              post.slug === currentPost.slug 
                ? 'bg-cheese-500 text-white shadow-lg shadow-cheese-500/20' 
                : 'hover:bg-white/60 dark:hover:bg-stone-800/60 text-stone-600 dark:text-stone-400'
            }`}
          >
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold ${
              post.slug === currentPost.slug ? 'bg-white/20' : 'bg-cheese-100 dark:bg-stone-800'
            }`}>
              {index + 1}
            </div>
            <span className="flex-grow text-sm font-bold truncate">{post.title}</span>
            {post.slug === currentPost.slug && (
              <span className="text-[10px] font-black uppercase tracking-tighter bg-white/20 px-2 py-0.5 rounded">{t.part?.replace('{n}', String(index + 1)) || `#${index + 1}`}</span>
            )}
          </Link>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-cheese-100 dark:border-stone-800 flex justify-between gap-4">
        {currentIndex > 0 ? (
          <Link 
            href={`/${currentLocale}/${sortedPosts[currentIndex - 1].slug}`}
            className="flex-1 flex items-center gap-2 p-3 rounded-2xl bg-white/50 dark:bg-stone-800/50 hover:bg-cheese-100 dark:hover:bg-stone-700 transition-all text-xs font-bold text-cheese-700 dark:text-cheese-300 border border-cheese-100 dark:border-stone-700"
          >
            <ChevronLeft size={16} />
            <span className="truncate">{t.previousPost}</span>
          </Link>
        ) : <div className="flex-1" />}

        {currentIndex < total - 1 ? (
          <Link 
            href={`/${currentLocale}/${sortedPosts[currentIndex + 1].slug}`}
            className="flex-1 flex items-center justify-end gap-2 p-3 rounded-2xl bg-white/50 dark:bg-stone-800/50 hover:bg-cheese-100 dark:hover:bg-stone-700 transition-all text-xs font-bold text-cheese-700 dark:text-cheese-300 border border-cheese-100 dark:border-stone-700"
          >
            <span className="truncate">{t.nextPost}</span>
            <ChevronRight size={16} />
          </Link>
        ) : <div className="flex-1" />}
      </div>
    </motion.div>
  );
}
