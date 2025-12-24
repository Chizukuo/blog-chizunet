import { getPostBySlug, getPosts } from "@/lib/github";
import PostContent from "@/components/post/PostContent";
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
  const description = post.description || post.body.slice(0, 160).replace(/[#*`]/g, ''); // Clean markdown characters for description
  
  return {
    title: post.title,
    description: description,
    openGraph: {
      title: post.title,
      description: description,
      url: url,
      locale: params.lang === 'zh' ? 'zh_CN' : params.lang === 'ja' ? 'ja_JP' : 'en_US',
      type: 'article',
      publishedTime: post.created_at,
      images: post.coverImage ? [{ url: post.coverImage }] : [],
      authors: [post.user.login],
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
    },
  };
}

export default async function BlogPost({ params }: PageProps) {
  const post = await getPostBySlug(params.slug, params.lang);

  if (!post) {
    notFound();
  }

  return (
    <div className="relative">
      <PostContent initialPost={post} slug={params.slug} />
    </div>
  );
}
