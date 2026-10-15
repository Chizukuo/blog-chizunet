'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Languages, ChevronDown } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { useLocale, switchLocalePath } from '@/hooks/useLocale';
import { translations } from '@/lib/translations';
import { Locale } from '@/types';

export default function LanguageToggle() {
  const pathname = usePathname();
  const { setLocale } = useI18n();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const langRef = useRef<HTMLDivElement | null>(null);

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

  const currentLocale = useLocale();
  const t = (translations as any)[currentLocale] ?? translations['zh'];

  const languages: { code: Locale; name: string }[] = [
    { code: 'zh', name: '中文' },
    { code: 'en', name: 'English' },
    { code: 'ja', name: '日本語' },
  ];

  // 切换语言时保留当前子路径（归档、标签、文章页等）
  const getLangLink = (langCode: Locale) => switchLocalePath(pathname, langCode);

  return (
    <div ref={langRef} className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowLangMenu(!showLangMenu)}
        aria-haspopup="menu"
        aria-expanded={showLangMenu}
        aria-controls="lang-menu"
        aria-label={t.langName}
        className="icon-btn h-10 px-3 duration-200 flex items-center justify-center gap-2"
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
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
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
