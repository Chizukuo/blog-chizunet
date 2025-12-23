import { getPosts } from "@/lib/github";
import PostList from "@/components/post/PostList";

export const revalidate = 60;

export default async function Home() {
  const initialPosts = await getPosts('zh');

  return (
    <div className="relative">
      <div className="relative z-10 pt-20">
        <PostList initialPosts={initialPosts} />
      </div>
    </div>
  );
}
