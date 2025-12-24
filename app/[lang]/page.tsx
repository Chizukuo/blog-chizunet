import { getPosts } from "@/lib/github";
import PostList from "@/components/post/PostList";
import { Locale } from "@/types";

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

export default async function Home({ params }: PageProps) {
  const initialPosts = await getPosts(params.lang);

  return (
    <div className="relative">
      <div className="relative z-10 pt-20">
        <PostList initialPosts={initialPosts} />
      </div>
    </div>
  );
}
