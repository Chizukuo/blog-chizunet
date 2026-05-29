'use client';

import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import { useI18n } from '@/hooks/useI18n';
import { translations } from '@/lib/translations';
import { Github, Mail, Rss, ArrowUpRight } from 'lucide-react';
import { useEffect, useState } from 'react';

/** 站点上线日期 — 用于计算天数 */
const SITE_LAUNCH_DATE = new Date('2025-03-01');

export default function Footer() {
  const { locale, _hasHydrated } = useI18n();
  const currentLocale = _hasHydrated ? locale : 'zh';
  const t = (translations as any)[currentLocale] ?? translations['zh'];
  const [runningDays, setRunningDays] = useState(0);

  useEffect(() => {
    const days = Math.floor(
      (Date.now() - SITE_LAUNCH_DATE.getTime()) / (1000 * 60 * 60 * 24)
    );
    setRunningDays(days);
  }, []);

  const navLinks = [
    { label: t.home, href: `/${currentLocale}` },
    { label: t.archive, href: `/${currentLocale}/archive` },
    { label: t.tags, href: `/${currentLocale}/tags` },
    { label: t.about, href: `/${currentLocale}/about` },
  ];

  const socialLinks = [
    {
      Icon: Github,
      href: `https://github.com/${process.env.NEXT_PUBLIC_REPO_OWNER || 'Chizukuo'}`,
      label: 'GitHub',
    },
    { Icon: Mail, href: 'mailto:chizukuo@icloud.com', label: 'Email' },
    { Icon: Rss, href: '/feed.xml', label: t.rssSubscribe },
  ];

  return (
    <footer className="relative z-10 border-t border-cheese-200/40 dark:border-stone-800/40 mt-12">
      {/* Main footer content */}
      <div className="max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 sm:gap-12">
          {/* Column 1 : Logo + About */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Logo compact />
            <p className="text-sm text-cheese-900/50 dark:text-cheese-200/40 font-medium leading-relaxed max-w-xs">
              {t.description}
            </p>
          </div>

          {/* Column 2 : Navigation */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-cheese-600 dark:text-cheese-400">
              {t.navigation}
            </h3>
            <ul className="space-y-2.5">
              {navLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm font-medium text-cheese-900/60 dark:text-cheese-200/50 hover:text-cheese-600 dark:hover:text-cheese-400 transition-colors duration-200 inline-flex items-center gap-1 group"
                  >
                    {label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-200" />
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="https://chizunet.cc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-cheese-900/60 dark:text-cheese-200/50 hover:text-cheese-600 dark:hover:text-cheese-400 transition-colors duration-200 inline-flex items-center gap-1 group"
                >
                  {t.mainSite}
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-200" />
                </a>
                <span className="block text-[10px] text-cheese-900/25 dark:text-cheese-200/20 mt-0.5">chizunet.cc</span>
              </li>
            </ul>
          </div>

          {/* Column 3 : Social */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-cheese-600 dark:text-cheese-400">
              {t.social}
            </h3>
            <ul className="space-y-2.5">
              {socialLinks.map(({ Icon, href, label }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-cheese-900/60 dark:text-cheese-200/50 hover:text-cheese-600 dark:hover:text-cheese-400 transition-colors duration-200 inline-flex items-center gap-2 group"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 : About snippet */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-cheese-600 dark:text-cheese-400">
              {t.about}
            </h3>
            <p className="text-sm text-cheese-900/50 dark:text-cheese-200/40 font-medium leading-relaxed">
              Built with Next.js & GitHub Issues.
            </p>
            <p className="text-xs text-cheese-900/35 dark:text-cheese-200/25 font-medium">
              Powered by Vercel · React 18 · TailwindCSS
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-cheese-200/30 dark:border-stone-800/30">
        <div className="max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-cheese-900/35 dark:text-cheese-200/25 font-medium">
            © {new Date().getFullYear()} Chizukuo. All rights reserved.
          </p>
          {runningDays > 0 && (
            <p className="text-xs text-cheese-900/25 dark:text-cheese-200/20 font-medium tabular-nums">
              {t.siteRunning.replace('{n}', String(runningDays))}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
