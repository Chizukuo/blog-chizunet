import { getPosts } from "@/lib/github";
import PostCard from "@/components/PostCard";
import CheeseHole from "@/components/CheeseHole";

export const revalidate = 60;

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="relative">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <CheeseHole className="w-32 h-32 md:w-64 md:h-64 -top-10 -left-10 md:-top-20 md:-left-20" delay={0} />
        <CheeseHole className="w-48 h-48 md:w-96 md:h-96 top-1/2 -right-10 md:-right-20" delay={2} />
        <CheeseHole className="w-20 h-20 md:w-32 md:h-32 bottom-20 left-10 md:left-1/4" delay={1} />
      </div>

      <div className="relative z-10 space-y-20 pt-20">
        <section className="text-left space-y-6 py-12 max-w-3xl">
          <h1 className="font-black leading-none tracking-tighter">
            <span className="block text-4xl md:text-5xl text-cheese-900/40 dark:text-cheese-100/40 mb-2 font-bold">
              Blog
            </span>
            <span className="block text-6xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-cheese-500 to-cheese-700 filter drop-shadow-sm pb-4">
              Thoughts & Code
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-cheese-900/80 dark:text-cheese-200/80 font-medium leading-relaxed">
            Exploring the intersection of computer science, design, and technology.
          </p>
        </section>

        <section className="grid gap-8 md:grid-cols-2">
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <div className="col-span-full text-center py-20 glass-panel rounded-[2rem]">
              <p className="text-gray-500 text-lg">No posts found. Check back later!</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
