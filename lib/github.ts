'use server';

import { Post, Locale } from '@/types';
import matter from 'gray-matter';

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

export async function getPosts(lang: Locale = 'zh'): Promise<Post[]> {
  const { owner, name, token } = getRepoConfig();
  if (!owner || !name) return [];

  // Fetch all open issues with label 'blog'
  const url = `https://api.github.com/repos/${owner}/${name}/issues?state=open&labels=blog&per_page=100`;
  
  try {
    const res = await fetch(url, {
      headers: getHeaders(token),
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch posts: ${res.status} ${res.statusText}`);
    }

    const issues = await res.json();
    
    // Process issues: parse frontmatter and filter by language
    const posts: Post[] = issues
      .filter((issue: any) => !issue.pull_request)
      .map((issue: any) => {
        const parsed = parseIssueBody(issue.body || '');
        
        // Extract first image from body if no cover image in parsed data
        let coverImage = parsed.coverImage || '';
        if (!coverImage) {
          const imageMatch = parsed.body.match(/!\[.*?\]\((.*?)\)/) || parsed.body.match(/<img.*?src=["'](.*?)["']/);
          if (imageMatch && imageMatch[1]) {
            coverImage = imageMatch[1];
          }
        }

        return {
          ...issue,
          title: parsed.title || issue.title, // Frontmatter/Parsed title takes precedence
          body: parsed.body,
          slug: parsed.slug || issue.number.toString(),
          description: parsed.description || '',
          coverImage,
          lang: parsed.lang || 'zh', // Default to zh if not specified
        };
      })
      .filter((post: Post) => post.lang === lang);

    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

function parseIssueBody(body: string) {
  // 1. Try Gray Matter (Standard Frontmatter)
  const { data, content: gmContent } = matter(body);
  
  // If we find typical frontmatter keys, we assume it's a standard markdown post
  if (Object.keys(data).length > 0) {
    return {
      slug: data.slug,
      lang: data.lang,
      description: data.description,
      coverImage: data.coverImage,
      body: gmContent,
      title: data.title
    };
  }

  // 2. Try GitHub Issue Form parsing
  // Expected sections: Slug, Language, Description, Cover Image URL, Content
  
  const parseSection = (header: string) => {
    // Match "### Header" followed by optional horizontal whitespace and a newline
    // Then capture content until the next "### " or end of string
    const regex = new RegExp(`### ${header}[ \\t]*\\r?\\n([\\s\\S]*?)(?=###|$)`, 'i');
    const match = body.match(regex);
    if (!match) return null;
    let value = match[1].trim();
    if (value === '_No response_' || value === 'No response') return null;
    return value;
  };

  const slug = parseSection('Slug');
  const lang = parseSection('Language');
  const description = parseSection('Description');
  let coverImage = parseSection('Cover Image') || parseSection('Cover Image URL'); // Handle both old and new label names

  // Check if coverImage is in markdown format ![alt](url) or HTML format <img src="...">
  if (coverImage) {
    const mdImageMatch = coverImage.match(/!\[.*?\]\((.*?)\)/);
    const htmlImageMatch = coverImage.match(/<img.*?src=["'](.*?)["']/);

    if (mdImageMatch && mdImageMatch[1]) {
      coverImage = mdImageMatch[1];
    } else if (htmlImageMatch && htmlImageMatch[1]) {
      coverImage = htmlImageMatch[1];
    }
  }
  
  // Special handling for Content: take everything after "### Content"
  let content = null;
  const contentHeaderMatch = body.match(/### Content\s+/i);
  if (contentHeaderMatch) {
    const startIndex = contentHeaderMatch.index! + contentHeaderMatch[0].length;
    content = body.slice(startIndex).trim();
    if (content === '_No response_' || content === 'No response') content = null;
  }

  // If we found the 'Content' section or a 'Slug' section, we assume it's an Issue Form
  if (slug || content) {
    return {
      slug,
      lang: (lang as Locale) || undefined,
      description,
      coverImage,
      body: content || body, // Fallback to full body if content section is somehow missing but others exist
      title: undefined // Issue Form usually doesn't have a separate title field override, uses Issue Title
    };
  }

  // 3. Fallback: Raw body (Legacy or simple issues)
  return {
    body,
    slug: undefined,
    lang: undefined,
    description: undefined,
    coverImage: undefined,
    title: undefined
  };
}

export async function getPostBySlug(slug: string, lang: Locale = 'zh'): Promise<Post | null> {
  // We fetch all posts for the language and find the one with the matching slug.
  // This is efficient enough for a blog with < 100 posts. 
  // For larger scale, we might need a more direct way or caching.
  const posts = await getPosts(lang);
  return posts.find((post) => post.slug === slug) || null;
}

