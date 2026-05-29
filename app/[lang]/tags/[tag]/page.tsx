import { getPostsByTag, getAllTags } from '@/lib/github';
import PostCard from '@/components/post/PostCard';
import { Locale } from '@/types';
import { translations } from '@/lib/translations';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Hash, Inbox } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import { notFound } from 'next/navigation';

interface PageProps {
  params: { lang: Locale; tag: string };
}

export const revalidate = 60;

export async function generateStaticParams() {
  const languages: Locale[] = ['zh', 'en', 'ja'];
  const params: { lang: Locale; tag: string }[] = [];

  for (const lang of languages) {
    const tags = await getAllTags(lang);
    tags.forEach(({ name }) => {
      params.push({ lang, tag: encodeURIComponent(name) });
    });
  }

  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const t = translations[params.lang] ?? translations['zh'];
  const decodedTag = decodeURIComponent(params.tag);
  const baseUrl = 'https://blog.chizunet.cc';

  return {
    title: `#${decodedTag}`,
    description: `${t.postsTagged} #${decodedTag}`,
    alternates: {
      canonical: `${baseUrl}/${params.lang}/tags/${params.tag}`,
    },
  };
}

export default async function TagPage({ params }: PageProps) {
  const t = translations[params.lang] ?? translations['zh'];
  const decodedTag = decodeURIComponent(params.tag);

  const [posts, allTags] = await Promise.all([
    getPostsByTag(params.lang, decodedTag),
    getAllTags(params.lang),
  ]);

  if (allTags.length === 0) notFound();

  const maxCount = Math.max(...allTags.map((t) => t.count), 1);

  return (
    <div className="max-w-5xl 2xl:max-w-7xl mx-auto relative z-10 pt-20 px-4 sm:px-6 lg:px-8">
      {/* Back link */}
      <Link
        href={`/${params.lang}`}
        className="inline-flex items-center gap-2 text-sm font-bold text-cheese-600/80 dark:text-cheese-400/80 hover:text-cheese-600 dark:hover:text-cheese-400 hover:gap-3 transition-all duration-200 group mb-8"
      >
        <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
        {t.backToHome}
      </Link>

      {/* Page header */}
      <div className="mb-10 space-y-2">
        <div className="flex items-center gap-3">
          <Hash className="w-8 h-8 text-cheese-500" strokeWidth={3} />
          <h1 className="text-4xl sm:text-6xl font-black text-cheese-950 dark:text-cheese-50 tracking-tighter">
            {decodedTag}
          </h1>
        </div>
        <p className="text-cheese-900/50 dark:text-cheese-200/50 font-medium text-base sm:text-lg pl-11">
          {posts.length} {t.postsTagged} #{decodedTag}
        </p>
      </div>

      {/* Tag cloud */}
      <div className="mb-12 bg-white/50 dark:bg-stone-900/50 backdrop-blur-md rounded-[2rem] border border-cheese-200/50 dark:border-stone-800/50 p-6 sm:p-8">
        <h2 className="text-xs font-black uppercase tracking-widest text-cheese-900/40 dark:text-cheese-100/40 mb-5">
          {t.tags}
        </h2>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {allTags.map(({ name, count }) => {
            const isActive = name.toLowerCase() === decodedTag.toLowerCase();
            const scale = 0.75 + (count / maxCount) * 0.5;
            return (
              <Link
                key={name}
                href={`/${params.lang}/tags/${encodeURIComponent(name)}`}
                style={{ fontSize: `${scale}rem` }}
                className={`font-bold px-3 py-1.5 rounded-xl border transition-all duration-200 leading-snug ${
                  isActive
                    ? 'bg-cheese-500 text-white border-cheese-500 shadow-md shadow-cheese-500/20'
                    : 'bg-cheese-50/80 dark:bg-stone-800/60 text-cheese-700 dark:text-cheese-300 border-cheese-200/60 dark:border-stone-700 hover:bg-cheese-100 dark:hover:bg-stone-700/70 hover:border-cheese-300'
                }`}
              >
                #{name}
                <span className={`ml-1.5 text-[0.7em] font-bold ${isActive ? 'text-white/70' : 'text-cheese-400/80 dark:text-cheese-500/80'}`}>
                  {count}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Post grid */}
      {posts.length > 0 ? (
        <section className="grid gap-6 sm:gap-8 md:grid-cols-2 xl:grid-cols-3 pb-20">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} lang={params.lang} />
          ))}
        </section>
      ) : (
        <div className="py-6">
          <EmptyState message={t.noPostsWithTag} icon={Inbox} actionHref={`/${params.lang}/tags`} actionLabel={t.tags} />
        </div>
      )}
    </div>
  );
}
