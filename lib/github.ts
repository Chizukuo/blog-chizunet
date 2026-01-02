'use server';

import { Post, Locale } from '@/types';
import { parseIssueBody } from './parser';

const getRepoConfig = () => {
  const owner = process.env.REPO_OWNER;
  const name = process.env.REPO_NAME;
  const token = process.env.GITHUB_TOKEN;

  if (!owner || !name) {
    if (process.env.NODE_ENV === 'development') {
      console.warn("Missing REPO_OWNER or REPO_NAME environment variables. Please check your .env.local file.");
    }
  }

  return { 
    owner: owner || '', 
    name: name || '', 
    token 
  };
};

const getHeaders = (token?: string) => ({
  Accept: "application/vnd.github.v3+json",
  ...(token && { Authorization: `Bearer ${token}` }),
});

/**
 * 获取 GitHub Issues 作为博客文章
 * @param lang 语言
 * @param page 页码
 * @param perPage 每页数量
 */
export async function getPosts(lang: Locale = 'zh', page: number = 1, perPage: number = 100): Promise<Post[]> {
  const { owner, name, token } = getRepoConfig();
  if (!owner || !name) return [];

  const url = `https://api.github.com/repos/${owner}/${name}/issues?state=open&labels=blog&per_page=${perPage}&page=${page}`;
  
  try {
    const res = await fetch(url, {
      headers: getHeaders(token),
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error(`Failed to fetch posts: ${res.status} ${res.statusText}`);
      return [];
    }

    const issues = await res.json();
    
    if (!Array.isArray(issues)) {
      console.error("GitHub API returned non-array response");
      return [];
    }

    const posts: Post[] = issues
      .filter((issue: any) => !issue.pull_request)
      .map((issue: any) => {
        const parsed = parseIssueBody(issue.body || '');
        
        let coverImage = parsed.coverImage || '';
        if (!coverImage) {
          const imageMatch = parsed.body.match(/!\[.*?\]\((.*?)\)/) || parsed.body.match(/<img.*?src=["'](.*?)["']/);
          if (imageMatch && imageMatch[1]) {
            coverImage = imageMatch[1];
          }
        }

        return {
          ...issue,
          title: parsed.title || issue.title,
          body: parsed.body,
          slug: parsed.slug || issue.number.toString(),
          description: parsed.description || '',
          coverImage,
          lang: parsed.lang || 'zh',
        };
      })
      .filter((post: Post) => post.lang === lang);

    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

/**
 * 根据 slug 获取文章
 * @param slug 文章标识
 * @param lang 语言
 */
export async function getPostBySlug(slug: string, lang: Locale = 'zh'): Promise<Post | null> {
  const posts = await getPosts(lang);
  return posts.find((post) => post.slug === slug) || null;
}


