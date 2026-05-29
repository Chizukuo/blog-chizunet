'use client';

import { Github, Mail, Menu } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useMotionValueEvent, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useI18n } from '@/hooks/useI18n';
import { translations } from '@/lib/translations';

import Logo from '@/components/ui/Logo';
import DesktopNavigation from './DesktopNavigation';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import MobileMenu from './MobileMenu';
import SearchModal from './SearchModal';
import { Search } from 'lucide-react';

/**
 * 导航栏 — Apple vibrancy: 滚动时增强毛玻璃 + 背景不透明度
 */
export default function Navbar() {
  const { locale, _hasHydrated } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const reduceMotion = useReducedMotion();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setScrolled(latest > 20);
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (showMobileMenu || showSearch) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMobileMenu, showSearch]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentLocale = _hasHydrated ? locale : 'zh';
  const t = (translations as any)[currentLocale] ?? translations['zh'];

  return (
    <motion.nav 
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 navbar-floating ${
        scrolled
          ? 'backdrop-blur-xl bg-white/70 dark:bg-stone-900/70 border-b border-cheese-200/40 dark:border-stone-700/40 shadow-sm shadow-cheese-500/[0.03]'
          : 'backdrop-blur-sm bg-white/5 dark:bg-stone-900/5 border-b border-cheese-100/10 dark:border-stone-800/10'
      }`}
    >
      <div className="mx-auto max-w-[120rem] px-4 sm:px-6 py-4 sm:py-5 flex justify-between items-center">
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, x: -20 }}
          animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
          className="flex items-center gap-6"
        >
          <Logo />
          <DesktopNavigation />
        </motion.div>

        <div className="hidden md:flex gap-2 items-center">
          {/* Search with ⌘K hint */}
          <motion.button
            whileHover={reduceMotion ? undefined : { scale: 1.05 }}
            whileTap={reduceMotion ? undefined : { scale: 0.95 }}
            onClick={() => setShowSearch(true)}
            aria-label={t.search}
            className="h-10 px-3 bg-white/50 dark:bg-stone-800/50 rounded-xl hover:bg-cheese-200/70 dark:hover:bg-stone-700 transition-all duration-200 ease-theme text-cheese-800 dark:text-cheese-200 flex items-center gap-2"
          >
            <Search size={18} />
            <kbd className="hidden lg:inline text-[10px] font-bold text-cheese-800/30 dark:text-cheese-200/25 bg-cheese-100/50 dark:bg-stone-700/50 px-1.5 py-0.5 rounded-md border border-cheese-200/40 dark:border-stone-600/40">
              ⌘K
            </kbd>
          </motion.button>

          <LanguageToggle />
          <ThemeToggle />

          {[
            { Icon: Github, href: `https://github.com/${process.env.NEXT_PUBLIC_REPO_OWNER || 'Chizukuo'}`, label: 'GitHub' },
            { Icon: Mail, href: "mailto:chizukuo@icloud.com", label: 'Email' }
          ].map(({ Icon, href, label }, i) => (
            <motion.a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={reduceMotion ? undefined : { scale: 1.08, rotate: 3 }}
              whileTap={reduceMotion ? undefined : { scale: 0.92 }}
              className="h-10 w-10 p-2 bg-white/50 dark:bg-stone-800/50 rounded-xl hover:bg-cheese-200/70 dark:hover:bg-stone-700 transition-colors duration-200 ease-theme text-cheese-800 dark:text-cheese-200 flex items-center justify-center"
              aria-label={label}
            >
              <Icon size={18} aria-hidden="true" />
              <span className="sr-only">{label}</span>
            </motion.a>
          ))}
        </div>
        <div className="md:hidden flex items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={t.menu}
            onClick={() => setShowMobileMenu(true)}
            className="h-11 w-11 p-2 bg-white/80 dark:bg-stone-800/80 backdrop-blur-md rounded-xl hover:bg-cheese-100 dark:hover:bg-stone-700 transition-all duration-200 flex items-center justify-center shadow-sm border border-cheese-100/50 dark:border-stone-700/50 text-cheese-600 dark:text-cheese-400"
          >
            <Menu className="w-5 h-5" />
          </motion.button>
        </div>

        {mounted && <MobileMenu showMobileMenu={showMobileMenu} setShowMobileMenu={setShowMobileMenu} onOpenSearch={() => setShowSearch(true)} />}
        {mounted && <SearchModal isOpen={showSearch} onClose={() => setShowSearch(false)} />}
      </div>
    </motion.nav>
  );
}
