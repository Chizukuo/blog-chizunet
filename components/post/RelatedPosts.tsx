'use client';

import { Post, Locale } from '@/types';
import PostCard from './PostCard';
import { useI18n } from '@/hooks/useI18n';
import { translations } from '@/lib/translations';
import { motion } from 'framer-motion';

interface RelatedPostsProps {
  currentPost: Post;
  allPosts: Post[];
}

export default function RelatedPosts({ currentPost, allPosts }: RelatedPostsProps) {
  const { locale, _hasHydrated } = useI18n();
  const currentLocale = _hasHydrated ? locale : 'zh';
  const t = (translations as any)[currentLocale] ?? translations['zh'];

  // Filter posts that share at least one tag, excluding the current post
  const related = allPosts
    .filter(post => 
      post.slug !== currentPost.slug && 
      post.labels.some(label => 
        currentPost.labels.some(currentLabel => currentLabel.name === label.name)
      )
    )
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="mt-16 sm:mt-24 not-prose">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-center gap-3 mb-8 px-4 sm:px-0"
      >
        <div className="w-2 h-8 bg-cheese-500 rounded-full shadow-lg shadow-cheese-500/20" />
        <h2 className="text-2xl sm:text-4xl font-black text-cheese-950 dark:text-cheese-50 tracking-tight">
          {t.relatedPosts}
        </h2>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
        {related.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <PostCard post={post} lang={currentLocale} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
