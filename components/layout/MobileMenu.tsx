'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Github, Mail, X, Home, ExternalLink, Hash, CalendarDays, Monitor, Moon, Sun, Search, User } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '@/hooks/useI18n';
import { translations } from '@/lib/translations';
import { Locale } from '@/types';
import Logo from '@/components/ui/Logo';
import CheeseHole from '@/components/ui/CheeseHole';

interface MobileMenuProps {
  showMobileMenu: boolean;
  setShowMobileMenu: (show: boolean) => void;
  onOpenSearch: () => void;
}

export default function MobileMenu({ showMobileMenu, setShowMobileMenu, onOpenSearch }: MobileMenuProps) {
  const params = useParams();
  const { theme, setTheme } = useTheme();
  const { locale, setLocale, _hasHydrated } = useI18n();
  const [mounted, setMounted] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  const cycleTheme = () => {
    const modes = ['light', 'dark', 'system'];
    const nextIndex = (modes.indexOf(theme || 'system') + 1) % modes.length;
    setTheme(modes[nextIndex]);
  };

  const getThemeIcon = () => {
    if (!mounted) return <Monitor size={20} />;
    switch (theme) {
      case 'light': return <Sun size={20} />;
      case 'dark': return <Moon size={20} />;
      default: return <Monitor size={20} />;
    }
  };

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

  if (!mounted) return null;

  return createPortal(
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
                    <button 
                      onClick={() => {
                        setShowMobileMenu(false);
                        onOpenSearch();
                      }}
                      className="flex items-center gap-4 px-4 py-3.5 font-bold rounded-2xl bg-cheese-500 text-white shadow-lg shadow-cheese-500/20 transition-all active:scale-[0.98]"
                    >
                      <div className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-xl shadow-sm">
                        <Search size={20} className="text-white" />
                      </div>
                      <span className="text-base">{t.search}</span>
                    </button>
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
                    <Link 
                      href={`/${currentLocale}/archive`}
                      onClick={() => setShowMobileMenu(false)}
                      className="flex items-center gap-4 px-4 py-3.5 font-bold rounded-2xl bg-cheese-50/50 dark:bg-stone-800/40 hover:bg-cheese-100 dark:hover:bg-stone-800 transition-all active:scale-[0.98]"
                    >
                      <div className="w-10 h-10 flex items-center justify-center bg-white dark:bg-stone-800 rounded-xl shadow-sm">
                        <CalendarDays size={20} className="text-cheese-600" />
                      </div>
                      <span className="text-base">{t.archive}</span>
                    </Link>
                    <Link 
                      href={`/${currentLocale}/tags`}
                      onClick={() => setShowMobileMenu(false)}
                      className="flex items-center gap-4 px-4 py-3.5 font-bold rounded-2xl bg-cheese-50/50 dark:bg-stone-800/40 hover:bg-cheese-100 dark:hover:bg-stone-800 transition-all active:scale-[0.98]"
                    >
                      <div className="w-10 h-10 flex items-center justify-center bg-white dark:bg-stone-800 rounded-xl shadow-sm">
                        <Hash size={20} className="text-cheese-600" />
                      </div>
                      <span className="text-base">{t.tags}</span>
                    </Link>
                    <Link 
                      href={`/${currentLocale}/about`}
                      onClick={() => setShowMobileMenu(false)}
                      className="flex items-center gap-4 px-4 py-3.5 font-bold rounded-2xl bg-cheese-50/50 dark:bg-stone-800/40 hover:bg-cheese-100 dark:hover:bg-stone-800 transition-all active:scale-[0.98]"
                    >
                      <div className="w-10 h-10 flex items-center justify-center bg-white dark:bg-stone-800 rounded-xl shadow-sm">
                        <User size={20} className="text-cheese-600" />
                      </div>
                      <span className="text-base">{t.about}</span>
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
                      <div className="flex flex-col">
                        <span className="text-base">{t.mainSite}</span>
                        <span className="text-[10px] text-cheese-900/30 dark:text-cheese-200/25 font-medium">chizunet.cc</span>
                      </div>
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
                  <div className="w-1 h-4 bg-cheese-500 rounded-full" />
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
  );
}
