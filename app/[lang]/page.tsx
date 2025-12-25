import { getPosts } from "@/lib/github";
import PostList from "@/components/post/PostList";
import { Locale } from "@/types";
import { translations } from "@/lib/translations";
import { Metadata } from "next";
import SchemaOrg from "@/components/seo/SchemaOrg";

interface PageProps {
  params: {
    lang: Locale;
  };
}

export const revalidate = 60;

export async function generateStaticParams() {
  return [
    { lang: 'zh' },
    { lang: 'en' },
    { lang: 'ja' },
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const t = translations[params.lang] ?? translations['zh'];
  const baseUrl = 'https://blog.chizunet.cc';
  const url = `${baseUrl}/${params.lang}`;

  return {
    title: {
      default: `Chizunet Blog | ${t.title}`,
      template: `%s | Chizunet Blog`
    },
    description: t.description,
    keywords: ["Blog", "Technology", "Computer Science", "Design", "GitHub Issues CMS", "Next.js", "React", "TypeScript", t.blog],
    openGraph: {
      title: `Chizunet Blog | ${t.title}`,
      description: t.description,
      url,
      locale: params.lang === 'zh' ? 'zh_CN' : params.lang === 'ja' ? 'ja_JP' : 'en_US',
      type: 'website',
      siteName: 'Chizunet Blog',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: `Chizunet Blog - ${t.title}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Chizunet Blog | ${t.title}`,
      description: t.description,
      creator: '@chizukuo',
      images: ['/og-image.png'],
    },
    alternates: {
      canonical: url,
      languages: {
        'zh': `${baseUrl}/zh`,
        'en': `${baseUrl}/en`,
        'ja': `${baseUrl}/ja`,
        'x-default': `${baseUrl}/zh`,
      },
    },
  };
}

export default async function Home({ params }: PageProps) {
  const initialPosts = await getPosts(params.lang);
  const t = translations[params.lang] ?? translations['zh'];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": `Chizunet Blog | ${t.title}`,
    "description": t.description,
    "url": `https://blog.chizunet.cc/${params.lang}`,
    "inLanguage": params.lang,
  };

  return (
    <div className="relative">
      <SchemaOrg schema={jsonLd} />
      <div className="relative z-10 pt-20">
        <PostList initialPosts={initialPosts} />
      </div>
    </div>
  );
}
