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
  
  return {
    title: post.title,
    description: post.description || post.body.slice(0, 160),
    openGraph: {
      title: post.title,
      description: post.description || post.body.slice(0, 160),
      type: 'article',
      publishedTime: post.created_at,
      images: post.coverImage ? [{ url: post.coverImage }] : [],
      authors: [post.user.login],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description || post.body.slice(0, 160),
      images: post.coverImage ? [post.coverImage] : [],
    }
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
