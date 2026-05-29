'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Inbox, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '@/hooks/useI18n';
import { translations } from '@/lib/translations';
import { Locale } from '@/types';

interface EmptyStateProps {
  message: string;
  description?: string;
  icon?: React.ComponentType<any>;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({
  message,
  description,
  icon: Icon = Inbox,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  const reduceMotion = useReducedMotion();
  const { locale, _hasHydrated } = useI18n();
  const currentLocale = (_hasHydrated ? locale : 'zh') as Locale;
  const t = translations[currentLocale] ?? translations['zh'];

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 25 }}
      className="w-full py-20 px-6 text-center max-w-xl mx-auto rounded-[2.5rem] bg-white/40 dark:bg-stone-900/30 backdrop-blur-xl border border-cheese-200/50 dark:border-stone-800/40 shadow-xl relative overflow-hidden"
    >
      {/* Decorative ambient glowing circles */}
      <div className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-cheese-500/10 dark:bg-cheese-500/5 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full bg-cheese-700/10 dark:bg-cheese-600/5 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        {/* Animated icon container */}
        <motion.div
          animate={reduceMotion ? {} : {
            y: [0, -6, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-20 h-20 flex items-center justify-center rounded-3xl bg-cheese-500/10 dark:bg-cheese-500/5 border border-cheese-300/30 dark:border-stone-700/30 text-cheese-500 shadow-inner mb-6 relative group"
        >
          {/* Pulsing ring outer glow */}
          <div className="absolute inset-0 rounded-3xl bg-cheese-500/20 blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Icon className="w-10 h-10 relative z-10" strokeWidth={1.5} />
        </motion.div>

        {/* Message */}
        <h3 className="text-2xl font-black text-cheese-950 dark:text-cheese-50 tracking-tight mb-2">
          {message}
        </h3>

        {/* Description */}
        {description ? (
          <p className="text-sm font-medium text-cheese-900/60 dark:text-cheese-200/50 max-w-sm mb-8 leading-relaxed">
            {description}
          </p>
        ) : (
          <p className="text-sm font-medium text-cheese-900/50 dark:text-cheese-200/40 max-w-sm mb-8 leading-relaxed">
            {t.noResultsDesc}
          </p>
        )}

        {/* Action Button */}
        {actionHref && (
          <Link
            href={actionHref}
            className="inline-flex items-center gap-2 px-5 py-3 font-bold bg-cheese-500 hover:bg-cheese-600 text-white rounded-2xl shadow-lg shadow-cheese-500/20 active:scale-[0.98] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{actionLabel || t.backToHome}</span>
          </Link>
        )}
      </div>
    </motion.div>
  );
}
