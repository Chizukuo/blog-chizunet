import { Locale } from '@/types';
import { translations } from '@/lib/translations';
import { getStats } from '@/lib/github';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Github, Mail, Rss, BookOpen, FileText, Hash, Layers } from 'lucide-react';
import SchemaOrg from '@/components/seo/SchemaOrg';

interface PageProps {
  params: { lang: Locale };
}

export const revalidate = 3600;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }, { lang: 'ja' }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const t = translations[params.lang] ?? translations['zh'];
  const baseUrl = 'https://blog.chizunet.cc';

  return {
    title: t.about,
    description: t.description,
    alternates: {
      canonical: `${baseUrl}/${params.lang}/about`,
      languages: {
        zh: `${baseUrl}/zh/about`,
        en: `${baseUrl}/en/about`,
        ja: `${baseUrl}/ja/about`,
      },
    },
    openGraph: {
      title: `${t.about} | Chizunet Blog`,
      description: t.description,
      url: `${baseUrl}/${params.lang}/about`,
      type: 'website',
    },
  };
}

const ABOUT_CONTENT: Record<Locale, {
  greeting: string;
  bio: string[];
  techTitle: string;
  tech: string[];
  contactTitle: string;
}> = {
  zh: {
    greeting: '你好，我是 Chizukuo 👋',
    bio: [
      '一个热爱技术与创作的独立开发者，专注于 Web 开发、系统设计和计算机科学。',
      '这个博客是我记录思考、分享技术见解、探索创意的地方。文章从编程实践、软件工程到生活感悟，涵盖广泛。',
      '博客由 GitHub Issues 驱动，使用 Next.js 构建，是一次将工程与内容创作融为一体的尝试。',
    ],
    techTitle: '技术栈',
    tech: ['Next.js / React', 'TypeScript', 'Tailwind CSS', 'GitHub Issues CMS', 'Framer Motion', 'KaTeX / Mermaid'],
    contactTitle: '联系方式',
  },
  en: {
    greeting: 'Hey, I\'m Chizukuo 👋',
    bio: [
      'An independent developer passionate about technology and creation, focusing on web development, system design, and computer science.',
      'This blog is where I document my thoughts, share technical insights, and explore ideas — spanning programming, software engineering, and life reflections.',
      'The blog is powered by GitHub Issues and built with Next.js — an experiment in merging engineering with content creation.',
    ],
    techTitle: 'Tech Stack',
    tech: ['Next.js / React', 'TypeScript', 'Tailwind CSS', 'GitHub Issues CMS', 'Framer Motion', 'KaTeX / Mermaid'],
    contactTitle: 'Contact',
  },
  ja: {
    greeting: 'こんにちは、Chizukuoです 👋',
    bio: [
      'Web开发、系统设计、コンピュータサイエンスに情熱を持つ独立した開発者です。',
      'このブログは、思考を記録し、技術的な洞察を共有し、アイデアを探求する場所です。プログラミングからソフトウェアエンジニアリング、日常の考察まで幅広く扱います。',
      'このブログはGitHub Issuesで駆動し、Next.jsで構築されています。エンジニアリングとコンテンツ制作を融合させる試みです。',
    ],
    techTitle: '技術スタック',
    tech: ['Next.js / React', 'TypeScript', 'Tailwind CSS', 'GitHub Issues CMS', 'Framer Motion', 'KaTeX / Mermaid'],
    contactTitle: '連絡先',
  },
};

