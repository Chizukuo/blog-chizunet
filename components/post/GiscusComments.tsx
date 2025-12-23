'use client';

import Giscus from '@giscus/react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useI18n } from '@/hooks/useI18n';
import { translations } from '@/lib/translations';
import { MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GiscusComments() {
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
    ? `${window.location.origin}/giscus-${resolvedTheme === 'dark' ? 'dark' : 'light'}.css`
    : '';

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="mt-20 mb-24"
    >
      <div className="space-y-8">
        <div className="flex items-center gap-3 px-2">
          <div className="p-2 bg-cheese-500/10 dark:bg-cheese-500/20 rounded-xl">
            <MessageSquare className="w-5 h-5 text-cheese-600 dark:text-cheese-400" />
          </div>
          <h3 className="text-2xl font-black text-cheese-950 dark:text-cheese-50 tracking-tight">
            {t.comments}
          </h3>
          <div className="h-px flex-grow bg-gradient-to-r from-cheese-200/50 to-transparent dark:from-stone-800/50 ml-4"></div>
        </div>
        
        <div className="glass-panel rounded-[2.5rem] p-1 md:p-4 overflow-hidden">
          <Giscus
            key={`${locale}-${resolvedTheme}`}
            id="comments"
            repo={process.env.NEXT_PUBLIC_GISCUS_REPO as any}
            repoId={process.env.NEXT_PUBLIC_GISCUS_REPO_ID as string}
            category={process.env.NEXT_PUBLIC_GISCUS_CATEGORY}
            categoryId={process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID as string}
            mapping="pathname"
            reactionsEnabled="1"
            emitMetadata="0"
            inputPosition="top"
            theme={themeUrl}
            lang={giscusLang}
            loading="lazy"
          />
        </div>
      </div>
    </motion.div>
  );
}
