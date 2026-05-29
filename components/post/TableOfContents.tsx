'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { List, X, ChevronRight } from 'lucide-react';
import { Heading } from '@/lib/parser';
import { useI18n } from '@/hooks/useI18n';
import { translations } from '@/lib/translations';
import { Locale } from '@/types';

interface TableOfContentsProps {
  headings: Heading[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const { locale, _hasHydrated } = useI18n();
  const currentLocale = (_hasHydrated ? locale : 'zh') as Locale;
  const t = translations[currentLocale] ?? translations['zh'];
  const reduceMotion = useReducedMotion();

  const [activeId, setActiveId] = useState<string>('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const desktopContainerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-scroll TOC container to active item
  useEffect(() => {
    if (!activeId || !desktopContainerRef.current) return;
    const activeElement = desktopContainerRef.current.querySelector(`[data-id="${CSS.escape(activeId)}"]`);
    if (activeElement) {
      activeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [activeId]);

  // Dynamic scroll listener for active heading detection
  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      const headingElements = headings
        .map(({ id }) => document.getElementById(id))
        .filter(Boolean) as HTMLElement[];

      if (headingElements.length === 0) return;

      const navEl = document.querySelector('nav');
      const navHeight = navEl ? navEl.clientHeight : 80;

      let currentActiveId = '';
      for (const el of headingElements) {
        const rect = el.getBoundingClientRect();
        // Trigger heading highlight when it passes 40px below the navigation bar
        if (rect.top <= navHeight + 40) {
          currentActiveId = el.id;
        } else {
          break;
        }
      }

      if (currentActiveId) {
        setActiveId(currentActiveId);
      } else if (headingElements[0]) {
        setActiveId(headingElements[0].id);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run initial check
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  const scrollToHeading = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      // Dynamically measure navbar height
      const navEl = document.querySelector('nav');
      const headerOffset = navEl ? navEl.clientHeight : 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset - 20;

      window.scrollTo({
        top: offsetPosition,
        behavior: reduceMotion ? 'instant' : 'smooth'
      });

      window.history.pushState(null, '', `#${id}`);
      setActiveId(id);
      setMobileOpen(false);
    }
  }, [reduceMotion]);

  if (headings.length === 0) return null;

  const minLevel = Math.min(...headings.map((h) => h.level));

  const TocContent = () => (
    <nav aria-label={t.toc}>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cheese-600/90 dark:text-cheese-400/95 mb-4 select-none">
        {t.toc}
      </p>
      <ol className="space-y-1">
        {headings.map(({ id, text, level }) => {
          const indent = (level - minLevel) * 12;
          const isActive = activeId === id;
          return (
            <li key={id} style={{ paddingLeft: `${indent}px` }}>
              <button
                onClick={() => scrollToHeading(id)}
                data-id={id}
                className={`
                  w-full text-left text-xs leading-snug py-1.5 px-2 rounded-lg transition-all duration-200 group
                  ${isActive
                    ? 'text-cheese-600 dark:text-cheese-400 font-bold bg-cheese-500/10 dark:bg-stone-850/60'
                    : 'text-cheese-900/50 dark:text-cheese-200/40 hover:text-cheese-700 dark:hover:text-cheese-300 hover:bg-cheese-50/50 dark:hover:bg-stone-800/30 font-semibold'
                  }
                `}
              >
                <span className="flex items-start gap-1">
                  {isActive && (
                    <ChevronRight className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-cheese-500" />
                  )}
                  <span className={`${!isActive ? 'ml-4.5' : ''} line-clamp-2`}>{text}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );

  return (
    <>
      {/* Desktop: sticky sidebar */}
      <aside
        ref={desktopContainerRef}
        aria-label={t.toc}
        className="hidden xl:block sticky top-28 w-60 shrink-0 self-start max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar"
      >
        <div className="bg-white/50 dark:bg-stone-900/40 backdrop-blur-md rounded-2xl border border-cheese-200/40 dark:border-stone-800/40 p-4">
          <TocContent />
        </div>
      </aside>

      {/* Mobile: floating button + bottom sheet (Portaled to document.body for high-depth stack index escape) */}
      {mounted && typeof document !== 'undefined' && createPortal(
        <div className="xl:hidden">
          <motion.button
            onClick={() => setMobileOpen(true)}
            whileTap={reduceMotion ? undefined : { scale: 0.95 }}
            aria-label={t.toc}
            className="fixed bottom-[88px] right-6 z-40 w-12 h-12 bg-cheese-500 text-white rounded-full shadow-lg shadow-cheese-500/30 flex items-center justify-center hover:bg-cheese-600 transition-colors"
          >
            <List className="w-5 h-5" strokeWidth={2.5} />
          </motion.button>

          <AnimatePresence>
            {mobileOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setMobileOpen(false)}
                  className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                />
                <motion.div
                  initial={{ opacity: 0, y: '100%' }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: '100%' }}
                  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                  className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-stone-900 rounded-t-3xl p-6 pt-4 max-h-[75vh] overflow-y-auto custom-scrollbar"
                >
                  {/* Visual handle bar for bottom sheet */}
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-1.5 bg-stone-200 dark:bg-stone-800 rounded-full" />
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-black text-cheese-900 dark:text-cheese-50">{t.toc}</span>
                    <button
                      onClick={() => setMobileOpen(false)}
                      aria-label={t.close}
                      className="p-2 rounded-xl hover:bg-cheese-50 dark:hover:bg-stone-800 transition-colors"
                    >
                      <X className="w-4 h-4 text-cheese-600 dark:text-cheese-400" />
                    </button>
                  </div>
                  <TocContent />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </>
  );
}
