'use server';

import { Post, Locale } from '@/types';
import { parseIssueBody } from './parser';
import { unstable_cache } from 'next/cache';

const getRepoConfig = () => {
  const owner = process.env.REPO_OWNER;
  const name = process.env.REPO_NAME;
  const token = process.env.GITHUB_TOKEN;

  if (!owner || !name) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[github.ts] Missing REPO_OWNER or REPO_NAME. Check your .env.local file.');
    }
  }

  return { owner: owner || '', name: name || '', token };
};

const getHeaders = (token?: string): Record<string, string> => ({
  Accept: 'application/vnd.github.v3+json',
  ...(token && { Authorization: `Bearer ${token}` }),
});

/**
 * 带指数退避的重试 fetch
 */
async function fetchWithRetry(
  url: string,
  headers: Record<string, string>,
  retries = 3,
  baseDelayMs = 500
): Promise<Response> {
  for (let attempt = 0; attempt < retries; attempt++) {
    const res = await fetch(url, { headers, next: { revalidate: 60 } } as any);

    // Handle rate limiting
    if (res.status === 403 || res.status === 429) {
      const resetHeader = res.headers.get('X-RateLimit-Reset');
      const retryAfterHeader = res.headers.get('Retry-After');
      const waitMs = retryAfterHeader
        ? parseInt(retryAfterHeader, 10) * 1000
        : resetHeader
        ? Math.max(0, parseInt(resetHeader, 10) * 1000 - Date.now())
        : baseDelayMs * Math.pow(2, attempt);

      if (attempt < retries - 1) {
        console.warn(`[github.ts] Rate limited. Waiting ${waitMs}ms before retry ${attempt + 1}/${retries - 1}`);
        await new Promise((r) => setTimeout(r, Math.min(waitMs, 10_000)));
        continue;
      }
    }

    // 5xx errors → retry with backoff
    if (res.status >= 500 && attempt < retries - 1) {
      const delay = baseDelayMs * Math.pow(2, attempt);
      console.warn(`[github.ts] Server error ${res.status}. Retrying in ${delay}ms…`);
      await new Promise((r) => setTimeout(r, delay));
      continue;
    }

    return res;
  }
  throw new Error(`[github.ts] All ${retries} fetch attempts failed for: ${url}`);
}

/**
 * 获取 GitHub Issues 作为博客文章
 * @param lang 语言
 * @param page 页码
 * @param perPage 每页数量
 */
async function fetchPostsFromGitHub(lang: Locale): Promise<Post[]> {
  const { owner, name, token } = getRepoConfig();
  if (!owner || !name) return [];

  const url = `https://api.github.com/repos/${owner}/${name}/issues?state=open&labels=blog&per_page=100&page=1`;

  try {
    const res = await fetchWithRetry(url, getHeaders(token));

    if (!res.ok) {
      console.error(`[github.ts] Failed to fetch posts: ${res.status} ${res.statusText}`);
      return [];
    }

    const issues = await res.json();

    if (!Array.isArray(issues)) {
      console.error('[github.ts] GitHub API returned non-array response');
      return [];
    }

    const posts: Post[] = issues
      .filter((issue: any) => !issue.pull_request)
      .map((issue: any) => {
        const parsed = parseIssueBody(issue.body || '');

        let coverImage = parsed.coverImage || '';
        if (!coverImage) {
          const imageMatch =
            parsed.body.match(/!\[.*?\]\((.*?)\)/) ||
            parsed.body.match(/<img.*?src=["'](.*?)["']/);
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
          series: parsed.series,
          category: parsed.category,
        };
      })
      .filter((post: Post) => post.lang === lang);

    const sorted = posts.sort(
      (a: Post, b: Post) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return sorted;
  } catch (error) {
    console.error('[github.ts] Error fetching posts:', error);
    return [];
  }
}

const getCachedPosts = unstable_cache(
  async (lang: Locale): Promise<Post[]> => {
    return fetchPostsFromGitHub(lang);
  },
  ['posts-list'],
  {
    revalidate: 300, // 5 minutes cache TTL
    tags: ['posts']
  }
);

export async function getPosts(
  lang: Locale = 'zh',
  page: number = 1,
  perPage: number = 100
): Promise<Post[]> {
  let posts: Post[];
  try {
    posts = await getCachedPosts(lang);
  } catch (error) {
    // Fallback if unstable_cache is run outside of Next.js server context (e.g. standalone Node utility scripts)
    posts = await fetchPostsFromGitHub(lang);
  }
  const startIndex = (page - 1) * perPage;
  return posts.slice(startIndex, startIndex + perPage);
}

/**
 * 根据 slug 获取文章
 */
export async function getPostBySlug(
  slug: string,
  lang: Locale = 'zh'
): Promise<Post | null> {
  let posts: Post[];
  try {
    posts = await getCachedPosts(lang);
  } catch (error) {
    posts = await fetchPostsFromGitHub(lang);
  }
  return posts.find((post) => post.slug === slug) || null;
}

/**
 * 根据标签获取文章列表
 */
export async function getPostsByTag(
  lang: Locale = 'zh',
  tag: string
): Promise<Post[]> {
  const posts = await getPosts(lang);
  const decoded = decodeURIComponent(tag);
  return posts.filter((post) =>
    post.labels.some(
      (label) => label.name.toLowerCase() === decoded.toLowerCase()
    )
  );
}

/**
 * 获取某语言下所有标签及计数
 */
export async function getAllTags(
  lang: Locale = 'zh'
): Promise<{ name: string; count: number; color: string }[]> {
  const posts = await getPosts(lang);
  const tagMap = new Map<string, { count: number; color: string }>();

  posts.forEach((post) => {
    post.labels.forEach((label) => {
      const existing = tagMap.get(label.name);
      if (existing) {
        existing.count++;
      } else {
        tagMap.set(label.name, { count: 1, color: label.color });
      }
    });
  });

  return Array.from(tagMap.entries())
    .map(([name, { count, color }]) => ({ name, count, color }))
    .sort((a, b) => b.count - a.count);
}

/**
 * 根据系列名称获取文章列表
 */
export async function getPostsBySeries(
  lang: Locale = 'zh',
  series: string
): Promise<Post[]> {
  const posts = await getPosts(lang);
  return posts.filter((post) => post.series === series);
}

/**
 * 获取精选/置顶文章（带有 pinned 标签）
 */
export async function getPinnedPosts(lang: Locale = 'zh'): Promise<Post[]> {
  const posts = await getPosts(lang);
  return posts.filter((post) =>
    post.labels.some((label) => label.name.toLowerCase() === 'pinned')
  );
}

/**
 * 获取博客统计数据
 */
export async function getStats(
  lang: Locale = 'zh'
): Promise<{ totalPosts: number; totalTags: number; totalSeries: number }> {
  const posts = await getPosts(lang);
  const tagSet = new Set<string>();
  const seriesSet = new Set<string>();

  posts.forEach((post) => {
    post.labels.forEach((label) => tagSet.add(label.name));
    if (post.series) seriesSet.add(post.series);
  });

  return {
    totalPosts: posts.length,
    totalTags: tagSet.size,
    totalSeries: seriesSet.size,
  };
}
