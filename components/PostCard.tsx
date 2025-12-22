'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { Post } from '@/lib/github';
import { Calendar, Tag, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const snippet = post.body.slice(0, 150).replace(/[#*`]/g, '') + '...';

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="h-full"
    >
      <Link href={`/blog/${post.number}`} className="block h-full">
        <article className="bg-white dark:bg-stone-800/50 p-8 rounded-[2rem] shadow-lg hover:shadow-2xl border border-cheese-200/50 dark:border-stone-700/50 flex flex-col h-full relative overflow-hidden group transition-all duration-700 ease-theme">
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-4 text-sm text-cheese-800/60 dark:text-cheese-200/60 mb-4 font-medium">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.created_at}>
                  {format(new Date(post.created_at), 'MMM d, yyyy')}
                </time>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-cheese-950 dark:text-cheese-50 mb-4 tracking-tight group-hover:text-cheese-600 dark:group-hover:text-cheese-400 transition-colors duration-300">
              {post.title}
            </h2>

            <p className="text-cheese-900/70 dark:text-cheese-200/70 text-base leading-relaxed mb-6 flex-grow font-medium line-clamp-3">
              {snippet}
            </p>

            <div className="flex flex-wrap gap-2 mt-auto pt-4">
              {post.labels.map((label) => (
                <span
                  key={label.id}
                  className="text-xs font-bold px-3 py-1.5 bg-cheese-50/80 dark:bg-stone-700 backdrop-blur-sm text-cheese-700 dark:text-cheese-300 rounded-xl border border-cheese-200/60 dark:border-stone-600 shadow-sm transition-colors duration-700 ease-theme"
                >
                  {label.name}
                </span>
              ))}
            </div>
            
            <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-cheese-600 dark:text-cheese-400">
              <ArrowRight className="w-6 h-6" />
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
