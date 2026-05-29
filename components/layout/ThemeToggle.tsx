'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { translations } from '@/lib/translations';

/**
 * 主题切换 — Apple 风格旋转 morph 动画
 * Sun ↔ Moon ↔ Monitor 图标带旋转过渡
 */
export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { locale, _hasHydrated } = useI18n();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  const cycleTheme = () => {
    const modes = ['light', 'dark', 'system'];
    const nextIndex = (modes.indexOf(theme || 'system') + 1) % modes.length;
    setTheme(modes[nextIndex]);
  };

  const currentLocale = _hasHydrated ? locale : 'zh';
  const t = (translations as any)[currentLocale] ?? translations['zh'];

  const getThemeKey = () => {
    if (!mounted) return 'system';
    return theme || 'system';
  };

  const iconMap: Record<string, React.ReactNode> = {
    light: <Sun size={18} />,
    dark: <Moon size={18} />,
    system: <Monitor size={18} />,
  };

  return (
    <motion.button
      whileHover={reduceMotion ? undefined : { scale: 1.08 }}
      whileTap={reduceMotion ? undefined : { scale: 0.92 }}
      onClick={cycleTheme}
      aria-label={t.switchTheme}
      className="h-10 w-10 p-2 bg-white/50 dark:bg-stone-800/50 rounded-xl hover:bg-cheese-200 dark:hover:bg-stone-700 transition-colors duration-200 ease-theme text-cheese-800 dark:text-cheese-200 relative group flex items-center justify-center overflow-hidden"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={getThemeKey()}
          initial={reduceMotion ? undefined : { rotate: -90, scale: 0, opacity: 0 }}
          animate={reduceMotion ? undefined : { rotate: 0, scale: 1, opacity: 1 }}
          exit={reduceMotion ? undefined : { rotate: 90, scale: 0, opacity: 0 }}
          transition={reduceMotion ? undefined : {
            type: 'spring',
            stiffness: 400,
            damping: 20,
          }}
          className="flex items-center justify-center"
        >
          {iconMap[getThemeKey()]}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}
