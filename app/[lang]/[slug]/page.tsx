import { getPostBySlug, getPosts } from "@/lib/github";
import PostContent from "@/components/post/PostContent";
import SchemaOrg from "@/components/seo/SchemaOrg";
import { notFound } from "next/navigation";
import { Locale } from "@/types";

interface PageProps {
  params: {
    lang: Locale;
    slug: string;
  };
}

export async function generateStaticParams() {
  const languages: Locale[] = ['zh', 'en', 'ja'];
  const params: { lang: Locale; slug: string }[] = [];

  for (const lang of languages) {
    const posts = await getPosts(lang);
    posts.slice(0, 50).forEach((post) => {
      params.push({
        lang,
        slug: post.slug,
      });
    });
  }
  
  return params;
}

export async function generateMetadata({ params }: PageProps) {
  const post = await getPostBySlug(params.slug, params.lang);
  if (!post) return { title: "Post Not Found" };

  const baseUrl = 'https://blog.chizunet.cc';
  const url = `${baseUrl}/${params.lang}/${params.slug}`;
  const description = post.description || post.body.slice(0, 160).replace(/[#*`]/g, '');
  const keywords = post.labels?.map(label => label.name) || [];
  
  return {
    title: post.title,
    description: description,
    keywords: ["Blog", "Technology", ...keywords],
    openGraph: {
      title: post.title,
      description: description,
      url: url,
      locale: params.lang === 'zh' ? 'zh_CN' : params.lang === 'ja' ? 'ja_JP' : 'en_US',
      type: 'article',
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
      images: post.coverImage ? [{ url: post.coverImage }] : [],
      authors: [post.user.login],
      section: keywords[0] || 'Technology',
      tags: keywords,
      siteName: 'Chizunet Blog',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: description,
      creator: '@chizukuo',
      images: post.coverImage ? [post.coverImage] : [],
    },
    alternates: {
      canonical: url,
      languages: {
        'zh': `${baseUrl}/zh/${params.slug}`,
        'en': `${baseUrl}/en/${params.slug}`,
        'ja': `${baseUrl}/ja/${params.slug}`,
      },
    },
  };
}

export default async function BlogPost({ params }: PageProps) {
  const post = await getPostBySlug(params.slug, params.lang);

  if (!post) {
    notFound();
  }

  const description = post.description || post.body.slice(0, 160).replace(/[#*`]/g, '');

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": description,
    "image": post.coverImage ? [post.coverImage] : [],
    "datePublished": post.created_at,
    "dateModified": post.updated_at,
    "author": [{
      "@type": "Person",
      "name": post.user.login,
      "url": post.user.html_url
    }],
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://blog.chizunet.cc/${params.lang}/${params.slug}`
    }
  };

  return (
    <div className="relative">
      <SchemaOrg schema={jsonLd} />
      <PostContent initialPost={post} slug={params.slug} />
    </div>
  );
}
