import { getPostBySlug, getPosts } from "@/lib/github";
import PostContent from "@/components/post/PostContent";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const posts = await getPosts();
  // Pre-render top 50 posts for better performance
  return posts.slice(0, 50).map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: "Post Not Found" };
  
  // Strip markdown for cleaner description
  const description = post.body
    .replace(/[#*`_~]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .slice(0, 160)
    .trim();
  
  return {
    title: post.title,
    description: description,
    openGraph: {
      title: post.title,
      description: description,
      type: 'article',
      publishedTime: post.created_at,
      authors: [post.user.login],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: description,
    }
  };
}

export default async function BlogPost({ params }: PageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="relative">
      <PostContent initialPost={post} slug={params.slug} />
    </div>
  );
}
