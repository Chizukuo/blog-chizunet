'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Languages, ChevronDown } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { translations } from '@/lib/translations';
import { Locale } from '@/types';

export default function LanguageToggle() {
  const params = useParams();
  const { locale, setLocale, _hasHydrated } = useI18n();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const langRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setShowLangMenu(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setShowLangMenu(false);
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  const urlLocale = (params?.lang as Locale) || undefined;
  const currentLocale = urlLocale || (_hasHydrated ? locale : 'zh');
  const t = (translations as any)[currentLocale] ?? translations['zh'];

  const languages: { code: Locale; name: string }[] = [
    { code: 'zh', name: '中文' },
    { code: 'en', name: 'English' },
    { code: 'ja', name: '日本語' },
  ];

  const getLangLink = (langCode: string) => {
    if (params?.slug) {
      return `/${langCode}/${params.slug}`;
    }
    return `/${langCode}`;
  };

  return (
    <div ref={langRef} className="relative">
      <motion.button
        whileHover={reduceMotion ? undefined : { scale: 1.05 }}
        whileTap={reduceMotion ? undefined : { scale: 0.98 }}
        onClick={() => setShowLangMenu(!showLangMenu)}
        aria-haspopup="menu"
        aria-expanded={showLangMenu}
        aria-controls="lang-menu"
        aria-label={t.langName}
        className="h-10 px-3 py-2 bg-white/50 dark:bg-stone-800/50 rounded-xl hover:bg-cheese-200 dark:hover:bg-stone-700 transition-colors duration-200 ease-theme text-cheese-800 dark:text-cheese-200 flex items-center justify-center gap-2"
      >
        <Languages size={20} aria-hidden="true" />
        <span className="text-xs font-bold hidden md:inline-block" aria-hidden>{t.langName}</span>
        <ChevronDown size={14} className="hidden md:inline-block" aria-hidden />
      </motion.button>

      <AnimatePresence>
        {showLangMenu && (
          <motion.div
            id="lang-menu"
            role="menu"
            initial={reduceMotion ? undefined : { opacity: 0, y: 10, scale: 0.95 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-36 bg-white/90 dark:bg-stone-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-cheese-200/50 dark:border-stone-800/50 overflow-hidden z-50"
          >
            {languages.map((lang) => (
              <Link
                key={lang.code}
                href={getLangLink(lang.code)}
                scroll={false}
                role="menuitem"
                onClick={() => {
                  setLocale(lang.code);
                  setShowLangMenu(false);
                }}
                className={`block w-full px-4 py-3 text-sm font-bold text-left transition-colors ${
                  currentLocale === lang.code 
                    ? 'bg-cheese-500 text-white' 
                    : 'text-cheese-900 dark:text-cheese-100 hover:bg-cheese-100 dark:hover:bg-stone-800'
                }`}
              >
                {lang.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
