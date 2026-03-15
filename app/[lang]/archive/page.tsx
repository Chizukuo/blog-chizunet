import { getPosts } from '@/lib/github';
import { Locale, Post } from '@/types';
import { translations } from '@/lib/translations';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar } from 'lucide-react';
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
        <div className="text-center py-24">
          <p className="text-cheese-900/50 dark:text-cheese-200/50 font-medium">{t.noPosts}</p>
        </div>
      ) : (
        <div className="space-y-14 pb-20">
          {groups.map(({ year, months }) => (
            <section key={year}>
              {/* Year label */}
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-5xl sm:text-7xl font-black text-cheese-500/20 dark:text-cheese-400/20 tracking-tighter select-none tabular-nums leading-none">
                  {year}
                </h2>
                <div className="flex-1 h-[1px] bg-cheese-200/50 dark:bg-stone-800/80" />
              </div>

              {/* Months */}
              <div className="space-y-8 pl-2">
                {months.map(({ month, posts: monthPosts }) => (
                  <div key={month}>
                    <h3 className="text-xs font-black uppercase tracking-widest text-cheese-900/35 dark:text-cheese-100/35 mb-3 ml-6">
                      {month}
                    </h3>
                    <ul className="space-y-1">
                      {monthPosts.map((post) => (
                        <li key={post.id}>
                          <Link
                            href={`/${params.lang}/${post.slug}`}
                            className="group flex items-baseline gap-4 py-2.5 px-4 rounded-2xl hover:bg-cheese-50/80 dark:hover:bg-stone-800/50 transition-all duration-200"
                          >
                            {/* Date dot + day */}
                            <span className="flex-shrink-0 w-16 text-xs font-bold text-cheese-900/35 dark:text-cheese-100/35 group-hover:text-cheese-500 dark:group-hover:text-cheese-400 transition-colors tabular-nums">
                              {format(new Date(post.created_at), dayFmt, { locale: dl })}
                            </span>

                            {/* Title */}
                            <span className="flex-1 text-sm sm:text-base font-semibold text-cheese-900/80 dark:text-cheese-100/80 group-hover:text-cheese-700 dark:group-hover:text-cheese-300 transition-colors leading-snug line-clamp-1">
                              {post.title}
                            </span>

                            {/* Tags */}
                            {post.labels.length > 0 && (
                              <span className="hidden sm:flex flex-shrink-0 items-center gap-1.5">
                                {post.labels.slice(0, 2).map((label) => (
                                  <span
                                    key={label.id}
                                    className="text-[10px] font-bold px-2 py-0.5 bg-cheese-100/60 dark:bg-stone-700/60 text-cheese-600 dark:text-cheese-400 rounded-lg border border-cheese-200/50 dark:border-stone-600/50"
                                  >
                                    {label.name}
                                  </span>
                                ))}
                              </span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
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
