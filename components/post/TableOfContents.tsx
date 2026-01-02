'use client';

import React, { useEffect, useState } from 'react';
import { Heading } from '@/lib/parser';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { List, ChevronRight } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { translations } from '@/lib/translations';
import { useParams } from 'next/navigation';
import { Locale } from '@/types';

interface TableOfContentsProps {
  headings: Heading[];
}

/**
 * 文章目录组件，支持桌面端侧边栏和移动端浮窗展示
 */
export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { locale, _hasHydrated } = useI18n();
  const params = useParams();

  const urlLocale = (params?.lang as Locale) || undefined;
  const currentLocale = urlLocale || (_hasHydrated ? locale : 'zh');
  const t = (translations as any)[currentLocale] ?? translations['zh'];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const intersectingEntries = entries.filter(entry => entry.isIntersecting);
        if (intersectingEntries.length > 0) {
          const sortedEntries = intersectingEntries.sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          );
          setActiveId(sortedEntries[0].target.id);
        }
      },
      { rootMargin: '-100px 0% -70% 0%', threshold: 0.5 }
    );

    headings.forEach((heading) => {
      if (heading.id) {
        const element = document.getElementById(heading.id);
        if (element) observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  const TocList = ({ mobile = false }: { mobile?: boolean }) => (
    <ul className={`space-y-1 relative ${mobile ? '' : 'border-l border-stone-200 dark:border-stone-800'}`}>
      {headings.map((heading) => (
        <li
          key={heading.id}
          style={{ paddingLeft: mobile ? `${(heading.level - 1) * 16}px` : `${(heading.level - 1) * 12 + 16}px` }}
          className="relative"
        >
          {activeId === heading.id && !mobile && (
            <motion.div
              layoutId="activeToc"
              className="absolute left-0 top-0 bottom-0 w-[3px] bg-cheese-500 -ml-[1.5px] z-10 rounded-full"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <a
            href={`#${heading.id}`}
            onClick={(e) => {
              e.preventDefault();
              setActiveId(heading.id);
              if (mobile) setIsOpen(false);
              document.getElementById(heading.id)?.scrollIntoView({
                behavior: 'smooth'
              });
              window.history.pushState(null, '', `#${heading.id}`);
            }}
            className={`block py-2 text-sm transition-all duration-200 line-clamp-2 ${
              activeId === heading.id
                ? 'text-cheese-600 dark:text-cheese-400 font-bold translate-x-1'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:translate-x-1'
            }`}
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <motion.nav 
        initial={{ opacity: 0, x: 50 }}
        animate={{ 
          opacity: 1, 
          x: 0,
          width: isCollapsed ? '3.5rem' : '18rem',
          height: isCollapsed ? '3.5rem' : 'auto'
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="hidden xl:block sticky top-32 self-start ml-8 group"
      >
        <div className={`bg-white/40 dark:bg-stone-900/40 backdrop-blur-md rounded-[2rem] border border-cheese-200/50 dark:border-stone-800/50 shadow-sm transition-all duration-300 h-full ${isCollapsed ? 'p-0 flex items-center justify-center' : 'p-6'}`}>
          <div className={`flex items-center justify-between ${isCollapsed ? 'mb-0' : 'mb-6'}`}>
            <div className="flex items-center gap-2 overflow-hidden">
              <button
                onClick={() => isCollapsed && setIsCollapsed(false)}
                className={`w-10 h-10 min-w-[2.5rem] rounded-full bg-cheese-100 dark:bg-stone-800 flex items-center justify-center text-cheese-600 transition-all ${isCollapsed ? 'hover:bg-cheese-200 dark:hover:bg-stone-700 hover:scale-110 active:scale-95 cursor-pointer' : 'cursor-default'}`}
                aria-label={isCollapsed ? '展开目录' : undefined}
              >
                <List size={20} />
              </button>
              {!isCollapsed && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-stone-900 dark:text-stone-100 font-black uppercase tracking-widest text-xs whitespace-nowrap"
                >
                  {t.toc || '目录'}
                </motion.span>
              )}
            </div>
            {!isCollapsed && (
              <button
                onClick={() => setIsCollapsed(true)}
                className="p-1.5 rounded-xl hover:bg-cheese-100 dark:hover:bg-stone-800 text-stone-400 hover:text-cheese-600 transition-colors"
                aria-label="折叠目录"
              >
                <ChevronRight size={18} />
              </button>
            )}
          </div>
          
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="max-h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar pr-2"
            >
              <TocList />
            </motion.div>
          )}
        </div>
      </motion.nav>

      <div className="xl:hidden fixed bottom-8 right-8 z-50">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="absolute bottom-16 right-0 w-72 max-h-[60vh] bg-white/90 dark:bg-stone-900/90 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-cheese-200/50 dark:border-stone-800/50 overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center">
                <span className="font-bold text-stone-900 dark:text-stone-100">{t.toc || '目录'}</span>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
                  aria-label="关闭目录"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <div className="p-6 overflow-y-auto custom-scrollbar">
                <TocList mobile />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? '关闭目录' : '打开目录'}
          aria-expanded={isOpen}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors ${
            isOpen 
              ? 'bg-cheese-500 text-white' 
              : 'bg-white dark:bg-stone-800 text-cheese-600 border border-cheese-200 dark:border-stone-700'
          }`}
        >
          <List size={24} />
        </motion.button>
      </div>
    </>
  );
}
