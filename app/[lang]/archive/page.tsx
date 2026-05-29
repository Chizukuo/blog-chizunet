import { getPosts } from '@/lib/github';
import { Locale, Post } from '@/types';
import { translations } from '@/lib/translations';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, Inbox } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import { format } from 'date-fns';
import { zhCN, enUS, ja as jaLocale } from 'date-fns/locale';

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
    title: t.archive,
    description: `${t.archive} - Chizunet Blog`,
    alternates: { canonical: `${baseUrl}/${params.lang}/archive` },
  };
}

type MonthGroup = { month: string; posts: Post[] };
type YearGroup = { year: number; months: MonthGroup[] };

function groupByYearMonth(posts: Post[], lang: Locale): YearGroup[] {
  const dateLocales = { zh: zhCN, en: enUS, ja: jaLocale };
  const dl = dateLocales[lang];

  const map = new Map<number, Map<string, Post[]>>();

  posts.forEach((post) => {
    const date = new Date(post.created_at);
    const year = date.getFullYear();
    const monthKey = format(date, lang === 'en' ? 'MMMM yyyy' : 'yyyy年MM月', { locale: dl });

    if (!map.has(year)) map.set(year, new Map());
    const yearMap = map.get(year)!;
    if (!yearMap.has(monthKey)) yearMap.set(monthKey, []);
    yearMap.get(monthKey)!.push(post);
  });

  return Array.from(map.entries())
    .sort(([a], [b]) => b - a)
    .map(([year, monthMap]) => ({
      year,
      months: Array.from(monthMap.entries())
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([month, posts]) => ({ month, posts })),
    }));
}

export default async function ArchivePage({ params }: PageProps) {
  const t = translations[params.lang] ?? translations['zh'];
  const posts = await getPosts(params.lang);
  const groups = groupByYearMonth(posts, params.lang);

  const dateLocales = { zh: zhCN, en: enUS, ja: jaLocale };
  const dl = dateLocales[params.lang];

  const dayFmt = params.lang === 'en' ? 'd MMM' : params.lang === 'ja' ? 'MM月dd日' : 'MM月dd日';

  return (
    <div className="max-w-3xl mx-auto relative z-10 pt-20 px-4 sm:px-6 lg:px-8">
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
          <Calendar className="w-8 h-8 text-cheese-500" />
          <h1 className="text-4xl sm:text-6xl font-black text-cheese-950 dark:text-cheese-50 tracking-tighter">
            {t.archive}
          </h1>
        </div>
        <p className="text-cheese-900/50 dark:text-cheese-200/50 font-medium text-base sm:text-lg pl-11">
          {posts.length} {t.allPosts}
        </p>
      </div>

      {/* Timeline */}
      {groups.length === 0 ? (
        <div className="py-12">
          <EmptyState message={t.noPosts} icon={Inbox} actionHref={`/${params.lang}`} actionLabel={t.backToHome} />
        </div>
      ) : (
        <div className="relative border-l-2 border-cheese-200 dark:border-stone-800 space-y-16 pl-8 ml-4 sm:ml-8 pb-20">
          {groups.map(({ year, months }) => (
            <section key={year} className="relative">
              {/* Year marker */}
              <div className="absolute -left-[2.3rem] sm:-left-[2.8rem] w-8 h-8 rounded-full bg-cheese-100 dark:bg-stone-900 border-4 border-cheese-400 flex items-center justify-center shadow-[0_0_15px_rgba(255,179,0,0.5)] z-10 animate-cheese-glow">
                <div className="w-2 h-2 bg-cheese-600 rounded-full" />
              </div>
              
              <h2 className="text-5xl sm:text-7xl font-black text-cheese-500/30 dark:text-cheese-400/20 tracking-tighter select-none tabular-nums leading-none mb-8 pt-1">
                {year}
              </h2>

              {/* Months */}
              <div className="space-y-10">
                {months.map(({ month, posts: monthPosts }) => (
                  <div key={month} className="relative">
                    <h3 className="text-sm font-black uppercase tracking-widest text-cheese-600 dark:text-cheese-400 mb-6">
                      {month}
                    </h3>
                    <div className="space-y-6">
                      {monthPosts.map((post) => (
                        <div key={post.id} className="group relative">
                          {/* Post node connector */}
                          <div className="absolute -left-9 sm:-left-11 top-8 w-6 h-[2px] bg-cheese-200 dark:bg-stone-800 transition-colors group-hover:bg-cheese-400" />
                          <div className="absolute -left-[2.45rem] sm:-left-[2.95rem] top-[1.8rem] w-3 h-3 rounded-full border-2 border-cheese-300 dark:border-stone-700 bg-white dark:bg-stone-900 transition-all duration-300 group-hover:scale-150 group-hover:border-cheese-500 group-hover:animate-bounce-x z-10" />

                          <Link
                            href={`/${params.lang}/${post.slug}`}
                            className="block glass-panel hover:scale-[1.02] active:scale-95 rounded-2xl p-6 hover:shadow-[0_0_20px_rgba(255,179,0,0.15)] transition-all duration-300"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-baseline gap-4">
                              <span className="flex-shrink-0 text-sm font-bold text-cheese-500/80 dark:text-cheese-400/80 tabular-nums">
                                {format(new Date(post.created_at), dayFmt, { locale: dl })}
                              </span>
                              <span className="flex-1 text-lg sm:text-xl font-bold text-cheese-900 dark:text-cheese-50 group-hover:text-cheese-600 transition-colors leading-snug">
                                {post.title}
                              </span>
                            </div>

                            {post.description && (
                              <p className="mt-3 text-sm text-cheese-900/60 dark:text-cheese-200/60 line-clamp-2">
                                {post.description}
                              </p>
                            )}

                            {post.labels.length > 0 && (
                              <div className="mt-4 flex flex-wrap gap-2">
                                {post.labels.map((label) => (
                                  <span
                                    key={label.id}
                                    className="text-xs font-bold px-2.5 py-1 bg-cheese-100/50 dark:bg-stone-800/80 text-cheese-700 dark:text-cheese-300 rounded-lg border border-cheese-200/50 dark:border-stone-700/50"
                                  >
                                    #{label.name}
                                  </span>
                                ))}
                              </div>
                            )}
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
