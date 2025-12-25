'use client';

import Giscus from '@giscus/react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useI18n } from '@/hooks/useI18n';
import { translations } from '@/lib/translations';
import { MessageSquare, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import CheeseHole from '@/components/ui/CheeseHole';

interface GiscusCommentsProps {
  slug?: string;
}

export default function GiscusComments({ slug }: GiscusCommentsProps) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const { locale, _hasHydrated } = useI18n();
  const currentLocale = _hasHydrated ? locale : 'zh';
  const t = translations[currentLocale];
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !_hasHydrated) return null;

  const giscusLang = ({
    zh: 'zh-CN',
    en: 'en',
    ja: 'ja',
  } as const)[currentLocale as keyof typeof translations];

  const themeUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/styles/giscus-cheese-${resolvedTheme === 'dark' ? 'dark' : 'light'}.css`
    : '';

  // If we have a slug, use it as the mapping term to share comments across languages
  // Otherwise fall back to pathname mapping
  const mapping = slug ? "specific" : "pathname";
  const term = slug || undefined;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="mt-24 mb-32 relative"
    >
      {/* Decorative Cheese Holes - Softened */}
      <div className="absolute -top-16 -right-16 w-48 h-48 opacity-80 dark:opacity-40 blur-2xl pointer-events-none select-none">
        <CheeseHole className="w-full h-full" delay={0.5} />
      </div>
      <div className="absolute -bottom-12 -left-12 w-36 h-36 opacity-70 dark:opacity-30 blur-xl pointer-events-none select-none">
        <CheeseHole className="w-full h-full" delay={1.2} />
      </div>

      <div className="space-y-8 relative z-10">
        <div className="flex items-center gap-4 px-2">
          <div className="relative group">
            <div className="absolute inset-0 bg-cheese-400 blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300 rounded-full"></div>
            <div className="relative p-3 bg-gradient-to-br from-cheese-100 to-cheese-50 dark:from-stone-800 dark:to-stone-900 rounded-2xl border border-cheese-200 dark:border-stone-700 shadow-sm group-hover:scale-110 transition-transform duration-300">
              <MessageSquare className="w-6 h-6 text-cheese-600 dark:text-cheese-400" />
            </div>
          </div>
          
          <div className="flex flex-col">
            <h3 className="text-3xl font-black text-cheese-950 dark:text-cheese-50 tracking-tight flex items-center gap-2">
              {t.comments}
              <Sparkles className="w-5 h-5 text-cheese-400 animate-pulse" />
            </h3>
            <p className="text-sm text-cheese-800/60 dark:text-stone-400 font-medium">
              Join the conversation
            </p>
          </div>
          
          <div className="h-px flex-grow bg-gradient-to-r from-cheese-300/30 via-cheese-200/20 to-transparent dark:from-stone-700/50 dark:via-stone-800/20 ml-6 rounded-full"></div>
        </div>
        
        <div className="glass-panel rounded-[2rem] p-4 sm:p-6 md:p-8 shadow-2xl shadow-cheese-500/10 dark:shadow-black/20 border-cheese-200/60 dark:border-stone-700/50 overflow-hidden min-h-[300px]">
          <div className="w-full min-w-0">
            <Giscus
              key={`${locale}-${resolvedTheme}-${slug}`}
              id="comments"
              repo={process.env.NEXT_PUBLIC_GISCUS_REPO as any}
              repoId={process.env.NEXT_PUBLIC_GISCUS_REPO_ID as string}
              category={process.env.NEXT_PUBLIC_GISCUS_CATEGORY}
              categoryId={process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID as string}
              mapping={mapping}
              term={term}
              reactionsEnabled="1"
              emitMetadata="0"
              inputPosition="top"
              theme={themeUrl}
              lang={giscusLang}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