export default async function AboutPage({ params }: PageProps) {
  const t = translations[params.lang] ?? translations['zh'];
  const content = ABOUT_CONTENT[params.lang] ?? ABOUT_CONTENT['zh'];
  const stats = await getStats(params.lang);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: `${t.about} | Chizunet Blog`,
    description: t.description,
    url: `https://blog.chizunet.cc/${params.lang}/about`,
    mainEntity: {
      '@type': 'Person',
      name: 'Chizukuo',
      url: `https://github.com/${process.env.NEXT_PUBLIC_REPO_OWNER || 'Chizukuo'}`,
    },
  };

  const socialLinks = [
    {
      Icon: Github,
      label: 'GitHub',
      href: `https://github.com/${process.env.NEXT_PUBLIC_REPO_OWNER || 'Chizukuo'}`,
    },
    { Icon: Mail, label: 'Email', href: 'mailto:chizukuo@icloud.com' },
    { Icon: Rss, label: 'RSS', href: '/feed.xml' },
  ];

  const statItems = [
    { icon: FileText, value: stats.totalPosts, label: t.postsCount },
    { icon: Hash, value: stats.totalTags, label: t.tagsCountLabel },
    { icon: Layers, value: stats.totalSeries, label: t.seriesCount },
  ];

  return (
    <div className="max-w-3xl mx-auto relative z-10 pt-20 px-4 sm:px-6 lg:px-8 pb-24">
      <SchemaOrg schema={jsonLd} />

      {/* Back link */}
      <Link
        href={`/${params.lang}`}
        className="inline-flex items-center gap-2 text-sm font-bold text-cheese-600/80 dark:text-cheese-400/80 hover:text-cheese-600 dark:hover:text-cheese-400 hover:gap-3 transition-all duration-200 group mb-8"
      >
        <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
        {t.backToHome}
      </Link>

      <div className="space-y-8 w-full">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-cheese-500" />
            <h1 className="text-4xl sm:text-6xl font-black text-cheese-950 dark:text-cheese-50 tracking-tighter">
              {t.about}
            </h1>
          </div>
        </div>

        {/* Bio section */}
        <section className="bg-white/60 dark:bg-stone-900/50 backdrop-blur-md rounded-[2.5rem] border border-cheese-200/50 dark:border-stone-800/50 p-8 sm:p-10 shadow-sm transition-all hover:shadow-md hover:border-cheese-300/60 dark:hover:border-stone-700/55 duration-300">
          <h2 className="text-2xl sm:text-3xl font-black text-cheese-950 dark:text-cheese-50 tracking-tight mb-6">
            {content.greeting}
          </h2>
          <div className="space-y-4">
            {content.bio.map((paragraph, i) => (
              <p key={i} className="text-base sm:text-lg text-cheese-900/70 dark:text-cheese-200/70 leading-relaxed font-medium">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section>
          <div className="grid grid-cols-3 gap-4">
            {statItems.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="bg-white/60 dark:bg-stone-900/50 backdrop-blur-md rounded-3xl border border-cheese-200/50 dark:border-stone-800/50 p-5 text-center shadow-sm transition-all hover:shadow-md hover:scale-[1.02] hover:border-cheese-300/60 dark:hover:border-stone-700/55 duration-300"
              >
                <Icon className="w-5 h-5 text-cheese-500 mx-auto mb-2" />
                <div className="text-3xl font-black text-cheese-600 dark:text-cheese-400 tabular-nums">
                  {value}
                </div>
                <div className="text-xs font-bold text-cheese-900/50 dark:text-cheese-200/40 mt-1">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tech stack */}
        <section className="bg-white/60 dark:bg-stone-900/50 backdrop-blur-md rounded-[2.5rem] border border-cheese-200/50 dark:border-stone-800/50 p-8 sm:p-10 shadow-sm transition-all hover:shadow-md hover:border-cheese-300/60 dark:hover:border-stone-700/55 duration-300">
          <h2 className="text-xs font-black text-cheese-950 dark:text-cheese-50 tracking-tight mb-5 uppercase tracking-[0.2em] text-cheese-600 dark:text-cheese-400">
            {content.techTitle}
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {content.tech.map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-cheese-50/80 dark:bg-stone-800/60 text-cheese-700 dark:text-cheese-300 rounded-xl border border-cheese-200/60 dark:border-stone-700/50 text-sm font-bold shadow-sm hover:scale-[1.03] transition-all hover:bg-cheese-100 dark:hover:bg-stone-800 duration-200 cursor-default"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="bg-white/60 dark:bg-stone-900/50 backdrop-blur-md rounded-[2.5rem] border border-cheese-200/50 dark:border-stone-800/50 p-8 sm:p-10 shadow-sm transition-all hover:shadow-md hover:border-cheese-300/60 dark:hover:border-stone-700/55 duration-300">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-cheese-600 dark:text-cheese-400 mb-5">
            {content.contactTitle}
          </h2>
          <div className="flex flex-wrap gap-3">
            {socialLinks.map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center gap-2.5 px-5 py-3 bg-cheese-50/80 dark:bg-stone-800/60 text-cheese-700 dark:text-cheese-300 rounded-2xl border border-cheese-200/60 dark:border-stone-700/50 text-sm font-bold hover:bg-cheese-500 hover:text-white hover:border-cheese-500 dark:hover:bg-cheese-500 dark:hover:text-white dark:hover:border-cheese-500 transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-cheese-500/20 active:scale-[0.98]"
              >
                <Icon className="w-4 h-4" />
                {label}
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
