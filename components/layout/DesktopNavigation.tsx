'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/hooks/useI18n';
import { translations } from '@/lib/translations';
import { motion, useReducedMotion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

/**
 * 桌面端导航 — Apple 风格
 * 路由说明：
 * - 主站 = chizunet.cc（个人网站，外链）
 * - 首页 / 归档 / 标签 = 博客内路由
 */
export default function DesktopNavigation() {
  const { locale, _hasHydrated } = useI18n();
  const currentLocale = _hasHydrated ? locale : 'zh';
  const t = (translations as any)[currentLocale] ?? translations['zh'];
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  // 博客内部路由
  const internalLinks = [
    { href: `/${currentLocale}`, label: t.home },
    { href: `/${currentLocale}/archive`, label: t.archive },
    { href: `/${currentLocale}/tags`, label: t.tags },
    { href: `/${currentLocale}/about`, label: t.about },
  ];

  const isActive = (href: string) => {
    if (!pathname) return false;
    // Exact match for home, prefix match for others
    if (href === `/${currentLocale}`) {
      return pathname === href || pathname === `/${currentLocale}/`;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="hidden md:flex items-center gap-0.5">
      {/* Internal blog routes */}
      {internalLinks.map(({ href, label }) => {
        const active = isActive(href);
        return (
          <Link
            key={href}
            href={href}
            className={`relative px-3.5 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${
              active
                ? 'text-cheese-700 dark:text-cheese-400'
                : 'text-cheese-900/40 dark:text-cheese-100/40 hover:text-cheese-600 dark:hover:text-cheese-400 hover:bg-cheese-100/50 dark:hover:bg-stone-800/50'
            }`}
          >
            {label}
            {active && (
              <motion.div
                layoutId="nav-active-indicator"
                className="absolute bottom-0 left-3 right-3 h-[2px] bg-cheese-500 rounded-full"
                transition={reduceMotion ? undefined : {
                  type: 'spring',
                  stiffness: 380,
                  damping: 30,
                }}
              />
            )}
          </Link>
        );
      })}

      {/* Separator */}
      <div className="w-px h-4 bg-cheese-200/30 dark:bg-stone-700/30 mx-1.5" />

      {/* External: Personal site */}
      <a
        href="https://chizunet.cc"
        target="_blank"
        rel="noopener noreferrer"
        className="relative px-3 py-2 text-xs font-bold tracking-wide rounded-xl text-cheese-900/35 dark:text-cheese-100/30 hover:text-cheese-600 dark:hover:text-cheese-400 hover:bg-cheese-100/50 dark:hover:bg-stone-800/50 transition-all duration-300 inline-flex items-center gap-1.5 group"
      >
        {t.mainSite}
        <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
      </a>
    </div>
  );
}
