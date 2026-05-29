'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { BookOpen, X, Type } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { translations } from '@/lib/translations';
import { Locale } from '@/types';
import dynamic from 'next/dynamic';
import { createPortal } from 'react-dom';

const MarkdownRenderer = dynamic(() => import('./MarkdownRenderer'), { ssr: false });

type FontSize = 'sm' | 'base' | 'lg' | 'xl';

const FONT_SIZES: { key: FontSize; label: string; cls: string }[] = [
  { key: 'sm',   label: 'S',  cls: 'text-sm leading-relaxed' },
  { key: 'base', label: 'M',  cls: 'text-base leading-relaxed' },
  { key: 'lg',   label: 'L',  cls: 'text-lg leading-relaxed' },
  { key: 'xl',   label: 'XL', cls: 'text-xl leading-relaxed' },
];

interface ReadingModeProps {
  content: string;
}

/**
 * 阅读模式 — 隐藏导航/侧边栏，聚焦内容，可调字号
 * 按 ESC 退出
 */
export default function ReadingMode({ content }: ReadingModeProps) {
  const { locale, _hasHydrated } = useI18n();
  const currentLocale = (_hasHydrated ? locale : 'zh') as Locale;
  const t = translations[currentLocale] ?? translations['zh'];
  const reduceMotion = useReducedMotion();

  const [active, setActive] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>('base');
  const [mounted, setMounted] = useState(false);
  const prevOverflow = useRef('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const enter = useCallback(() => {
    prevOverflow.current = document.body.style.overflow;
    setActive(true);
  }, []);

  const exit = useCallback(() => {
    document.body.style.overflow = prevOverflow.current;
    setActive(false);
  }, []);

  // ESC to exit
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && active) exit();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [active, exit]);

  // Lock scroll when active
  useEffect(() => {
    if (active) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = prevOverflow.current;
    }
  }, [active]);

  const currentFontCls = FONT_SIZES.find(f => f.key === fontSize)?.cls ?? '';

  return (
    <>
      {/* Toggle button — shown only on post pages on large screens */}
      <button
        onClick={active ? exit : enter}
        aria-label={active ? t.exitReadingMode : t.readingMode}
        aria-pressed={active}
        className="hidden lg:inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-xl bg-white/60 dark:bg-stone-800/50 border border-cheese-200/50 dark:border-stone-700/50 text-cheese-700 dark:text-cheese-300 hover:bg-cheese-100 dark:hover:bg-stone-700 transition-all duration-200 backdrop-blur-sm"
      >
        <BookOpen className="w-3.5 h-3.5" />
        {active ? t.exitReadingMode : t.readingMode}
      </button>

      {/* Reading mode overlay */}
      {mounted && typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {active && (
            <>
              {/* Backdrop that covers the entire viewport */}
              <motion.div
                key="reading-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.3 }}
                className="fixed inset-0 z-[100] bg-cheese-50 dark:bg-[#0c0a09]"
              />

              {/* Floating controls bar */}
              <motion.div
                key="reading-controls"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300, delay: reduceMotion ? 0 : 0.1 }}
                className="fixed top-4 right-4 z-[110] flex items-center gap-2 bg-white/90 dark:bg-stone-900/90 backdrop-blur-xl rounded-2xl border border-cheese-200/50 dark:border-stone-700/50 shadow-xl p-2"
              >
                {/* Font size switcher */}
                <div className="flex items-center gap-1 px-1" role="group" aria-label={t.fontSize}>
                  <Type className="w-3.5 h-3.5 text-cheese-500 mr-1" />
                  {FONT_SIZES.map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setFontSize(key)}
                      aria-pressed={fontSize === key}
                      className={`w-8 h-8 rounded-lg text-xs font-black transition-all duration-200 ${
                        fontSize === key
                          ? 'bg-cheese-500 text-white shadow-sm'
                          : 'text-cheese-700 dark:text-cheese-300 hover:bg-cheese-100 dark:hover:bg-stone-700'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="w-px h-6 bg-cheese-200/50 dark:bg-stone-700/50" />

                {/* Exit button */}
                <button
                  onClick={exit}
                  aria-label={t.exitReadingMode}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-cheese-600 dark:text-cheese-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-500 transition-all duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>

              {/* Scrollable reading pane */}
              <motion.div
                key="reading-pane"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.2, delay: reduceMotion ? 0 : 0.15 }}
                className="fixed inset-0 z-[105] overflow-y-auto custom-scrollbar"
              >
                <div className={`max-w-3xl mx-auto px-6 sm:px-10 py-20 pb-32 ${currentFontCls}`}>
                  <div className="prose prose-cheese dark:prose-invert max-w-none">
                    <MarkdownRenderer content={content} />
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
