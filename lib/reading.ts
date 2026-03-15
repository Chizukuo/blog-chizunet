import { Locale } from '@/types';

/**
 * 计算文章预计阅读时长（分钟）
 */
export function calcReadingTime(content: string, lang: Locale = 'zh'): number {
  const text = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/[#*`\[\]()!]/g, '')
    .trim();

  const charCount = text.length;
  const wordsPerMinute = lang === 'zh' || lang === 'ja' ? 300 : 200;
  return Math.max(1, Math.ceil(charCount / wordsPerMinute));
}
