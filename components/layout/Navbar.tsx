'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Github, Mail, Moon, Sun, Monitor, Languages, X, Menu, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '@/hooks/useI18n';
import { translations } from '@/lib/translations';
import { Locale } from '@/types';
import Logo from '@/components/ui/Logo';

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { locale, setLocale, _hasHydrated } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  const reduceMotion = useReducedMotion();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const isHomePage = pathname === '/';

  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMobileMenu]);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const cycleTheme = () => {
    const modes = ['light', 'dark', 'system'];
    const nextIndex = (modes.indexOf(theme || 'system') + 1) % modes.length;
    setTheme(modes[nextIndex]);
  };

  // Use 'zh' as fallback during hydration to match server render
  const currentLocale = _hasHydrated ? locale : 'zh';
  const t = translations[currentLocale];

  const languages: { code: Locale; name: string }[] = [
    { code: 'zh', name: '中文' },
    { code: 'en', name: 'English' },
    { code: 'ja', name: '日本語' },
  ];

  const getThemeIcon = () => {
    if (!mounted) return <Monitor size={20} />;
    switch (theme) {
      case 'light': return <Sun size={20} />;
      case 'dark': return <Moon size={20} />;
      default: return <Monitor size={20} />;
    }
  };

  return (
    <motion.nav 
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-0 w-full z-50 px-4 sm:px-6 py-4 sm:py-6 flex justify-between items-center backdrop-blur-sm bg-white/5 dark:bg-stone-900/5 border-b border-cheese-100/20 dark:border-stone-800/30"
    >
      <motion.div
        initial={reduceMotion ? undefined : { opacity: 0, x: -20 }}
        animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
        className="flex items-center gap-6"
      >
        <Logo />
        <div className="hidden md:flex items-center gap-1">
          <a 
            href="https://chizunet.cc" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-3 py-1.5 text-xs font-black text-cheese-900/40 dark:text-cheese-100/40 hover:text-cheese-600 dark:hover:text-cheese-400 transition-colors uppercase tracking-widest"
          >
            {t.mainSite}
          </a>
        </div>
      </motion.div>

      <div className="hidden md:flex gap-3 items-center">
        {/* Language Switcher */}
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
                  <button
                    key={lang.code}
                    role="menuitem"
                    onClick={() => {
                      setLocale(lang.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full px-4 py-3 text-sm font-bold text-left transition-colors ${
                      locale === lang.code 
                        ? 'bg-cheese-500 text-white' 
                        : 'text-cheese-900 dark:text-cheese-100 hover:bg-cheese-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          whileHover={reduceMotion ? undefined : { scale: 1.05 }}
          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          onClick={cycleTheme}
          aria-label={t.switchTheme}
          className="h-10 w-10 p-2 bg-white/50 dark:bg-stone-800/50 rounded-xl hover:bg-cheese-200 dark:hover:bg-stone-700 transition-colors duration-200 ease-theme text-cheese-800 dark:text-cheese-200 relative group flex items-center justify-center"
        >
          {getThemeIcon()}
        </motion.button>

        {[
          { Icon: Github, href: `https://github.com/${process.env.NEXT_PUBLIC_REPO_OWNER || 'Chizukuo'}`, label: 'GitHub' },
          { Icon: Mail, href: "mailto:chizukuo@icloud.com", label: 'Email' }
        ].map(({ Icon, href, label }, i) => (
          <motion.a
            key={i}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={reduceMotion ? undefined : { scale: 1.05, rotate: 3 }}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            className="h-10 w-10 p-2 bg-white/50 dark:bg-stone-800/50 rounded-xl hover:bg-cheese-200 dark:hover:bg-stone-700 transition-colors duration-200 ease-theme text-cheese-800 dark:text-cheese-200 flex items-center justify-center"
            aria-label={label}
          >
            <Icon size={20} aria-hidden="true" />
            <span className="sr-only">{label}</span>
          </motion.a>
        ))}
      </div>
      {/* Mobile menu button */}
      <div className="md:hidden flex items-center">
        <button
          aria-label={t.menu}
          onClick={() => setShowMobileMenu(true)}
          className="h-12 w-12 p-2 bg-white/50 dark:bg-stone-800/50 rounded-2xl hover:bg-cheese-200 dark:hover:bg-stone-700 transition-colors duration-200 ease-theme flex items-center justify-center shadow-lg shadow-cheese-500/10"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {mounted && createPortal(
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] md:hidden"
            >
              {/* Backdrop */}
              <div className="absolute inset-0 bg-cheese-50/80 dark:bg-stone-950/80 backdrop-blur-xl" onClick={() => setShowMobileMenu(false)} />
              
              <motion.div
                initial={reduceMotion ? { opacity: 0 } : { x: '100%' }}
                animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="absolute right-0 top-0 bottom-0 w-[85vw] max-w-md bg-white/95 dark:bg-stone-900/95 backdrop-blur-2xl shadow-2xl flex flex-col border-l border-cheese-200/50 dark:border-stone-800/50 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
              >
                <div className="p-6 flex justify-between items-center border-b border-cheese-100 dark:border-stone-800">
                  <Logo compact />
                  <button
                    onClick={() => setShowMobileMenu(false)}
                    className="p-3 hover:bg-cheese-100 dark:hover:bg-stone-800 rounded-2xl transition-colors"
                    aria-label={t.close}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-6">
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-cheese-500 uppercase tracking-[0.2em] mb-2 px-1">{t.navigation}</p>
                    <a 
                      href="https://chizunet.cc" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-4 px-5 py-4 font-bold rounded-2xl bg-cheese-50/50 dark:bg-stone-800/50 hover:bg-cheese-100 dark:hover:bg-stone-800 transition-colors text-lg active:scale-95 duration-200"
                    >
                      <Monitor size={22} className="text-cheese-600" /> {t.mainSite}
                    </a>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-cheese-500 uppercase tracking-[0.2em] mb-2 px-1">{t.appearance}</p>
                    <button 
                      onClick={cycleTheme} 
                      className="w-full flex items-center gap-4 px-5 py-4 font-bold rounded-2xl bg-cheese-50/50 dark:bg-stone-800/50 hover:bg-cheese-100 dark:hover:bg-stone-800 transition-colors text-lg text-left active:scale-95 duration-200"
                    >
                      <div className="text-cheese-600">{getThemeIcon()}</div> {t.switchTheme}
                    </button>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-cheese-500 uppercase tracking-[0.2em] mb-2 px-1">{t.language}</p>
                    <div className="grid grid-cols-1 gap-2">
                      {languages.map((lang) => (
                        <button 
                          key={lang.code} 
                          onClick={() => { setLocale(lang.code); setShowMobileMenu(false); }} 
                          className={`px-5 py-4 text-left font-bold rounded-2xl transition-all text-lg active:scale-95 duration-200 ${
                            locale === lang.code 
                              ? 'bg-cheese-500 text-white shadow-lg shadow-cheese-500/30' 
                              : 'bg-cheese-50/50 dark:bg-stone-800/50 hover:bg-cheese-100 dark:hover:bg-stone-800'
                          }`}
                        >
                          {lang.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-cheese-100 dark:border-stone-800">
                    <p className="text-[10px] font-black text-cheese-500 uppercase tracking-[0.2em] mb-4 px-1">{t.connect}</p>
                    <div className="flex gap-3">
                      <a 
                        href={`https://github.com/${process.env.NEXT_PUBLIC_REPO_OWNER || 'Chizukuo'}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex-1 flex items-center justify-center gap-3 p-4 bg-stone-100 dark:bg-stone-800 rounded-2xl font-bold hover:bg-cheese-100 dark:hover:bg-stone-700 transition-colors text-base active:scale-95 duration-200"
                      >
                        <Github size={20} /> GitHub
                      </a>
                      <a 
                        href="mailto:chizukuo@icloud.com" 
                        className="flex-1 flex items-center justify-center gap-3 p-4 bg-stone-100 dark:bg-stone-800 rounded-2xl font-bold hover:bg-cheese-100 dark:hover:bg-stone-700 transition-colors text-base active:scale-95 duration-200"
                      >
                        <Mail size={20} /> Email
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </motion.nav>
  );
}
