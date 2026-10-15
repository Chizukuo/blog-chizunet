'use client';

import { useEffect } from 'react';
import { useParams, usePathname } from 'next/navigation';
import { useI18n } from '@/hooks/useI18n';
import { Locale } from '@/types';

export const LOCALES: Locale[] = ['zh', 'en', 'ja'];
export const DEFAULT_LOCALE: Locale = 'zh';

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as string[]).includes(value);
}

/**
 * 当前界面语言：以 URL 中的 /[lang] 为准；根路径 / 渲染的是中文内容，固定为中文；
 * 其余不带语言的页面（如 404）使用用户上次选择的语言，最后回退到中文。
 */
export function useLocale(): Locale {
  const params = useParams();
  const pathname = usePathname();
  const { locale: storedLocale, _hasHydrated } = useI18n();
  const urlLocale = params?.lang;

  if (isLocale(urlLocale)) return urlLocale;
  if (pathname === '/') return DEFAULT_LOCALE;
  return _hasHydrated ? storedLocale : DEFAULT_LOCALE;
}

/**
 * 把当前语言同步到持久化 store 与 <html lang>（根布局拿不到 [lang] 参数，服务端只能输出默认值），
 * 保证 :lang() 排版规则与内容语言一致。在根布局中挂载一次即可。
 */
export function LocaleSync() {
  const locale = useLocale();
  const { locale: storedLocale, setLocale, _hasHydrated } = useI18n();

  useEffect(() => {
    if (_hasHydrated && locale !== storedLocale) setLocale(locale);
  }, [locale, storedLocale, setLocale, _hasHydrated]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}

/**
 * 把当前路径切换到另一种语言，保留子路径（归档、标签、文章等）。
 * 例：/zh/tags/react → /en/tags/react；根路径 / → /en
 */
export function switchLocalePath(pathname: string | null, target: Locale): string {
  const segments = (pathname || '/').split('/').filter(Boolean);
  if (segments.length > 0 && isLocale(segments[0])) {
    segments[0] = target;
  } else {
    segments.unshift(target);
  }
  return '/' + segments.join('/');
}
