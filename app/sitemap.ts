import { MetadataRoute } from 'next';
import { getPosts } from '@/lib/github';
import { Locale } from '@/types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://blog.chizunet.cc';
  const languages: Locale[] = ['zh', 'en', 'ja'];
  
  const sitemapList: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    }
  ];

  for (const lang of languages) {
    // Add language home page
    sitemapList.push({
      url: `${baseUrl}/${lang}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    });

    // Add posts for this language
    const posts = await getPosts(lang);
    const postUrls = posts.map((post) => ({
      url: `${baseUrl}/${lang}/${post.slug}`,
      lastModified: new Date(post.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
    
    sitemapList.push(...postUrls);
  }

  return sitemapList;
}
