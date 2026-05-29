'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Command, FileText, Tag, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Fuse from 'fuse.js';
import { useI18n } from '@/hooks/useI18n';
import { translations } from '@/lib/translations';
import { createPortal } from 'react-dom';

interface SearchItem {
  title: string;
  slug: string;
  description: string;
  tags: string[];
  date: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchItem[]>([]);
  const [fuse, setFuse] = useState<Fuse<SearchItem> | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMac, setIsMac] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);
  const { locale, _hasHydrated } = useI18n();
  const currentLocale = _hasHydrated ? locale : 'zh';
  const t = (translations as any)[currentLocale] ?? translations['zh'];

  // Fetch search index and initialize Fuse.js when modal opens
  useEffect(() => {
    if (isOpen && !fuse) {
      setLoading(true);
      fetch(`/search-${currentLocale}.json`)
        .then(res => res.json())
        .then(data => {
          const fuseOptions = {
            keys: ['title', 'description', 'tags'],
            includeScore: true,
            threshold: 0.4, // Adjust threshold for more/less fuzzy search
          };
          setFuse(new Fuse(data, fuseOptions));
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to load search index', err);
          setLoading(false);
        });
    }
  }, [isOpen, fuse, currentLocale]);

  // Detect OS for shortcut display
  useEffect(() => {
    setIsMac(typeof window !== 'undefined' && navigator.platform ? navigator.platform.toUpperCase().indexOf('MAC') >= 0 : true);
  }, []);

  // Use Fuse.js to search (with 150ms debounce for typing feedback)
  useEffect(() => {
    if (!query || !fuse) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      const searchResults = fuse.search(query).slice(0, 8);
      setResults(searchResults.map(result => result.item));
      setSelectedIndex(0);
      setIsSearching(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [query, fuse]);

  const handleSelect = useCallback((item: SearchItem) => {
    router.push(`/${currentLocale}/${item.slug}`);
    onClose();
    setQuery('');
  }, [router, currentLocale, onClose]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(results.length, 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + Math.max(results.length, 1)) % Math.max(results.length, 1));
      }
      if (e.key === 'Enter' && results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, handleSelect, onClose]);

  return (
    <>
      {mounted && typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[110] flex items-start justify-center pt-20 px-4 sm:pt-32">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-[105] bg-stone-950/45 dark:bg-black/60 backdrop-blur-xl"
              />

              {/* Modal Content */}
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="site-search"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300, mass: 0.8 }}
            className="relative z-[110] w-full max-w-2xl bg-white dark:bg-stone-900 rounded-[2.5rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.3)] overflow-hidden border border-cheese-200 dark:border-stone-800"
          >
            {/* Search Input Area */}
            <div className="relative group/input flex items-center p-6 border-b border-cheese-200 dark:border-stone-800">
              <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-cheese-400/50 to-transparent opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-500" />
              
              <div className="relative">
                {isSearching ? (
                  <div className="w-6 h-6 border-2 border-cheese-500 border-t-transparent rounded-full animate-spin mr-4" />
                ) : (
                  <Search className="w-6 h-6 text-cheese-500 mr-4 transition-transform group-focus-within/input:scale-110 duration-300" />
                )}
                <div className="absolute inset-0 bg-cheese-400/20 blur-xl rounded-full opacity-0 group-focus-within/input:opacity-100 transition-opacity" />
              </div>
              
              <label htmlFor="site-search" className="sr-only">{t.search || 'Search'}</label>
              <input
                id="site-search"
                autoFocus
                aria-label={t.search || 'Search posts'}
                placeholder={t.search || "Search posts..."}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-grow bg-transparent border-none outline-none text-xl font-black text-cheese-950 dark:text-stone-100 placeholder-cheese-300 dark:placeholder-stone-700 search-input-no-outline"
              />
              
              <div className="flex items-center gap-3">
                <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-cheese-100 dark:bg-stone-800 rounded-xl border border-cheese-200 dark:border-stone-700 text-[10px] font-black tracking-widest text-cheese-500 dark:text-stone-400 shadow-sm">
                  {isMac ? <Command size={12} /> : <span>CTRL</span>} K
                </span>
                <button 
                  onClick={onClose}
                  className="p-2.5 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-500 rounded-2xl transition-all duration-300 group/close"
                >
                  <X size={20} className="text-stone-400 group-hover/close:rotate-90 transition-transform duration-300" />
                </button>
              </div>
            </div>

            {/* Results Area */}
            <div className="max-h-[60vh] overflow-y-auto p-2 custom-scrollbar">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="inline-block w-8 h-8 border-4 border-cheese-200 border-t-cheese-500 rounded-full animate-spin mb-4" />
                  <p className="text-cheese-400 dark:text-stone-500 font-bold">{t.loading || "Finding secrets..."}</p>
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-4 py-2 text-[10px] font-black text-cheese-600 dark:text-cheese-400 uppercase tracking-widest select-none">
                    <span>{t.searchResults?.replace('{n}', String(results.length))}</span>
                    {isSearching && (
                      <div className="w-3.5 h-3.5 border-2 border-cheese-500 border-t-transparent rounded-full animate-spin" />
                    )}
                  </div>
                <motion.div 
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.05 } }
                  }}
                  role="listbox"
                  aria-label={t.searchResults || 'Search results'}
                  className="grid gap-2"
                >
                  {results.map((item, index) => (
                    <motion.button
                      key={item.slug}
                      variants={{
                        hidden: { opacity: 0, x: -10 },
                        visible: { opacity: 1, x: 0 }
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                      onClick={() => handleSelect(item)}
                      tabIndex={0}
                      role="option"
                      aria-selected={index === selectedIndex}
                      className={`group flex items-center gap-4 p-4 rounded-[1.5rem] transition-all duration-300 text-left relative overflow-hidden ${
                        index === selectedIndex 
                          ? 'bg-cheese-500 text-white shadow-xl shadow-cheese-500/25 scale-[1.02] z-10' 
                          : 'hover:bg-cheese-100/80 dark:hover:bg-stone-800'
                      }`}
                    >
                      {/* Background Glow for selected */}
                      {index === selectedIndex && (
                        <motion.div 
                          layoutId="active-bg"
                          className="absolute inset-0 bg-gradient-to-r from-cheese-500 to-cheese-600 -z-10"
                        />
                      )}

                      <div className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-all duration-500 ${
                        index === selectedIndex 
                          ? 'bg-white/20 rotate-6' 
                          : 'bg-cheese-100 dark:bg-stone-800 group-hover:rotate-3'
                      }`}>
                        <FileText size={28} className={index === selectedIndex ? 'text-white' : 'text-cheese-500'} />
                      </div>
                      
                      <div className="flex-grow min-w-0 pr-4">
                        <h3 className={`font-black text-xl truncate transition-colors ${
                          index === selectedIndex ? 'text-white' : 'text-stone-900 dark:text-stone-100 group-hover:text-cheese-600 dark:group-hover:text-cheese-400'
                        }`}>{item.title}</h3>
                        <p className={`text-xs font-semibold mt-1 line-clamp-1 transition-colors ${
                          index === selectedIndex ? 'text-white/80' : 'text-stone-500 dark:text-stone-400'
                        }`}>
                          {item.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {item.tags.slice(0, 3).map(tag => (
                            <span key={tag} className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg transition-colors ${
                              index === selectedIndex 
                                ? 'bg-white/20 text-white' 
                                : 'bg-cheese-100 dark:bg-stone-800 text-cheese-700 dark:text-stone-300 border border-cheese-200 dark:border-stone-700'
                            }`}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className={`ml-auto w-10 h-10 flex items-center justify-center rounded-2xl transition-all duration-500 ${
                        index === selectedIndex 
                          ? 'bg-white/20 text-white translate-x-0 opacity-100' 
                          : 'bg-transparent text-transparent -translate-x-4 opacity-0 group-hover:bg-cheese-100/50 dark:group-hover:bg-stone-700/50 group-hover:text-cheese-500 group-hover:translate-x-0 group-hover:opacity-100'
                      }`}>
                        <ArrowRight size={20} className={index === selectedIndex ? 'animate-bounce-x' : ''} />
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
                </div>
              ) : query ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-16 text-center"
                >
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute inset-0 bg-cheese-200 dark:bg-cheese-900/20 blur-2xl rounded-full animate-pulse" />
                    <div className="relative w-full h-full bg-white dark:bg-stone-800 rounded-[2rem] flex items-center justify-center border border-cheese-100 dark:border-stone-700 shadow-xl">
                      <Search size={40} className="text-cheese-300 dark:text-stone-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-cheese-950 dark:text-stone-100 mb-2">{t.noResults || "Nothing found"}</h3>
                  <p className="text-sm font-medium text-stone-500 dark:text-stone-400 max-w-[240px] mx-auto leading-relaxed">
                    {t.noResultsDesc || "Maybe try a different keyword? We couldn't find any secrets matching that."}
                  </p>
                </motion.div>
              ) : (
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6 px-2">
                    <div className="w-1.5 h-4 bg-cheese-500 rounded-full animate-cheese-glow" />
                    <p className="text-xs font-black text-cheese-600 dark:text-cheese-400 uppercase tracking-[0.2em]">{t.quickSearch || "Recommended Tags"}</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {['Next.js', 'React', 'CSS', 'Cheese', 'Blog', 'Tailwind'].map((suggested, idx) => (
                      <motion.button
                        key={suggested}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => setQuery(suggested)}
                        className="group/suggest flex items-center gap-3 px-5 py-4 bg-cheese-50 dark:bg-stone-800 hover:bg-cheese-500 dark:hover:bg-cheese-600 hover:text-white rounded-2xl transition-all duration-300 text-sm font-bold text-cheese-800 dark:text-cheese-200 border border-cheese-200 dark:border-stone-700 shadow-sm hover:shadow-lg hover:shadow-cheese-500/20 hover:-translate-y-1"
                      >
                        <Tag size={16} className="text-cheese-500 group-hover/suggest:text-white transition-colors" />
                        {suggested}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-cheese-50 dark:bg-stone-950 border-t border-cheese-200 dark:border-stone-800 flex justify-center gap-6 text-[10px] font-bold text-stone-500 dark:text-stone-400">
              <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-white dark:bg-stone-800 rounded border border-stone-200 dark:border-stone-700 shadow-sm">Enter</kbd> to select</span>
              <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-white dark:bg-stone-800 rounded border border-stone-200 dark:border-stone-700 shadow-sm">↑↓</kbd> to navigate</span>
              <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-white dark:bg-stone-800 rounded border border-stone-200 dark:border-stone-700 shadow-sm">Esc</kbd> to close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )}
</>
);
}
