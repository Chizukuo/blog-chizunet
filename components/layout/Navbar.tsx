'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { Github, Mail, Moon, Sun, Monitor, Languages, X, Menu, ChevronDown, Home, ExternalLink, Palette, Globe, Share2 } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '@/hooks/useI18n';
import { translations } from '@/lib/translations';
import { Locale } from '@/types';
import Logo from '@/components/ui/Logo';
import CheeseHole from '@/components/ui/CheeseHole';

/**
 * 导航栏组件，包含 Logo、语言切换、主题切换和移动端菜单
 */
export default function Navbar() {
  const pathname = usePathname();
  const params = useParams();
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

  useEffect(() => {
    if (params?.lang && typeof params.lang === 'string' && ['zh', 'en', 'ja'].includes(params.lang)) {
      setLocale(params.lang as Locale);
    }
  }, [params?.lang, setLocale]);

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

  const urlLocale = (params?.lang as Locale) || undefined;
  const currentLocale = urlLocale || (_hasHydrated ? locale : 'zh');
  const t = (translations as any)[currentLocale] ?? translations['zh'];

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

  const getLangLink = (langCode: string) => {
    if (params?.slug) {
      return `/${langCode}/${params.slug}`;
    }
    return `/${langCode}`;
  };

  return (
    <motion.nav 
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-0 w-full z-50 backdrop-blur-sm bg-white/5 dark:bg-stone-900/5 border-b border-cheese-100/20 dark:border-stone-800/30"
    >
      <div className="mx-auto max-w-[120rem] px-4 sm:px-6 py-4 sm:py-6 flex justify-between items-center">
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

      {mounted && createPortal(
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] md:hidden"
            >
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-stone-950/40 dark:bg-black/60 backdrop-blur-md" 
                onClick={() => setShowMobileMenu(false)} 
              />
              
              <motion.div
                initial={reduceMotion ? { opacity: 0 } : { x: '100%' }}
                animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute right-0 top-0 bottom-0 w-[85vw] max-w-sm bg-white dark:bg-stone-900 shadow-2xl flex flex-col overflow-hidden"
              >
                <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-10 overflow-hidden">
                  <CheeseHole className="absolute -top-10 -left-10 w-40 h-40" delay={0.1} />
                  <CheeseHole className="absolute top-1/2 -right-10 w-32 h-32" delay={0.5} />
                  <CheeseHole className="absolute -bottom-10 left-1/4 w-48 h-48" delay={0.9} />
                </div>

                <div className="relative z-10 flex flex-col h-full pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
                  <div className="p-6 flex justify-between items-center border-b border-cheese-100/50 dark:border-stone-800/50">
                    <Logo compact />
                    <button
                      onClick={() => setShowMobileMenu(false)}
                      className="w-10 h-10 flex items-center justify-center bg-cheese-50 dark:bg-stone-800 hover:bg-cheese-100 dark:hover:bg-stone-700 rounded-xl transition-colors"
                      aria-label={t.close}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex-grow overflow-y-auto p-6 space-y-8">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center gap-2 px-1 mb-2">
                        <div className="w-1 h-4 bg-cheese-500 rounded-full" />
                        <p className="text-[10px] font-black text-cheese-600 dark:text-cheese-400 uppercase tracking-[0.2em]">{t.navigation}</p>
                      </div>
                      <div className="grid gap-2">
                        <Link 
                          href={`/${currentLocale}`}
                          onClick={() => setShowMobileMenu(false)}
                          className="flex items-center gap-4 px-4 py-3.5 font-bold rounded-2xl bg-cheese-50/50 dark:bg-stone-800/40 hover:bg-cheese-100 dark:hover:bg-stone-800 transition-all active:scale-[0.98]"
                        >
                          <div className="w-10 h-10 flex items-center justify-center bg-white dark:bg-stone-800 rounded-xl shadow-sm">
                            <Home size={20} className="text-cheese-600" />
                          </div>
                          <span className="text-base">{t.home}</span>
                        </Link>
                        <a 
                          href="https://chizunet.cc" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-4 px-4 py-3.5 font-bold rounded-2xl bg-cheese-50/50 dark:bg-stone-800/40 hover:bg-cheese-100 dark:hover:bg-stone-800 transition-all active:scale-[0.98]"
                        >
                          <div className="w-10 h-10 flex items-center justify-center bg-white dark:bg-stone-800 rounded-xl shadow-sm">
                            <ExternalLink size={20} className="text-cheese-600" />
                          </div>
                          <span className="text-base">{t.mainSite}</span>
                        </a>
                      </div>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center gap-2 px-1 mb-2">
                        <div className="w-1 h-4 bg-cheese-500 rounded-full" />
                        <p className="text-[10px] font-black text-cheese-600 dark:text-cheese-400 uppercase tracking-[0.2em]">{t.appearance}</p>
                      </div>
                      <button 
                        onClick={cycleTheme} 
                        className="w-full flex items-center gap-4 px-4 py-3.5 font-bold rounded-2xl bg-cheese-50/50 dark:bg-stone-800/40 hover:bg-cheese-100 dark:hover:bg-stone-800 transition-all text-left active:scale-[0.98]"
                      >
                        <div className="w-10 h-10 flex items-center justify-center bg-white dark:bg-stone-800 rounded-xl shadow-sm">
                          <div className="text-cheese-600">{getThemeIcon()}</div>
                        </div>
                        <span className="text-base">{t.switchTheme}</span>
                        <div className="ml-auto text-[10px] font-bold px-2 py-1 bg-cheese-100 dark:bg-stone-700 rounded-lg uppercase text-cheese-700 dark:text-cheese-300">
                          {theme === 'system' ? 'Auto' : theme}
                        </div>
                      </button>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center gap-2 px-1 mb-2">
                        <div className="w-1 h-4 bg-cheese-500 rounded-full" />
                        <p className="text-[10px] font-black text-cheese-600 dark:text-cheese-400 uppercase tracking-[0.2em]">{t.language}</p>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {languages.map((lang) => (
                          <Link 
                            key={lang.code}
                            href={getLangLink(lang.code)}
                            scroll={false}
                            onClick={() => { setLocale(lang.code); setShowMobileMenu(false); }} 
                            className={`flex items-center gap-4 px-4 py-3 font-bold rounded-2xl transition-all active:scale-[0.98] ${
                              currentLocale === lang.code 
                                ? 'bg-cheese-500 text-white shadow-lg shadow-cheese-500/20' 
                                : 'bg-cheese-50/50 dark:bg-stone-800/40 hover:bg-cheese-100 dark:hover:bg-stone-800'
                            }`}
                          >
                            <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${currentLocale === lang.code ? 'bg-white/20' : 'bg-white dark:bg-stone-800 shadow-sm'}`}>
                              <span className="text-xs">{lang.code.toUpperCase()}</span>
                            </div>
                            <span className="text-base">{lang.name}</span>
                            {currentLocale === lang.code && (
                              <div className="ml-auto w-2 h-2 bg-white rounded-full" />
                            )}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="p-6 mt-auto border-t border-cheese-100/50 dark:border-stone-800/50 bg-cheese-50/30 dark:bg-stone-950/30"
                  >
                    <div className="flex items-center gap-2 px-1 mb-4">
                      <Share2 size={12} className="text-cheese-500" />
                      <p className="text-[10px] font-black text-cheese-600 dark:text-cheese-400 uppercase tracking-[0.2em]">{t.connect}</p>
                    </div>
                    <div className="flex gap-3">
                      <a 
                        href={`https://github.com/${process.env.NEXT_PUBLIC_REPO_OWNER || 'Chizukuo'}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex-1 flex flex-col items-center justify-center gap-2 p-4 bg-white dark:bg-stone-800 rounded-2xl font-bold hover:bg-cheese-50 dark:hover:bg-stone-700 transition-all shadow-sm border border-cheese-100/50 dark:border-stone-700/50 active:scale-95"
                      >
                        <Github size={20} className="text-stone-800 dark:text-white" />
                        <span className="text-xs">GitHub</span>
                      </a>
                      <a 
                        href="mailto:chizukuo@icloud.com" 
                        className="flex-1 flex flex-col items-center justify-center gap-2 p-4 bg-white dark:bg-stone-800 rounded-2xl font-bold hover:bg-cheese-50 dark:hover:bg-stone-700 transition-all shadow-sm border border-cheese-100/50 dark:border-stone-700/50 active:scale-95"
                      >
                        <Mail size={20} className="text-cheese-600" />
                        <span className="text-xs">Email</span>
                      </a>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
      </div>
    </motion.nav>
  );
}
