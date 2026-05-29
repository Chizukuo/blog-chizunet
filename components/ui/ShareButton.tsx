'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { translations } from '@/lib/translations';
import { Locale } from '@/types';

interface ShareButtonProps {
  title: string;
  url?: string;
}

export default function ShareButton({ title, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [animating, setAnimating] = useState(false);
  const { locale, _hasHydrated } = useI18n();
  const currentLocale = (_hasHydrated ? locale : 'zh') as Locale;
  const t = translations[currentLocale] ?? translations['zh'];

  const handleShare = async () => {
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    
    setAnimating(true);
    setTimeout(() => setAnimating(false), 1000);

    try {
      if (navigator.share) {
        await navigator.share({ title, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <div className="flex justify-center my-8">
      <button
        onClick={handleShare}
        aria-label={copied ? t.copied : t.sharePost}
        className={`relative group flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 transform
          ${animating ? 'scale-95 animate-cheese-glow' : 'hover:scale-105 hover:shadow-[0_0_20px_rgba(255,179,0,0.3)]'}
          bg-white/80 dark:bg-stone-800/80 backdrop-blur-md border border-cheese-200/50 dark:border-stone-700/50
          text-cheese-700 dark:text-cheese-300 shadow-xl overflow-hidden`}
      >
        {/* Glow shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-cheese-400/0 via-cheese-400/10 to-cheese-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        
        {copied ? (
          <>
            <Check className="w-5 h-5 text-green-500" />
            <span>{t.copied}</span>
          </>
        ) : (
          <>
            <Share2 className={`w-5 h-5 ${animating ? 'animate-bounce-x' : 'group-hover:rotate-12 transition-transform'}`} />
            <span>{t.sharePost}</span>
          </>
        )}
      </button>
    </div>
  );
}
