import { getPosts } from "@/lib/github";
import PostList from "@/components/post/PostList";
import { translations } from "@/lib/translations";
import { Metadata } from "next";
import SchemaOrg from "@/components/seo/SchemaOrg";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const t = translations['zh'];
  const baseUrl = 'https://blog.chizunet.cc';
  
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
      url: baseUrl,
      locale: 'zh_CN',
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
      canonical: `${baseUrl}/zh`,
      languages: {
        'zh': `${baseUrl}/zh`,
        'en': `${baseUrl}/en`,
        'ja': `${baseUrl}/ja`,
        'x-default': `${baseUrl}/zh`,
      },
    },
  };
}

export default async function Home() {
  const initialPosts = await getPosts('zh');
  const t = translations['zh'];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": `Chizunet Blog | ${t.title}`,
    "description": t.description,
    "url": "https://blog.chizunet.cc",
    "inLanguage": "zh",
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
