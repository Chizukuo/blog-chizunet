import { getAllTags } from '@/lib/github';
import { Locale } from '@/types';
import { translations } from '@/lib/translations';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Hash } from 'lucide-react';

interface PageProps {
  params: { lang: Locale };
}

export const revalidate = 60;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }, { lang: 'ja' }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const t = translations[params.lang] ?? translations['zh'];
  const baseUrl = 'https://blog.chizunet.cc';

  return {
    title: t.tags,
    description: `${t.tags} - Chizunet Blog`,
    alternates: { canonical: `${baseUrl}/${params.lang}/tags` },
  };
}

export default async function TagsPage({ params }: PageProps) {
  const t = translations[params.lang] ?? translations['zh'];
  const allTags = await getAllTags(params.lang);

  const maxCount = Math.max(...allTags.map((t) => t.count), 1);
  const totalPosts = allTags.reduce((sum, tag) => sum + tag.count, 0);

  return (
    <div className="max-w-4xl mx-auto relative z-10 pt-20 px-4 sm:px-6 lg:px-8">
      {/* Back link */}
      <Link
        href={`/${params.lang}`}
        className="inline-flex items-center gap-2 text-sm font-bold text-cheese-600/80 dark:text-cheese-400/80 hover:text-cheese-600 dark:hover:text-cheese-400 hover:gap-3 transition-all duration-200 group mb-8"
      >
        <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
        {t.backToHome}
      </Link>

      {/* Header */}
      <div className="mb-12 space-y-2">
        <div className="flex items-center gap-3">
          <Hash className="w-8 h-8 text-cheese-500" strokeWidth={3} />
          <h1 className="text-4xl sm:text-6xl font-black text-cheese-950 dark:text-cheese-50 tracking-tighter">
            {t.tags}
          </h1>
        </div>
        <p className="text-cheese-900/50 dark:text-cheese-200/50 font-medium text-base sm:text-lg pl-11">
          {allTags.length} {t.tags} · {totalPosts} {t.allPosts}
        </p>
      </div>

      {/* Tag cloud */}
      {allTags.length === 0 ? (
        <div className="text-center py-24 bg-white/50 dark:bg-stone-900/50 backdrop-blur-md rounded-[2rem] border border-cheese-200/50 dark:border-stone-800/50">
          <p className="text-cheese-900/50 dark:text-cheese-200/50 font-medium">{t.noPosts}</p>
        </div>
      ) : (
        <div className="bg-white/50 dark:bg-stone-900/50 backdrop-blur-md rounded-[2rem] border border-cheese-200/50 dark:border-stone-800/50 p-8 sm:p-12">
          <div className="flex flex-wrap gap-3 sm:gap-4 justify-start items-baseline">
            {allTags.map(({ name, count }) => {
              const scale = 0.8 + (count / maxCount) * 0.85;
              return (
                <Link
                  key={name}
                  href={`/${params.lang}/tags/${encodeURIComponent(name)}`}
                  style={{ fontSize: `${scale}rem` }}
                  className="group font-bold px-4 py-2 rounded-2xl border bg-cheese-50/80 dark:bg-stone-800/60 text-cheese-700 dark:text-cheese-300 border-cheese-200/60 dark:border-stone-700 hover:bg-cheese-500 hover:text-white hover:border-cheese-500 dark:hover:bg-cheese-500 dark:hover:text-white dark:hover:border-cheese-500 transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-cheese-500/20"
                >
                  #{name}
                  <sup className="ml-1 text-[0.6em] font-bold text-cheese-400/80 dark:text-cheese-500/80 group-hover:text-white/70 transition-colors">
                    {count}
                  </sup>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
