import { getPost, getPosts } from "@/lib/github";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import GiscusComments from "@/components/GiscusComments";
import CheeseHole from "@/components/CheeseHole";
import { format } from "date-fns";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";

interface PageProps {
  params: {
    number: string;
  };
}

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.slice(0, 10).map((post) => ({
    number: post.number.toString(),
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const post = await getPost(parseInt(params.number));
  if (!post) return { title: "Post Not Found" };
  
  return {
    title: `${post.title} | Chizunet Blog`,
    description: post.body.slice(0, 160),
  };
}

export default async function BlogPost({ params }: PageProps) {
  const post = await getPost(parseInt(params.number));

  if (!post) {
    notFound();
  }

  return (
    <div className="relative">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <CheeseHole className="w-32 h-32 md:w-64 md:h-64 top-20 -right-10 opacity-50" delay={0} />
        <CheeseHole className="w-20 h-20 md:w-32 md:h-32 bottom-20 left-10" delay={1} />
      </div>

      <article className="max-w-4xl mx-auto relative z-10 pt-20">
        <header className="mb-12 space-y-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-cheese-600 dark:text-cheese-400 font-bold hover:gap-3 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          
          <h1 className="text-4xl md:text-6xl font-black text-cheese-950 dark:text-cheese-50 leading-tight tracking-tighter">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-base text-cheese-900/60 dark:text-cheese-200/60 font-medium">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-cheese-100 dark:bg-stone-800 flex items-center justify-center">
                <User className="w-4 h-4 text-cheese-600" />
              </div>
              <span>{post.user.login}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <time dateTime={post.created_at}>
                {format(new Date(post.created_at), "MMMM d, yyyy")}
              </time>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {post.labels.map((label) => (
              <span
                key={label.id}
                className="text-xs font-bold px-3 py-1.5 bg-cheese-100/50 dark:bg-stone-800/50 backdrop-blur-sm text-cheese-700 dark:text-cheese-300 rounded-xl border border-cheese-200/60 dark:border-stone-700 shadow-sm"
              >
                {label.name}
              </span>
            ))}
          </div>
        </header>

        <div className="bg-white/50 dark:bg-stone-900/50 backdrop-blur-md p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-cheese-200/50 dark:border-stone-800/50 mb-12">
          <MarkdownRenderer content={post.body} />
        </div>

        <GiscusComments />
      </article>
    </div>
  );
}
