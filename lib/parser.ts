import matter from 'gray-matter';
import { Locale } from '@/types';

export interface ParsedPostData {
  slug?: string;
  lang?: Locale;
  description?: string;
  coverImage?: string;
  body: string;
  title?: string;
}

export interface Heading {
  id: string;
  text: string;
  level: number;
}

/**
 * 从 Markdown 内容中提取标题
 */
export function extractHeadings(content: string): Heading[] {
  // 移除代码块，避免匹配代码块中的标题
  const contentWithoutCodeBlocks = content.replace(/```[\s\S]*?```/g, '');
  
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match;

  while ((match = headingRegex.exec(contentWithoutCodeBlocks)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    // 简单的 slugify，尽量匹配 rehype-slug 的行为
    const id = text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
      .replace(/^-+|-+$/g, '');
    
    headings.push({ id, text, level });
  }

  return headings;
}

/**
 * 解析 GitHub Issue 正文，支持 Gray Matter 和 GitHub Issue Form 格式
 * @param body Issue 正文内容
 */
export function parseIssueBody(body: string): ParsedPostData {
  // 尝试解析标准 Frontmatter (Gray Matter)
  const { data, content: gmContent } = matter(body);
  
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

  // 尝试解析 GitHub Issue Form 格式
  const parseSection = (header: string) => {
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
  let coverImage = parseSection('Cover Image') || parseSection('Cover Image URL');

  if (coverImage) {
    const mdImageMatch = coverImage.match(/!\[.*?\]\((.*?)\)/);
    const htmlImageMatch = coverImage.match(/<img.*?src=["'](.*?)["']/);

    if (mdImageMatch && mdImageMatch[1]) {
      coverImage = mdImageMatch[1];
    } else if (htmlImageMatch && htmlImageMatch[1]) {
      coverImage = htmlImageMatch[1];
    }
  }
  
  let content = null;
  const contentHeaderMatch = body.match(/### Content\s+/i);
  if (contentHeaderMatch) {
    const startIndex = contentHeaderMatch.index! + contentHeaderMatch[0].length;
    content = body.slice(startIndex).trim();
    if (content === '_No response_' || content === 'No response') content = null;
  }

  if (slug || content) {
    return {
      slug: slug || undefined,
      lang: (lang as Locale) || undefined,
      description: description || undefined,
      coverImage: coverImage || undefined,
      body: content || body,
      title: undefined
    };
  }

  // 兜底返回原始正文
  return {
    body,
  };
}
