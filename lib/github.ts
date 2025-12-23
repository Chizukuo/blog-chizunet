'use server';

import { Post } from '@/types';

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

// Helper to parse slug from body or fallback to number
function parseSlug(body: string, number: number): string {
  const slugMatch = body.match(/^slug:\s*([a-z0-9-]+)/m);
  if (slugMatch && slugMatch[1]) {
    return slugMatch[1];
  }
  return number.toString();
}

// Helper to clean body and extract localized content
function getLocalizedContent(issue: any, lang: string = 'zh') {
  const fullBody = issue.body || '';
  
  // 1. Remove slug header
  const bodyWithoutSlug = fullBody.replace(/^slug:\s*[a-z0-9-]+\r?\n?---?\r?\n?/m, '').trim();
  
  // 2. Split by language markers: <!-- lang:en -->
  const sections = bodyWithoutSlug.split(/<!--\s*lang:(\w+)\s*-->/);
  
  // sections[0] is the default (zh)
  // sections[1] is lang code (e.g. 'en'), sections[2] is content
  const contentMap: Record<string, string> = {
    zh: sections[0].trim()
  };

  for (let i = 1; i < sections.length; i += 2) {
    const langCode = sections[i];
    const content = sections[i + 1];
    if (langCode && content) {
      contentMap[langCode] = content.trim();
    }
  }

  // 3. Get content for target lang, fallback to zh
  let localizedBody = contentMap[lang] || contentMap['zh'] || bodyWithoutSlug;
  let title = issue.title;

  // 4. If the localized body starts with an H1 (# Title), use it as the title
  const titleMatch = localizedBody.match(/^#\s+(.*)/m);
  if (titleMatch) {
    title = titleMatch[1];
    // Optional: remove the # Title from body to avoid double titles in UI
    localizedBody = localizedBody.replace(/^#\s+.*\r?\n?/, '').trim();
  }

  return { title, body: localizedBody };
}

export async function getPosts(lang: string = 'zh'): Promise<Post[]> {
  const { owner, name, token } = getRepoConfig();
  if (!owner || !name) return [];

  // No longer filtering by lang label, just get all blog posts
  const url = `https://api.github.com/repos/${owner}/${name}/issues?state=open&labels=blog&per_page=100`;
  
  try {
    const res = await fetch(url, {
      headers: getHeaders(token),
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch posts: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data
      .filter((issue: any) => !issue.pull_request)
      .map((issue: any) => {
        const { title, body } = getLocalizedContent(issue, lang);
        return {
          ...issue,
          title,
          body,
          slug: parseSlug(issue.body || '', issue.number),
        };
      });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export async function getPostBySlug(slug: string, lang: string = 'zh'): Promise<Post | null> {
  const posts = await getPosts(lang);
  return posts.find((post) => post.slug === slug) || null;
}
